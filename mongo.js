const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Gothubiin!
const url = 'mongodb://fullstack:password@ds133558.mlab.com:33558/fullstack-jonnaira'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (!process.argv[2] && !process.argv[3]) {
  Person
    .find({})
    .then(result => {
      console.log('puhelinluettelo:')
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}
else {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })
  
  console.log('lisätään ' + person.name + ' numero ' + person.number)
  
  person
  .save()
  .then(response => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}