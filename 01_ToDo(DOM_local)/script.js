document.addEventListener("DOMContentLoaded", () => {
    //Grab elements
    const taskInput = document.getElementById('todo-input')
    const Add_btn = document.getElementById('add-task-button')
    const tasklist = document.getElementById('task-list')

    //Fetch tasks into buckat
    let task_bucket = JSON.parse(localStorage.getItem('tasklist')) || []

    //render each task 
    task_bucket.forEach(task => rendertask(task))

    //"Add task" when clicked
    Add_btn.addEventListener("click", () => {
        //read task-name 
        let task_name = taskInput.value.trim()
        if (task_name === "") return

        //task Object
        const task = {
            id: Date.now(),
            name: task_name,
            completed: false
        }
        task_bucket.push(task)
        savetask()
        rendertask(task)
        taskInput.value = ""
    }) 

    function rendertask(task) {
        const li = document.createElement('li')
        li.setAttribute('data-id', task.id)
        li.innerHTML = `<span>${task.name}</span><button>delete</button>`

        //completed logic
        li.addEventListener('click',(e)=>{
            if (e.target.tagName === 'BUTTON')return
            task.completed = !task.completed
            li.classList.toggle('completed')
            savetask()
        })

        //delete logic
        li.querySelector('button').addEventListener('click',(e)=>{
            e.stopPropagation()
            task_bucket = task_bucket.filter((t => t.id != task.id))
            li.remove()
            savetask()
        })
        
        tasklist.appendChild(li) 
    }

    function savetask() {
        localStorage.setItem("tasklist", JSON.stringify(task_bucket))
    }
})