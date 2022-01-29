const {body, validationResult} = require('express-validator')
const safeRegEx = require('safe-regex')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const BlogNoImage = require('../models/blogNoImage')
const {uploadImage} = require('../utils/upload')
const {verifyToken} = require('../utils/token')
const {setArrayCategory} = require('../utils/category')

const categoryThemes = ["primary", "secondary", "success", "info", "warning", "danger", "royal-blue", "dark"]

blogsRouter.get('/:pageNumber', async (request, response) => {
    const pageNumber = Number(request.params.pageNumber)
    const colCountImage = await Blog.countDocuments()
    const colCountNoImage = await BlogNoImage.countDocuments()
    const noNextPage = !((pageNumber*10 < colCountImage) || (pageNumber*3 < colCountNoImage))

    const blogsBefFix = await Blog.find({}).sort({$natural: -1}).skip(10 * (pageNumber - 1)).limit(10)
    const blogsNoImageBefFix = await BlogNoImage.find({}).sort({$natural: -1}).skip(3 * (pageNumber - 1)).limit(3)
    const blogs = await Promise.all(blogsBefFix.map(async(post, i) => {
        const authorDetails = await User.findById(post.author, {fullName:1, authorAvatar:1})
        const fixed = {...post._doc,
            authorID: post.author,
            author: authorDetails.fullName,
            authorAvatar: authorDetails.authorAvatar
        }
        return fixed
    }))
    
    const blogsNoImage = await Promise.all(blogsNoImageBefFix.map(async(post, i) => {
        const authorDetails = await User.findById(post.author, {fullName:1, authorAvatar:1})
        const fixed = {...post._doc,
            authorID: post.author,
            author: authorDetails.fullName,
            authorAvatar: authorDetails.authorAvatar
        }
        return fixed
    }))

    return response.status(200).send({
        blogsList: blogs, 
        blogsListNoImage: blogsNoImage, 
        noNextPage: noNextPage
    })
}) 

blogsRouter.get('/ipublished/:id', async(request, response) => {
    await Blog.findById(request.params.id).populate("author", 'authorAvatar firstName lastName').exec((err, details) => {
        if(err){
            return response.status(404).json({error: "Page not found"})
        }
        return response.status(200).send(details)
    })
})

blogsRouter.get('/published/:id', async(request, response) => {
    await BlogNoImage.findById(request.params.id).populate("author", 'authorAvatar firstName lastName').exec((err, details) => {
        if(err){
            return response.status(404).json({error: "Page not found"})
        }
        return response.status(200).send(details)
    })
})

blogsRouter.post('/', [body('title').isString().not().isEmpty()], async(request, response) => {
    const errors = validationResult(request)
    if(!errors.isEmpty()){
        return response.status(400).json({error: "Title cannot be empty..."})
    }
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    const themeIndex = Math.floor(Math.random() * categoryThemes.length)
    const theme = categoryThemes[themeIndex]
    
    const body = {...request.body, 
        backgroundImage: await uploadImage(request.body.backgroundImage), 
        category: setArrayCategory(request.body.category),
        categoryTheme: theme
    }

    if(body.backgroundImage === "error"){
        return response.status(400).json({error: 'error on image uploading...'})
    }

    if(!body.backgroundImage) {
        const newBlogNoImage = new BlogNoImage({
            category: body.category,
            categoryTheme: body.categoryTheme,
            author: userId,
            title: body.title,
            body: body.body,
            date: body.date,
        })
        const savedBlogNoImage = await newBlogNoImage.save()
        await User.findByIdAndUpdate(userId, {
            $push: {
                "published.blogNoImage": savedBlogNoImage._id
            }
        })
        return response.status(201).send(savedBlogNoImage)
    }
   
    const newBlog = new Blog({
        backgroundImage: body.backgroundImage,
        category: body.category,
        categoryTheme: body.categoryTheme,
        author: userId,
        title: body.title,
        body: body.body,
        date: body.date,
    })
    const savedBlog = await newBlog.save()
    await User.findByIdAndUpdate(userId, {
        $push: {
            "published.blog": savedBlog._id
        }
    })
    return response.status(201).send(savedBlog)
    
})

blogsRouter.post('/search', async(request, response) => {
    const body = request.body
    if(!body.value){
        return response.status(200).send([])
    }
    if(!safeRegEx(body.value)){
        return response.status(400).json({error: 'invalid input'})
    }
    const regex = new RegExp(body.value, 'gi')
    const blogs = await Blog.find({$or: [{title: regex}, {category: regex}]}, {
        _id: 1,
        backgroundImage: 1,
        title: 1,
        body: 1,
    }).limit(body.limit)

    const blogsNo = await BlogNoImage.find({$or: [{title: regex}, {category: regex}]}, {
        _id: 1,
        title: 1,
        body: 1
    }).limit(body.limit)

    return response.status(200).send([...blogs, ...blogsNo])
})

blogsRouter.delete('/ipublished/:id', async (request, response) => {
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }

    await Blog.findByIdAndDelete(request.params.id).exec(async(err) => {
        if(err){
            return response.status(404).json({error: "Invalid url"})
        }
        await User.findByIdAndUpdate(userId, {
            $pull: {
                "published.blog": request.params.id
            }
        })
        return response.status(204).end()
    })
})

blogsRouter.delete('/published/:id', async(request, response)=> {
    const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }

    await BlogNoImage.findByIdAndDelete(request.params.id).exec(async(err) => {
        if(err){
            return response.status(404).json({error: "Invalid url"})
        }
        await User.findByIdAndUpdate(userId, {
            $pull: {
                "published.blogNoImage": request.params.id
            }
        })
        return response.status(204).end()
    })
})

blogsRouter.put('/ipublished/:id', async (request, response) => {
    const body = request.body
    await Blog.findByIdAndUpdate(request.params.id, body).exec((err) => {
        if(err){
            return response.status(404).json({error: "Invalid request"})
        }
        return response.status(200).end()
    })
})

blogsRouter.put('/published/:id', async (request, response) => {
    const body = request.body
    await BlogNoImage.findByIdAndUpdate(request.params.id, body).exec((err) => {
        if(err){
            return response.status(404).json({error: "Invalid request"})
        }
        return response.status(200).end()
    })
}) 

module.exports = blogsRouter