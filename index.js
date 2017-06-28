const path = require('path')
const express = require('express')
const app = express()
const favicon = require('serve-favicon')

const index = require('./routes/index')

// static pages
const aboutUs = require('./routes/aboutUs')
const contact = require('./routes/contact')

app.set('port', (process.env.PORT || 5000))
app.use(favicon(path.join(__dirname, '/public', 'img', 'favicon.ico')))
app.use(express.static(path.join(__dirname, '/public')))

// views is directory for all template files
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

app.use('/', index)
app.use('/o-nas', aboutUs)
app.use('/kontakt', contact)

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
