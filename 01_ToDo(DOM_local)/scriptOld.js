document.addEventListener("DOMContentLoaded", () => {
    //Grabing the elemens
    const taskInput = document.getElementById('todo-input')
    const add_task_btn = document.getElementById('add-task-button')
    const ToDoList = document.getElementById('task-list')

    //Fetches the tasks
    let taskList = JSON.parse(localStorage.getItem("tasks")) || []

    //Loads task into display
    taskList.forEach(task => renderTask(task));

    //"Add task" when clicked
    add_task_btn.addEventListener('click', () => {
        let task = taskInput.value.trim()
        if (task === "") return;

        // Setting task Object 
        const newTask = {
            id: Date.now(),
            name: task,
            completed: false,
        }

        taskList.push(newTask)//push into taskList
        saveTask() // save tasklist into localstorage
        renderTask(newTask)
        taskInput.value = "" //clears taskInput
    })

    //Load function - to laod task into display tasklist
    function renderTask(task) {
        //creates the li element
        const li = document.createElement('li')
        li.setAttribute('data-id', task.id) //pass id

        if (task.completed) li.classList.add("completed")//task stats -> list property 

        li.innerHTML = `
        <span>${task.name}</span><button>delete</button>`//pass content -name,etc.

        //make task status to 'completed' when clicked
        li.addEventListener('click', (e) => {
            if (e.target.tagName === "BUTTON") return;
            task.completed = !task.completed
            li.classList.toggle("completed")
            saveTask()
        })

        //Delete action
        li.querySelector("button").addEventListener("click", (e) => {
            e.stopPropagation()
            //Prevent deafault JS behaviour called "Event Bubblling" 
            //- applying it on parent element from start to root

            // Let we update taskList by deleteing the task
            taskList = taskList.filter((t) => t.id != task.id)
            li.remove()
            saveTask()
        })

        ToDoList.appendChild(li) //add task li into dom
    }
    //Save task function
    function saveTask() {
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }
})