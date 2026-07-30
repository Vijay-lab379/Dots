import { useEffect, useState } from 'react';
import { TodoProvider } from './contexts/index.js';
import { TodoItem, InputTodo } from './components/index.js'

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodo = localStorage.getItem("todoList")
    return savedTodo ? JSON.parse(savedTodo) : [];
  })
  const addTodo = (todo) => { setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev]) }

  const updateTodo = (id, todo) => {
    setTodos((prev) => {
      return prev.map((prevTodo) =>
        (prevTodo.id === id ? todo : prevTodo))
    })
  }

  const deleteTodo = (id) => {
    setTodos((prev) =>
      prev.filter(prevTodo => prevTodo.id !== id))
  }

  const toggleStatus = (id) => {
    setTodos((prev) => prev.map((prevTodo) =>
      prevTodo.id === id ? { ...prevTodo, complete: !prevTodo.complete } : prevTodo
    ))
  }

  useEffect(() => { localStorage.setItem("todoList", JSON.stringify(todos)) }, [todos])

  return (
    <TodoProvider value={{ todos, addTodo, updateTodo, deleteTodo, toggleStatus }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-100 p-6 border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center tracking-tight">My Chores</h1>
        <InputTodo />
        <ul className="space-y-3">
          {todos.map((todo) =>
            <div key={todo.id}><TodoItem todo={todo} /></div>
          )}
        </ul>
      </div>
    </TodoProvider>
  )
}

export default App
