if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express')
const contentful = require('contentful-management')

let posts = require('../posts_parsed.json').filter(post => post.status === 'active')
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
}, {
  'id': '13',
  'url': 'bez-kategorii',
  category: {
    sys: {
      id: '6RUeM8XnnqicyykioM2eq4',
      linkType: 'Entry',
      type: 'Link'
    }
  }
}]

const cycles = [{ name: 'Wywiady',
  slug: 'cykl/39/wywiady/',
  id: '39',
  entryId: '1Uu5eK7ngMEu8oywecGiQo' }
,
{ name: 'Temat miesiąca',
  slug: 'cykl/33/temat-miesiaca/',
  id: '33',
  entryId: 'rs3Z4EIqekAo8aeCsQu6u' }
,
{ name: 'Recenzje',
  slug: 'cykl/28/recenzje/',
  id: '28',
  entryId: 'DJ8JGenp2Suoos2AoyOay' }
,
{ name: 'Relacje',
  slug: 'cykl/34/relacje/',
  id: '34',
  entryId: '3a1ZUn67mo8qYkmE8kO40w' }
,
{ name: 'Lwy salonowe',
  slug: 'cykl/30/lwy-salonowe/',
  id: '30',
  entryId: '4oIobFqoNOsyQMMeC8a6k6' }
,
{ name: 'Prime Time',
  slug: 'cykl/15/prime-time/',
  id: '15',
  entryId: '58mSvg7XRuk8oCckqYY2oG' }
,
{ name: 'Social Power',
  slug: 'cykl/44/Social-Power/',
  id: '44',
  entryId: '39IMTGrEEUCG80cyiq2MyQ' }
,
{ name: 'Zwoje rozwoju',
  slug: 'cykl/37/Zwoje-rozwoju/',
  id: '37',
  entryId: 'arOk0HbyCI42y2wWAoyoM' }
,
{ name: 'Miasto projektowane',
  slug: 'cykl/22/miasto-projektowane/',
  id: '22',
  entryId: '61InA4SFos6YqCucakaIUI' }
,
{ name: 'Rozbij grę',
  slug: 'cykl/36/Rozbij-gre/',
  id: '36',
  entryId: '5wHEWLxU3KucG8csiaqOQM' }
,
{ name: 'Meandry kultury',
  slug: 'cykl/11/meandry-kultury/',
  id: '11',
  entryId: '2zPkuY4MCsuQUCE8eW4QQI' }
,
{ name: 'Klasyka do herbaty',
  slug: 'cykl/43/Klasyka-do-herbaty/',
  id: '43',
  entryId: '5CsswgBSzSQSaeW2McaIsc' }
,
{ name: 'Żywe słowa',
  slug: 'cykl/18/zywe-slowa/',
  id: '18',
  entryId: '2RSXrevdGMIiWGSaIMC4cy' }
,
{ name: 'Fantastyczny problem',
  slug: 'cykl/25/fantastyczny-problem/',
  id: '25',
  entryId: '5sjKPd6ZC8mcu40GoeUYEA' }
,
{ name: 'Poezje nieoczywiste',
  slug: 'cykl/32/poezje-nieoczywiste/',
  id: '32',
  entryId: '12OLrLbTWKsqiKG6QcOOcs' }
,
{ name: 'Wyrazy wyraziste',
  slug: 'cykl/10/wyrazy-wyraziste/',
  id: '10',
  entryId: '5llKtII1tS08IUC0OGKogo' }
,
{ name: 'Muzyka dla mas/nas',
  slug: 'cykl/26/muzyka-dla-mas-nas/',
  id: '26',
  entryId: 'isexwChMCk2ww4O4KmMo8' }
,
{ name: 'Adaptacje&sensacje',
  slug: 'cykl/16/adaptacje-sensacje/',
  id: '16',
  entryId: '2ZiFOf1azuaY0WqmaycGsA' }
,
{ name: 'Filmowa masakra',
  slug: 'cykl/42/Filmowa-masakra/',
  id: '42',
  entryId: '5vwoUr4QlUm2ywwmIW0mwg' }
,
{ name: 'Filmowe konfrontacje',
  slug: 'cykl/40/Filmowe-konfrontacje/',
  id: '40',
  entryId: '4nuXWEDYrKCIkoI6OCAuGI' }
,
{ name: 'Dziesięć kochanek Filmu',
  slug: 'cykl/9/dziesiec-kochanek-filmu/',
  id: '9',
  entryId: '2kigckJYaAIyAEoouQQKUs' }
,
{ name: 'Królowie absurdu',
  slug: 'cykl/35/Krolowie-absurdu/',
  id: '35',
  entryId: '4238y1EMXmyageqsacM6yc' }
,
{ name: 'Kultura w dymkach',
  slug: 'cykl/24/kultura-w-dymkach/',
  id: '24',
  entryId: '1Mhtc2smRGIA66KK2uwySu' }
,
{ name: 'Ścieżki malarstwa',
  slug: 'cykl/27/sciezki-malarstwa/',
  id: '27',
  entryId: '7nzXFQf2Tu6WIKyEugQMaI' }
,
{ name: 'Winnie the Book',
  slug: 'cykl/41/Winne-the-book/',
  id: '41',
  entryId: '1vFc8pBp1OWYeay4Ma6EKu' }
,
{ name: 'Mityng',
  slug: 'cykl/38/Mityng/',
  id: '38',
  entryId: 'kjNBqkuUxMU6A2288Guu6' }
,
{ name: 'Imaginacje&inspiracje',
  slug: 'cykl/17/imaginacje-inspiracje/',
  id: '17',
  entryId: '6I5zkq045aGkCSKKE6EYEM' }
,
{ name: 'LUS|TRO',
  slug: 'cykl/12/lustro/',
  id: '12',
  entryId: '3deslrhbV68oqiawoK6wsq' }
,
{ name: 'Popkulturowy bestiariusz',
  slug: 'cykl/29/popkulturowy-bestiariusz/',
  id: '29',
  entryId: 'HRdCM3QtA2EEk4OuGMAGy' }
,
{ name: 'Przepis na:',
  slug: 'cykl/21/przepis-na/',
  id: '21',
  entryId: '5ze9dJzSvusYauqAgqYoKi' }]

const authors = [ 
  { entryId: 'zWJpIcNdiS0qI4IQIUc4k', author_id: 22 },
  { entryId: '6G28Yc3O7Ksouui6KUuc0K', author_id: 7 },
  { entryId: '5lqkxCpmEgoeeE4Gmy2iuo', author_id: 29 },
  { entryId: '5grpaMzrdKiWYUqoYKUGUk', author_id: 15 },
  { entryId: '78ZCPNWjIsu4m2suGeSka2', author_id: 30 },
  { entryId: 'mdipVAVDW0yaw66QI22Q0', author_id: 28 },
  { entryId: '1lOdjrfx1yWqgYM64iQKyK', author_id: 16 },
  { entryId: '5aPhQ2EZ9KCsGmwQ00I8ei', author_id: 4 },
  { entryId: '4OMMylRpokq0wkgyCesG2M', author_id: 26 },
  { entryId: '6033k0fC9yyWsyCUkOAMOQ', author_id: 11 },
  { entryId: '7A6Oz56oa4wmGkGWOQu6Sc', author_id: 23 },
  { entryId: '7N2kC0a4IocUgwWCc4uuqi', author_id: 20 },
  { entryId: '279x1Cv9YUmeCI8WUou0Oo', author_id: 25 },
  { entryId: 'TRj4ULcVaw8sgok8UCc4S', author_id: 9 },
  { entryId: '2mWCC08C1uCUqEc0QAIWIQ', author_id: 6 },
  { entryId: '1mJ8Vxu0aEA8O266sYEEsw', author_id: 27 },
  { entryId: '38UHqdVF44ikoAaus4g6UO', author_id: 10 } ]

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

function getCycle (post) {
  return cycles.find(c => {
    if (c.id === post.serie_id) {
      return true
    }
  });
}

function getAuthor (post) {
  return authors.find(a => {
    if (a.author_id.toString() === post.author_id) {
      return true
    }
  })
}

function createEntries (space, post) {
  setTimeout(() => {
    space.createEntry('post', post)
  }, 2000)
}

function prepareEntries (posts) {
  return posts.map(post => {
    const authorEntry = getAuthor(post)

    let cycle
    const cycleId = getCycle(post)

    if (cycleId) {
      cycle = { 'pl-PL': {sys: {
          id: cycleId.entryId,
          linkType: 'Entry',
          type: 'Link'
        }}
      }
    } else {
      cycle = { 'pl-PL': {sys: {
          id: categories.find(c => c.id === '13').entryId,
          linkType: 'Entry',
          type: 'Link'
        }}
      }
    }

    const entry = {
      fields: {
        lead: { 'pl-PL': post.lead },
        title: { 'pl-PL': post.title },
        slug: { 'pl-PL': post.url },
        body: { 'pl-PL': post.content },
        tileInfo: { 'pl-PL': post.tile_description },
        imgSource: { 'pl-PL': post.picture_source },
        oldId: { 'pl-PL': parseInt(post.id, 10) },
        category: { 'pl-PL': getCategory(post) },
        date: { 'pl-PL': post.created_date.split(' ')[0] },
        featuredImageOldUrl: { 'pl-PL': `http://zcyklu.linuxpl.eu/uploaded/${post.thumb}` },
        cycle
      }
    }

    if (authorEntry) {
      entry.fields.author = { 'pl-PL': [
          {
            sys:
            {
              id: authorEntry.entryId,
              linkType: 'Entry',
              type: 'Link'
            }
          }]
        }
    }

    return entry
  })
}

// n - int from 0 to N, eg. 0, 1, 2, 3...
function slice (posts, n) {
  return posts.slice(n * 10, (n + 1) * 10)
}

const createEntriesInBatches = (posts, space) => {
  const interval = setInterval(makeCallToCrateEntries, 1000 * 4);
  let i = 0
  const postsLimit = Math.ceil(posts.length / 10)

  console.log('--create entries in batches started')

  function makeCallToCrateEntries() {
    if (i >= postsLimit) {
      console.log('create entries in batches ended --')
      clearInterval(interval)

      return
    }

    console.log(`sent batch nr: ${i}/${postsLimit}`)

    const postsBatch = slice(posts, i)

    postsBatch.forEach(post => createEntries(space, post))

    i++
  }
}

function processJson (req, res, next) {
  client.getSpace(SPACE_ID)
    .then(space => {
      // removeEntries(space)

      posts = prepareEntries(posts)
      createEntriesInBatches(posts, space)
    })
    .catch(err => console.log(err))

  // posts = posts.filter(p => {
  //   if (p.title !== 'test') {
  //     return true
  //   }
  // })

  req.posts = posts

  next()
}

router.use(processJson)

router.get('/', function (req, res) {
  res.sendStatus(200)
})

module.exports = router
