import { useContext, useEffect, useState } from 'react'

import { AuthContext } from '../contexts/auth'
import { getTodos } from '../services/api'

export const Dashboard = () => {
  const [todos, setTodos] = useState(undefined)
  const authContext = useContext(AuthContext)

  useEffect(() => {
    authContext?.user &&
      getTodos()
        .then(({ data }) => {
          setTodos(data)
        })
        .catch((err) => {
          console.log(err)
        })
  }, [authContext?.user])
  return (
    <>
      Dashboard
      {todos ? (
        todos.map((todo) => {
          return (
            <div key={todo.id}>
              <div>{todo.title}</div>
              <div>{todo.description}</div>
            </div>
          )
        })
      ) : (
        <div>
          <div>No todos</div>
        </div>
      )}
    </>
  )
}
