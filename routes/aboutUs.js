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
  // o nas id
  client.getEntries({
    'content_type': 'page',
    'include': 1,
    'select': 'sys.id,fields.content,fields.authors'
  })
    .then(data => {
      const { content, authors } = data.items
        .find(item => item.sys.id === '3vLWY4kZWEky02QUUkmAsc')
        .fields

      const authorsActive = []
      const authorsInactive = []

      authors.forEach(author => {
        author.fields.isActive === true ? authorsActive.push(author) : authorsInactive.push(author)
      })

      req.page = {
        content,
        authorsActive,
        authorsInactive
      }

      next()
    })
}

router.use(fetchData)
router.use(fetchEntry)

router.get('/', function (req, res) {
  const { categories, page } = req

  res.render('pages/aboutUs', {
    categories,
    page
  })
})

module.exports = router
