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

function fetchEntry (req, res, next) {
  // kontakt id
  client.getEntry('64gewEt2jSKOWIKCOKqGAI')
    .then(entry => {
      req.page = entry.fields

      next()
    })
}

router.use(fetchData)
router.use(fetchEntry)

router.get('/', function (req, res) {
  res.render('pages/contact', {
    categories: req.categories,
    page: req.page
  })
})

module.exports = router
