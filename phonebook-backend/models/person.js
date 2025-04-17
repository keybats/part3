const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: (v) => { 
        const number = v.split('')
        let nonInts = 0
        
        if (number[2] === '-' || number[3] === '-') {
          
          number.forEach(element => {
            console.log(parseInt(element))
            if (isNaN(parseInt(element))) {
              
              nonInts++
            }
          })
        }
        
        if (nonInts === 1) {
          return true
        }
        else {
          return false
        }
      }, message: props => `${props.value} is not a valid phonenumber!`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)