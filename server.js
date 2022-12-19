const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
const cors = require('cors')
app.use(cors())
require('dotenv').config()
var mongoose = require('mongoose')
const Schema = mongoose.Schema;
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})
app.use(express.static(__dirname + '/public'))
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const PersonSchema = new Schema({
  username: {
    type: String,
    required: true
  }
})
let PersonModel = mongoose.model('user', PersonSchema)
let exerciseSchema = new Schema({
  userId: {
    type: String,
  },
  description: {
    type: String,
  },
  duration: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  username: {
    type: String
  }
})
var exerciseList = mongoose.model('exerciseList', exerciseSchema)
app.use((req, res, next) => {
  console.log('method: ' + req.method)
  console.log('path: ' + req.path)
  console.log('ip: ' + req.ip)
  next()
})
app.post('/api/exercise/new-user', (req, res) => {
  let person = PersonModel({ username: req.body.username })
  PersonModel.find({ username: req.body.username }, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      if (data.length >= 1) {
        res.json({
          message: "Username Taken"
        })
      } else {
        person.save((err, info) => {
          if (err) {
            res.json(err)
          } else {
            res.json(info)
          }
        })
      }
    }
  })
})
app.post('/api/exercise/add', (req, res) => {
  if (req.body.date === "") {
    req.body.date = Date.now()
  }
  PersonModel.find({ _id: req.body.userId }, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      let exerciseTracker = new exerciseList({
        userId: req.body.userId,
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date,
        username: data[0].username
      })
      exerciseTracker.save((err, nData) => {
        if (err) {
          res.json(err)
        } else {
          res.json(nData)
        }
      })
    }
  })
})
app.get('/api/exercise/users', (req, res) => {
  PersonModel.find({ userId: req.body.userId }, (err, data) => {
    if (err) {
      res.json(err)
    } else {
      res.json(data)
    }
  })
})
app.get('/api/exercise/log', (req, res) => {
  exerciseList.find({ userId: req.query.userId }, (err, data) => {
    let obj = {
      count: data.length,
      log: data
    }
    if (err) {
      res.json(err)
    } else {
      res.json(obj)
    }
  })
})
app.get('/api/exercise/limitedlog', (req, res) => {
  let from = req.query.from
  let to = req.query.to
  let parseF = Date.parse(from)
  let parseT = Date.parse(to) + 86400000
  let total = parseInt(req.query.limit)
  exerciseList.find({ userId: req.query.userId }, (err, data) => {
    if (err) {
      res.json(err)
    } else {
      let arr = []
      data.filter(e => {
        if (Date.parse(e.date) >= parseF && Date.parse(e.date) <= parseT) {
          arr.push(e)
        } else {
          res.json({ message: 'No Entries' })
        }
      })
      res.json(arr)
    }
  })
    .limit(total)
    .exec((err, data) => {
      if (err) {
        console.log(err)
      } else {
        console.log(data)
      }
    })
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
