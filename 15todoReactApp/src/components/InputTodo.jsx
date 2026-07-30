import React, { useState } from 'react'
import { useTodo } from '../contexts/index.js'

function InputTodo() {
    const [todo, setTodo] = useState("")
    const { addTodo } = useTodo();

    const add = (e) => {
        e.preventDefault(); if (!todo) return;
        addTodo({ todo, complete: false }); setTodo("")
    }
    return (
        <form onSubmit={(e) => add(e)} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Write your chores here..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-100 transition-all"
          >
            Add
          </button>
        </form>
    )
}

export default InputTodo