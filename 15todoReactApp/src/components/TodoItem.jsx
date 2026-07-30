import React, { useState } from 'react'
import { useTodo } from '../contexts'
function TodoItem({ todo }) {
    const [isEditable, setEditable] = useState(false)
    const [todoMsg, setTodoMsg] = useState(todo.todo)

    const { updateTodo, deleteTodo, toggleStatus } = useTodo()
    const editTodo = () => {
        updateTodo(todo.id, { ...todo, todo: todoMsg })
        setEditable(false)
    }

    const toggleComplete = () => { toggleStatus(todo.id) }

    return (
        <li className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${todo.complete
            ? "bg-slate-5/40 border-slate-100 opacity-60"
            : "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200"
            }`}>

            {/* Left Side: Checkbox & Text Input */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <input
                    type="checkbox"
                    checked={todo.complete}
                    onChange={() => toggleComplete(todo.id)} // Fixed standard checklist toggle logic
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                />
                <input
                    type="text"
                    value={todoMsg}
                    readOnly={!isEditable}
                    onChange={(e) => setTodoMsg(e.target.value)}
                    className={`w-full bg-transparent text-sm font-medium focus:outline-none transition-all truncate ${todo.complete ? "line-through text-slate-400" : "text-slate-700"
                        } ${isEditable ? "border-b border-indigo-400 text-indigo-700 px-1" : "border-b border-transparent"
                        }`}
                />  
            </div>
            {/* Right Side: Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
                <button
                    type="button"
                    disabled={todo.complete}
                    onClick={() => { // Changed from onChange to onClick for structural correctness on buttons
                        if (todo.complete) return;
                        if (isEditable) { editTodo(); }
                        else { setEditable((prev) => !prev); }
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-base"
                >
                    {isEditable ? "🗃️" : "✏️"}
                </button>

                <button
                    type="button"
                    onClick={() => deleteTodo(todo.id)} // Fixed layout expression syntax error
                    className="p-1.5 rounded-lg hover:bg-red-50 text-base transition-colors"
                >
                    ❌
                </button>
            </div>
        </li>
    )
}

export default TodoItem