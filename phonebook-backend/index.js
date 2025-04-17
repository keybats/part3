const http = require('http')
const express = require('express')
const { log } = require('console')
const app = express()
const morgan = require('morgan')
const { runInNewContext } = require('vm')
require('dotenv').config()
const Person = require('./models/person')
const { pseudoRandomBytes } = require('crypto')


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
  Person.find({}).then(result => {
    const peopleAmount = result.length
    response.send(
      `<div> Phonebook has info for ${peopleAmount} people <br/> <br/> ${Date()} </div>`
    )
  })

})

app.get('/api/persons/:id', (request, response, next) => {
  
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    }
    else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }
      person.name = name
      person.number = number
  
      return person.save().then(updatedPerson => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))

})

app.post('/api/persons', (reqest, response, next) => {
  const body = reqest.body

  
  
    
    Person.find({name: body.name})
      .then(person => {
        
        if (person[0]) {
          person[0].number = body.number

          return person[0].save().then(updatedPerson => {
            response.json(updatedPerson)
          })
        }
        else {
          const person = new Person ({
            name: body.name,
            number: body.number
          })
        
          person.save().then(savedPerson => {
            response.json((savedPerson))
          })
          .catch(error => next(error))
        }
      })
      
  


})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message})
  }

  next(error)
}

app.use(errorHandler)