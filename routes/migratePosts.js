if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express')
const contentful = require('contentful-management')

let posts = require('../posts_parsed.json')
// const categories = require('../categories.json')

const categories = [{
  'id': '1',
  'url': 'na-czasie',
  category: {
    sys: {
      id: '6XL7nwqRZ6yEw0cUe4y0y6',
      linkType: 'Entry',
      type: 'Link'
    }
  }
}, {
  'id': '2',
  'url': 'wsrod-ludzi',
  category: {
    sys: {
      id: 'FJlJfypzaewiwyukGi2kI',
      linkType: 'Entry',
      type: 'Link'
    }
  }
}, {
  'id': '3',
  'url': 'w-slowach',
  category: {
    sys: {
      id: '2gQk6gTv4YO2eEg2Ug0IqI',
      linkType: 'Entry',
      type: 'Link'
    }
  }
}, {
  'id': '4',
  'url': 'w-muzyce',
  category: {
    sys: {
      id: '1m2Y7m4y1mWewmWEs2A6cc',
      linkType: 'Entry',
      type: 'Link'
    }
  }
}, {
  'id': '5',
  'url': 'na-ekranie',
  category: {
    sys: {
      id: '2GoxqwL892Qcw6GGMe6yGa',
      linkType: 'Entry',
      type: 'Link'
    }
  }
}, {
  'id': '6',
  'url': 'w-obrazach',
  category: {
    sys: {
      id: '4TpouJYf8sK2ccAisGEgYc',
      linkType: 'Entry',
      type: 'Link'
    }
  }
}, {
  'id': '7',
  'url': 'w-przekroju',
  category: {
    sys: {
      id: '2T418fHqkgig6YaQyeMGUq',
      linkType: 'Entry',
      type: 'Link'
    }
  }
}]

const router = express.Router()
const SPACE_ID = process.env.SPACE_ID

const client = contentful.createClient({
  accessToken: process.env.ACCESS_TOKEN
})

function removeEntries (space) {
  space.getEntries({
    'content_type': 'post',
    'select': 'sys.id'
  })
  .then(data => {
    data.items.forEach(entry => {
      space.getEntry(entry.sys.id)
        // .then(entry => console.log(entry.fields.author['pl-PL'][0].sys))
        // .then(entry => entry.unpublish())
        .then(entry => entry.delete())
    })
  })
}

function getCategory (post) {
  return categories.find(category => {
    if (category.id === post.category_id) {
      return true
    }
  }).category
}

function createEntries (space, post) {
  space.createEntry('post', post)
}

function prepareEntries (posts) {
  return posts.map(post => {
    return {
      fields: {
        lead: { 'pl-PL': post.lead },
        title: { 'pl-PL': post.title },
        slug: { 'pl-PL': post.url },
        body: { 'pl-PL': post.content },
        tileInfo: { 'pl-PL': post.tile_description },
        imgSource: { 'pl-PL': post.picture_source },
        oldId: { 'pl-PL': parseInt(post.id, 10) },
        category: { 'pl-PL': getCategory(post) }
        // author: {
        //   'pl-PL': [
        //     { sys: {
        //       id: '6033k0fC9yyWsyCUkOAMOQ',
        //       linkType: 'Entry',
        //       type: 'Link'
        //     }}
        //   ]
        // }
      }
    }
  })
}

function processJson (req, res, next) {
  posts = posts.slice(0, 1)

  client.getSpace(SPACE_ID)
    .then(space => {
      // removeEntries(space)

      posts = prepareEntries(posts)
      posts.forEach(post => createEntries(space, post))
    })
    .catch(err => console.log(err))

  next()
}

router.use(processJson)

router.get('/', function (req, res) {
  res.sendStatus(200)
})

module.exports = router
