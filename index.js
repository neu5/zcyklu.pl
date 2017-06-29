const path = require('path')
const express = require('express')
const app = express()
const favicon = require('serve-favicon')


// @TODO: put it in the config file and create regex from that
const postsRe = /\/(w-przekroju|na-czasie|w-obrazach|na-ekranie|w-muzyce|w-slowach|wsrod-ludzi)\/.*/

// const index = require('./routes/index')
const post = require('./routes/post')
const cycle = require('./routes/cycle')
const author = require('./routes/author')

// experimental
// const migratePosts = require('./routes/migratePosts')

// static pages
const aboutUs = require('./routes/aboutUs')
const contact = require('./routes/contact')

app.set('port', (process.env.PORT || 5001))
app.use(favicon(path.join(__dirname, '/public', 'img', 'favicon.ico')))
app.use(express.static(path.join(__dirname, '/public')))

// views is directory for all template files
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')


app.use('/', index)
app.use(postsRe, post)
app.use('/cykl/*', cycle)
app.use('/autor/*', author)

// experimental
// app.use('/', migratePosts)

app.use('/o-nas', aboutUs)
app.use('/kontakt', contact)

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
