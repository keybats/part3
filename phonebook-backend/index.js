const http = require('http')
const express = require('express')
const { log } = require('console')
const app = express()
const morgan = require('morgan')
const { runInNewContext } = require('vm')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Dovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]




app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

morgan.token('content', (req, res) => {return JSON.stringify(req.body)})



app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/info', (request, response) => {
  response.send(
    `<div> Phonebook has info for ${persons.length} people <br/> <br/> ${Date()} </div>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  console.log("deleted", id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})



app.post('/api/persons', (reqest, response) => {
  const body = reqest.body
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'number or name missing' 
    })
  }
  
  const person = new Person ({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json((savedPerson))
  })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})