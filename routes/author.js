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

function fetchAuthor (req, res, next) {
  client.getEntries({
    'content_type': '1kUEViTN4EmGiEaaeC6ouY',
    'include': 1,
    'fields.slug': req.originalUrl.split('/')[2]
  })
    .then(data => {
      req.author = data.items[0].fields

      console.log(req.author)

      next()
    })
    .catch(err => console.log(err))
}

router.use(fetchData)
router.use(fetchAuthor)

router.get('/', function (req, res) {
  const { categories, author } = req

  res.render('pages/author', {
    categories,
    author
  })
})

module.exports = router
