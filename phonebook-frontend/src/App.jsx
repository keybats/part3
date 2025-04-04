import { useState, useEffect } from 'react'
import personServices from './services/persons'
import Persons from './components/Persons'

const Notification = ({message}) => {
  
  if (message === null) {
    return null    
  }
  return (
    <div className={message.className}>  
      {message.text}
    </div>
  )
}

const Filter = ({searchTerm, handleSearchTermChange}) => {
  return (
    <form>
    <div>
      filter shown with <input value={searchTerm} onChange={handleSearchTermChange}/>
    </div>
  </form>
  )
}

const PersonForm = ({newName, handleNameChange, newNumber, handleNumberChange, addPerson}) => {
  return (
    <form>
      <div>
        name: <input value={newName} onChange={handleNameChange}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit" onClick={addPerson}>add</button>
      </div>
    </form>
  )
}



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState(null)




  useEffect(() => {
    personServices
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => setNewName(event.target.value) 
  const handleNumberChange = (event) => setNewNumber(event.target.value) 
  const handleSearchTermChange = (event) => setSearchTerm(event.target.value) 
  
  const DeletePerson = (id) => {
    const personToDelete = persons.find((person) => person.id === id).name
    if(window.confirm(`Do you want to delete ${personToDelete}`)){
      console.log('deletion definitely happened')
      setMessage({text: `Deleted ${personToDelete}`, className: 'deletePerson'})
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      personServices
        .remove(id)
        .then(() => {
          personServices
            .getAll()
            .then(initialPersons => {
              setPersons(initialPersons)
            })
        })

    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    
    if (persons.find((person) => person.name === newName) === undefined) {
      
            personServices
        .create({name: newName, number: newNumber})
        .then(response => {
          setPersons(persons.concat(response))
        })

      setMessage({text: `Added ${newName}`, className: 'addPerson'})
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    else if (window.confirm('That name is already in the phonebook. Do you want to replace the number?')) {
            
      personServices
        .update(persons.find((person) => person.name === newName).id , {name: newName, number: newNumber})
        .then((updatedPerson) => {
          setPersons(
          persons.map((person) => {
            return (person.id === updatedPerson.id
              ? updatedPerson
              : person
            ) 
            
          }))
          setMessage({text: `updated ${newName}`, className: 'updatePerson'})
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          
        })
      .catch(error => {
        setMessage({text: `${newName} was already removed from server`, className: 'error'})
          setTimeout(() => {
            setMessage(null)
          }, 5000)
      })  


    }
  }

  const personsToShow = (searchTerm === '' 
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <Filter searchTerm={searchTerm} handleSearchTermChange={handleSearchTermChange}/>
      <h2>Add new person</h2>
      <PersonForm newName={newName} handleNameChange={handleNameChange} newNumber={newNumber}
        handleNumberChange={handleNumberChange} addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} DeletePerson={DeletePerson}/>
    </div>
  )
}

export default App