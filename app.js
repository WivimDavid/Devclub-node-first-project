const express = require('express')
const uuid = require('uuid')
const app = express()
const port = 3000
app.use(express.json())

const users = [] // nunca utilizar variaveis para guardar informações em produção, pois caso o servidor for reiniciado perderá todas elas. 

//middleware 
const checkUserId = (request, response, next) => {
  const { id } = request.params

  const index = users.findIndex(user => user.id === id)

  if (index < 0) {
    return response.status(404).json({ error: "User not found" })
  }

  request.userIndex = index
  request.userId = id

  next()
}

// Search Users
app.get('/users', (request, response) => {
  return response.json(users)
})

// Creat users
app.post('/users', (request, response) => {

  const { name, age } = request.body

  const user = { id: uuid.v4(), name, age }

  users.push(user)

  return response.status(201).json(users)
})

// Update Users
app.put('/users/:id', checkUserId, (request, response) => {
  const { name, age } = request.body
  const index = request.userIndex
  const id = request.userId

  const updateUser = { id, name, age }

  users[index] = updateUser

  return response.json(updateUser)
})

app.delete('/users/:id', checkUserId, (request, response) => {
  const index = request.userIndex

  users.splice(index, 1)

  return response.status(204).json()
})







app.listen(port, () => {
  console.log(` ➡️ Server ON port ${port} `)
})