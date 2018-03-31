if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express')
const contentful = require('contentful')
const ellipsize = require('ellipsize')
const striptags = require('striptags')

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

function fetchPosts (req, res, next) {
  client.getEntries({
    'content_type': 'post',
    'include': 1,
    'order': '-fields.date',
    'select': 'fields.title,fields.tileInfo,fields.lead,fields.author,fields.category,fields.cycle,fields.slug,fields.oldId,fields.date,fields.featuredImageOldUrl'
  })
    .then(data => {
      const posts = data.items.map((post, idx) => {
        if (idx === 0) {
          req.mainPost = post
        }

        if (idx === 1) {
          post.bigPost = true
        }

        return post
      }).slice(1)

      req.posts = posts.map(post => {
        if (!post.fields.tileInfo.length) {
          post.fields.tileInfo = striptags(post.fields.lead)
        }

        post.fields.tileInfo = ellipsize(post.fields.tileInfo, 180, { chars: ' ' })

        return post
      })

      next()
    })
}

router.use(fetchData)
router.use(fetchPosts)

router.get('/', function (req, res) {
  const { categories, mainPost, posts } = req

  res.render('pages/index', {
    categories,
    mainPost,
    posts
  })
})

module.exports = router