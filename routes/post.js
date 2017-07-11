if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express')
const contentful = require('contentful')

const router = express.Router()

const client = contentful.createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN
})

function fetchData (req, res, next) {
  client.getEntries({
    'content_type': '5KMiN6YPvi42icqAUQMCQe',
    'include': 1,
    'order': 'fields.position',
    'select': 'fields.title,fields.className,fields.itsCycles'
  })
    .then(data => data.items.map(item => {
      const { title, className, itsCycles } = item.fields

      return {
        title,
        className,
        cycles: itsCycles
      }
    }))
    .then(categories => {
      categories.map(category => {
        if (!category.cycles) {
          return Object.assign(category, {
            cycles: []
          })
        }

        return Object.assign(category, {
          cycles: category.cycles.map(cycle => {
            const { name, slug } = cycle.fields

            return {
              name,
              slug
            }
          })
        })
      })

      req.categories = categories

      next()
    })
    .catch(err => console.log(err))
}

function fetchPost (req, res, next) {
  client.getEntries({
    'content_type': 'post',
    'include': 1,
    'fields.oldId': parseInt(req.originalUrl.split('/')[2], 10)
  })
    .then(data => {
      req.post = data.items[0].fields

      next()
    })
    .catch(err => console.log(err))
}

router.use(fetchData)
router.use(fetchPost)

router.get('/', function (req, res) {
  const { categories, post } = req

  res.render('pages/post', {
    categories,
    post,
    originalUrl: `${req.protocol}://${req.headers.host}${req.originalUrl}`
  })
})

module.exports = router
