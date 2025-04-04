const http = require('http')
const express = require('express')
const { log } = require('console')
const app = express()
const morgan = require('morgan')
const { runInNewContext } = require('vm')
const cors = require('cors')

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
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(
    `<div> Phonebook has info for ${persons.length} people <br/> <br/> ${Date()} </div>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)
  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
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
  if(persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }
  

  const person = {
    id: String(Math.floor(Math.random() * 10000)),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json((person))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})