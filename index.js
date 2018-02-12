const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :body :status :res[content-length] - :response-time'))

  
app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.send(
        '<p>puhelinluettelossa on ' + persons.length + ' henkilön tiedot</p>\
        <p>' + new Date() + '</p>\
        '
      )
    })
    .catch(error => {
      console.log(error)
      // ...
    })
  
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
    .catch(error => {
      console.log(error)
      // ...
    })
})

app.get('/api/persons/:id', (req, res) => {
  
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(Person.format(person))
    })
    .catch(error => {
      console.log(error)
      response.status(404).json({ error: 'Person not found' })
    })
})

app.post('/api/persons', (req, res) => {

  const body = req.body
  
  if (body.name === undefined || body.number === undefined) {
    res.status(400).json({ error: 'name or number missing ' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  Person
    .find({ name: body.name })
    .then(result => {
      if (result.length > 0) {
        res.status(400).json({ error: 'name already exists' })
      }
      else {
        person
        .save()
        .then(savedPerson => {
          res.json(Person.format(savedPerson))
        })
        .catch(error => {
          console.log(error)
          // ...
        })
      }
    })
  
})

app.delete('/api/persons/:id', (req, res) => {

  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})