const countRouter = require('express').Router()
const {verifyToken} = require('../utils/token')
const Blog = require('../models/blog')
const BlogNoImage = require('../models/blogNoImage')
const User = require('../models/user')

const returnedObj = {
  label: "",
  value: "",
  percentage: "",
  increase: null,
  decrease: null,
  chartLabels: [null, null, null, null, null, null, null],
  attrs: { md: "6", sm: "6" },
  datasets: [
    {
      label: "Today",
      fill: "start",
      borderWidth: 1.5,
      backgroundColor: "",
      borderColor: "",
      data: []
    }
  ]
}

const dateForamat = {'year': 'numeric', 'month': 'long', 'day': 'numeric'}
let date = new Date()
const today = new Date()
date.setDate(today.getDate() - 4)
const dayOne = new Date(date).toLocaleDateString("en-US", dateForamat)
date.setDate(today.getDate() - 3)
const dayTwo = new Date(date).toLocaleDateString("en-US", dateForamat)
date.setDate(today.getDate() - 2)
const dayThree = new Date(date).toLocaleDateString("en-US", dateForamat)
date.setDate(today.getDate() - 1)
const dayFour = new Date(date).toLocaleDateString("en-US", dateForamat)
const dayFive = new Date(today).toLocaleDateString("en-US", dateForamat)


countRouter.get('/posts', async(request, response) => {
    const dataSet = []

    const blogs = await Blog.countDocuments()
    const blogsNoImage = await BlogNoImage.countDocuments()

    dataSet.push(await Blog.countDocuments({date: dayOne}))
    dataSet.push(await Blog.countDocuments({date: dayTwo}))
    dataSet.push(await Blog.countDocuments({date: dayThree}))
    dataSet.push(await Blog.countDocuments({date: dayFour}))
    dataSet.push(await Blog.countDocuments({date: dayFive}))

    returnedObj.label = "All Posts"
    returnedObj.value = `${blogs + blogsNoImage}`
    returnedObj.increase = dataSet[4] > dataSet[3]
    returnedObj.decrease = dataSet[4] < dataSet[3]
    returnedObj.datasets = [{...returnedObj.datasets[0], 
      backgroundColor: "rgba(0, 184, 216, 0.1)",
      borderColor: "rgb(0, 184, 216)",
      data: dataSet
    }]
    returnedObj.percentage = !returnedObj.datasets[0].data[3] ? '0.00%' : `${(returnedObj.datasets[0].data[4] * 100 / returnedObj.datasets[0].data[3]).toFixed(2)}%`

    return response.status(200).send(returnedObj)
})

countRouter.get('/published', async(request, response) => {
  const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }

  const dataSet = []

  const blogs = await Blog.countDocuments({author: userId})
  const blogsNoImage = await BlogNoImage.countDocuments({author: userId})

  dataSet.push(await Blog.countDocuments({author: userId, date: dayOne}))
  dataSet.push(await Blog.countDocuments({author: userId, date: dayTwo}))
  dataSet.push(await Blog.countDocuments({author: userId, date: dayThree}))
  dataSet.push(await Blog.countDocuments({author: userId, date: dayFour}))
  dataSet.push(await Blog.countDocuments({author: userId, date: dayFive}))

  returnedObj.label = "You Published"
  returnedObj.value = `${blogs + blogsNoImage}`
  returnedObj.increase = dataSet[4] > dataSet[3]
  returnedObj.decrease = dataSet[4] < dataSet[3]
  returnedObj.datasets = [{...returnedObj.datasets[0], 
    backgroundColor: "rgba(23,198,113,0.1)",
    borderColor: "rgb(23,198,113)",
    data: dataSet
  }]
  returnedObj.percentage = !returnedObj.datasets[0].data[3] ? '0.00%' : `${(returnedObj.datasets[0].data[4] * 100 / returnedObj.datasets[0].data[3]).toFixed(2)}%`

  return response.status(200).send(returnedObj)
})

countRouter.get('/draft', async(request, response) => {
  const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    const dataSet = []

    const user = await User.findById(userId)
    const draftCount = user.draft.length
    const countByDay = (day) => {
      const data = user.draft.filter(item => item.date === day)
      return data.length
    }
    
    dataSet.push(countByDay(dayOne))
    dataSet.push(countByDay(dayTwo))
    dataSet.push(countByDay(dayThree))
    dataSet.push(countByDay(dayFour))
    dataSet.push(countByDay(dayFive))

    returnedObj.label = "Your Draft"
    returnedObj.value = `${draftCount}`
    returnedObj.increase = dataSet[4] > dataSet[3]
    returnedObj.decrease = dataSet[4] < dataSet[3]
    returnedObj.datasets = [{...returnedObj.datasets[0], 
      backgroundColor: "rgba(255,180,0,0.1)",
      borderColor: "rgb(255,180,0)",
      data: dataSet
    }]
    returnedObj.percentage = !returnedObj.datasets[0].data[3] ? '0.00%' : `${(returnedObj.datasets[0].data[4] * 100 / returnedObj.datasets[0].data[3]).toFixed(2)}%`
    
    return response.status(200).send(returnedObj)
})

countRouter.get('/author', async(request, response) => {

  const dataSet = []

  const userCount = await User.countDocuments()

  dataSet.push(await User.countDocuments({date: dayOne}))
  dataSet.push(await User.countDocuments({date: dayTwo}))
  dataSet.push(await User.countDocuments({date: dayThree}))
  dataSet.push(await User.countDocuments({date: dayFour}))
  dataSet.push(await User.countDocuments({date: dayFive}))

  returnedObj.label = "Authors"
  returnedObj.value = `${userCount}`
  returnedObj.increase = dataSet[4] > dataSet[3]
  returnedObj.decrease = dataSet[4] < dataSet[3]
  returnedObj.datasets = [{...returnedObj.datasets[0], 
    backgroundColor: "rgba(255,65,105,0.1)",
    borderColor: "rgb(255,65,105)",
    data: dataSet
  }]
  returnedObj.percentage = !returnedObj.datasets[0].data[3] ? '0.00%' : `${(returnedObj.datasets[0].data[4] * 100 / returnedObj.datasets[0].data[3]).toFixed(2)}%`
  
  return response.status(200).send(returnedObj)
}) 

module.exports = countRouter