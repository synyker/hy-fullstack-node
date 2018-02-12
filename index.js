const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :body :status :res[content-length] - :response-time'))

let persons = [
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]
  
app.get('/info', (req, res) => {
  res.send(
    '<p>puhelinluettelossa on ' + persons.length + ' henkilön tiedot</p>\
    <p>' + new Date() + '</p>\
    '
  )
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  
  const person = req.body

  if (!person.name || !person.number) {
    res.status(500).json({ error: 'name or number missing' });
  }

  const nameExists = persons.find(p => p.name === person.name)

  if (nameExists) {
    res.status(500).json({ error: 'name must be unique' })
  }

  person.id = Math.floor(Math.random() * 9999999)

  persons = persons.concat(person)
  
  res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log(id)
  const person = persons.find(person => person.id === id)
  console.log(person)
  if (person) {
    res.json(person)
  }
  else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = persons.findIndex(person => person.id === id)
  
  if (index < 0) {
    res.status(404).end()
  }
  else {
    persons.splice(index, 1)
    res.status(200).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})