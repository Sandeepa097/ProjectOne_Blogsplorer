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
    const noNextPage = !((colCountImage < pageNumber*10) || (colCountNoImage < pageNumber*3))

    const blogsBefFix = await Blog.find({}).sort({$natural: -1}).skip(10 * (pageNumber - 1)).limit(10)
    const blogsNoImageBefFix = await BlogNoImage.find({}).sort({$natural: -1}).skip(3 * (pageNumber - 1)).limit(3)
    const blogs = await Promise.all(blogsBefFix.map(async(post, i) => {
        const authorDetails = await User.findById(post.author, {firstName:1, lastName:1, authorAvatar:1})
        const fixed = {...post._doc,
            author: authorDetails.firstName + ' ' + authorDetails.lastName,
            authorAvatar: authorDetails.authorAvatar
        }
        return fixed
    }))
    
    const blogsNoImage = await Promise.all(blogsNoImageBefFix.map(async(post, i) => {
        const authorDetails = await User.findById(post.author, {firstName:1, lastName:1, authorAvatar:1})
        const fixed = {...post._doc,
            author: authorDetails.firstName + ' ' + authorDetails.lastName,
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

blogsRouter.post('/', async(request, response) => {
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
                published: savedBlogNoImage._id
            }
        })
        return response.status(201).json(savedBlogNoImage)
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
            published: savedBlog._id
        }
    })
    return response.status(201).json(savedBlog)
    
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    await Blog.findByIdAndUpdate(request.params.id, body)
    return response.status(200).end()
}) 

module.exports = blogsRouter