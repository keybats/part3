const Persons = ({personsToShow, DeletePerson}) => {
  
  return (
    <div>
      {
        personsToShow.map((person) => {
          
          return (
            <div key={person.id}>
              {person.name} {person.number}
              <button onClick={() => DeletePerson(person.id)}>Delete</button>
            </div>
          )
        }) 
      }

    </div>
  )
}

export default Persons

