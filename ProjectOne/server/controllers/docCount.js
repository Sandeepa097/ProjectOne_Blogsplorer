const countRouter = require('express').Router()
const {verifyToken} = require('../utils/token')
const Blog = require('../models/blog')
const BlogNoImage = require('../models/blogNoImage')
const User = require('../models/user')
const {getGraphData} = require('../utils/setGraph')

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

const dateFormat = {'year': 'numeric', 'month': 'long', 'day': 'numeric'}
const today = new Date()
let date = new Date()
let dates = []

for(let i = 5; i >= 0; i--) {
  date.setDate(today.getDate() - i)
  dates.push(new Date(date).toLocaleDateString("en-US", dateFormat))
}

countRouter.get('/posts', async(_request, response) => {
    const dataSet = []
    const totalDocs = await Blog.countDocuments() + await BlogNoImage.countDocuments()
    
    for(const item of dates){
      dataSet.push(await Blog.countDocuments({date: item}) + await BlogNoImage.countDocuments({date: item}))
    }

    const datasets = {
      backgroundColor: "rgba(0, 184, 216, 0.1)",
      borderColor: "rgb(0, 184, 216)",
      data: dataSet
    }

    const graphData = getGraphData("All Posts", `${totalDocs}`, datasets, "No posts yesterday" )

    return response.status(200).send(graphData)
})

countRouter.get('/published', async(request, response) => {
  const userId = verifyToken(request)
    if(!userId) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }

  const dataSet = []
  const totalDocs = await Blog.countDocuments({author: userId}) + await BlogNoImage.countDocuments({author: userId})
  
  for(const item of dates){
    dataSet.push(await Blog.countDocuments({author: userId, date: item}) + await BlogNoImage.countDocuments({author: userId, date: item}))
  }

  const datasets = { 
    backgroundColor: "rgba(23,198,113,0.1)",
    borderColor: "rgb(23,198,113)",
    data: dataSet
  }

  const graphData = getGraphData("You Published", `${totalDocs}`, datasets, "Nothing in yesterday" )

  return response.status(200).send(graphData)
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
    
    for(const item of dates){
      dataSet.push(countByDay(item))
    }

    const datasets = { 
      backgroundColor: "rgba(255,180,0,0.1)",
      borderColor: "rgb(255,180,0)",
      data: dataSet
    }

    const graphData = getGraphData("Your Draft", `${draftCount}`, datasets, "Nothing from yesterday" )

    return response.status(200).send(graphData)
})

countRouter.get('/author', async(_request, response) => {

  const dataSet = []
  const userCount = await User.countDocuments()

  for(const item of dates){
    dataSet.push(await User.countDocuments({date: item}))
  }

  const datasets = { 
    backgroundColor: "rgba(255,65,105,0.1)",
    borderColor: "rgb(255,65,105)",
    data: dataSet
  }

  const graphData = getGraphData("Authors", `${userCount}`, datasets, "No one joined yesterday" )

  return response.status(200).send(graphData)
}) 

module.exports = countRouter