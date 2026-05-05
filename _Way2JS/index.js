// login user -> grab projects -> save -> laod ->
// Load the notes of project
// when project is clicked -> grab TaskList -> save -> laod ->
// when task clicked -> grab task deteaks and subtasks -> load .

document.addEventListener('DOMContentLoaded', () => {

    const server = 'http://localhost:8000/api/v1'

    //Actice user: 
    let accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWVlMDMwNzVkZDA4ODNkMzA2ZjgyOWUiLCJlbWFpbCI6InByYXZpbkBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InByYXZpbiIsImlhdCI6MTc3NzcwNTMzMCwiZXhwIjoxNzc3NzkxNzMwfQ.7_tDWcbERt8NZY0epVDFO01mbMKUHmv6V8hHt7A1KIw"
    let refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWVlMDMwNzVkZDA4ODNkMzA2ZjgyOWUiLCJpYXQiOjE3Nzc3MDUzMzAsImV4cCI6MTc3ODU2OTMzMH0.WnbLhEy2ylIRBeymDtxQOLfOM4myOg2FTLPyIoICi80"

    const Paths = {
        //auth paths
        Register: { path: `/auth/register`, method: 'POST' },
        login: { path: `/auth/login`, method: 'POST' },
        logout: { path: `/auth/logout`, method: 'POST' },
        changePass: { path: `/auth/change-password`, method: 'POST' },
        ForgotPass: { path: `/auth/forgot-password`, method: 'POST' },
        RefershAccesToken: { path: `/auth/refresh-token`, method: 'POST' },
        resendEmailVerific: { path: `/auth/resend-email-verification`, method: 'POST' },
        //projetc
        Getprojects: { path: `/projects`, method: 'GET' },
        CreateProject: { path: `/projects`, method: 'POST' },
        GetProject: ((projectId) => ({ path: `/projects/${projectId}`, method: 'GET' })),
        UpdateProject: ((projectId) => ({ path: `/projects/${projectId}`, method: 'PUT' })),
        DeleteProject: ((projectId) => ({ path: `/projects/${projectId}/members`, method: 'DELETE' })),
        ListProjectMember: ((projectId) => ({ path: `/projects/${projectId}/members`, method: 'GET' })),
        AddProjectMember: ((projectId) => ({ path: `/projects/${projectId}/members`, method: 'POST' })),
        UpdateMemberRole: ((projectId, userId) => ({ path: `/projects/${projectId}/members/${userId}`, method: 'PUT' })),
        //tasks
        GetProjectTasks: ((projectId) => ({ path: `/tasks/${projectId}`, method: 'GET' })),
        GetTask: ((projectId, taskId) => ({ path: `/tasks/${projectId}/t/${taskId}`, method: 'GET' })),
        CreateTask: ((projectId) => ({ path: `/tasks/${projectId}`, method: 'POST' })),
        UpdateTask: ((projectId, taskId) => ({ path: `/tasks/${projectId}/t/${taskId}`, method: 'PUT' })),
        DeleteTask: ((projectId, taskId) => ({ path: `/tasks/${projectId}/t/${taskId}`, method: 'DELETE' })),
        CreateSubtask: ((projectId, taskId) => ({ path: `/tasks/${projectId}/t/${taskId}/subtasks`, method: 'POST' })),
        UpdateSubtask: ((projectId, subTaskId) => ({ path: `/tasks/${projectId}/st/${subTaskId}`, method: 'PUT' })),
        DeleteSubtask: ((projectId, subTaskId) => ({ path: `/tasks/${projectId}/st/${subTaskId}`, method: 'DELETE' })),

        //notes
        CreateNote: ((projectId) => ({ path: `/notes/${projectId}`, method: 'POST' })),
        GetNote: ((projectId, noteId) => ({ path: `/notes/${projectId}/n/${noteId}`, method: 'GET' })),
        UpdateNote: ((projectId, noteId) => ({ path: `/notes/${projectId}/n/${noteId}`, method: 'PUT' })),
        DeleteNote: ((projectId, noteId) => ({ path: `/notes/${projectId}/n/${noteId}`, method: 'DELETE' })),
        //check server
        HealthCheck: { path: `/healthcheck`, method: `GET` }
    }

    let Users = [
        {
            _id: '',
            username: "suraj",
            email: 'example@gmail.com',
            password: 'xyz@#123',
            accessToken: "sdf",
            isEmailVerified: false
        }
    ]

    let Projects = JSON.parse(localStorage.getItem('ProjectList')) || []
    let Tasks = JSON.parse(localStorage.getItem('TaskList')) || []
    let Notes = JSON.parse(localStorage.getItem('NoteList')) || []

    Projects.forEach(project => renderProject(project))
    Tasks.forEach(task => loadTask(task))
    Notes.forEach(note => loadTask(note))

    const tasklist = document.getElementById('Task-Section')
    const projectList = document.getElementById('projects-body')

    //Auth Panel
    const RegisterBtn = document.getElementById("link-register")
    const loginBtn = document.getElementById("link-login")
    const submitBtn = document.getElementById("auth-submit-btn")
    const BGoverlay = document.getElementById('auth-overlay')
    const AuthPage = document.getElementById('auth-panel')
    const Error = document.getElementById('auth-error')
    const NameInput = document.getElementById('auth-field-name')
    const closeAuthMenu = document.getElementById('auth-close-btn')
    const AuthTitle = document.getElementById('auth-panel-title')
    const messageBox = document.getElementById('message')

    //show menu -> enable X, Submit -> Grab User -> save ->
    //load active User -> Projects -> grab, save, show

    loginBtn.addEventListener('click', () => {
        NameInput.classList.remove('show')
        AuthTitle.innerText = "Log In"
        loadUser()
    })

    RegisterBtn.addEventListener('click', () => {
        NameInput.classList.add('show')
        AuthTitle.innerText = "Register"
        loadUser()
    })

    //Gets User and accetoken, and shows Error if any
    const loadUser = function () {
        //Show the menu
        BGoverlay.classList.add('open')
        AuthPage.classList.add('open')

        //close menu logic
        closeAuthMenu.addEventListener('click', () => {
            BGoverlay.classList.remove('open')
            AuthPage.classList.remove('open')
        })

        //auth request and response logic
        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault()

            const credentials = new FormData(authFrom)
            const UserData = Object.fromEntries(credentials.entries())

            const result = await RequestAPI(Paths.Register, UserData)

            if (!result) {
                Error.innerText = 'Server error, check console'
                return
            }

            if (result.statusCode == 200) {
                const { user, accessToken } = result.data
            } else {
                Error.innerText = result.message
            }

        })
    }


    const loadProject = function (project) {
        const li = document.createElement('li')
        li.setAttribute('projectId', project._id)
        li.innerHTML = `
        <li class="project-item" project-id="${project._id}">
            <h1 class="project-item-name">${project.title}}</h1>
            <div class="row-btns">
              <button class="btn-edit">Edit</button>
              <button class="btn-delete">Delete</button>
            </div>
        </li>`

        //Edit button logic
        li.querySelector('btn-edit').addEventListener('click',(e)=>{
            e.preventDefault()

            const {message, statusCode} = RequestAPI(Paths.DeleteProject(projectId),{})

            if(statusCode === 200){
                Projects = Projects.filter(p => p._id != project._id)
                saveProjects()
                li.remove()
            }  else {
                messageBox.innerText = message
                return
            }
        })
        //Dlete logic
    }

    function loadTask(task) {
        const div = document.createElement('div')
        div.setAttribute('taskId', task._id)
        div.innerHTML = `
        <h1>${task.name}</h1>
        <p>${task.descreption}</p>
        <button class="edit" >edit</button>
        <button>delete</button>`

        div.querySelector('button').classList.contains('edit')
        div.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') return
            task.completed = !task.completed
            li.classList.toggle('completed')
            savetask()
        })

        //delete logic
        div.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation()
            task_bucket = task_bucket.filter((t => t._id != task._id))

            Promise(
                RequestAPI(Paths.task)
            )
                .then(savetask())
                .then(div.remove())
        })

        tasklist.appendChild(div)
    }

    // A `Genereal fetch eq`, to pass 'data' to 'path(route, method)' and give 'dataBack'
    const RequestAPI = async function (reqOpt = {}, data = {}) {
        try {
            const response = await fetch(`${server}${reqOpt.path}`, {
                method: reqOpt.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()
            console.log(result);
            return result
        } catch (error) {
            console.error(`Error : ${error}`);

        }
    }

    function saveProjects() {
        localStorage.setItem("ProjectList", JSON.stringify(Projects))
    }
    function saveTasks() {
        localStorage.setItem("TaskList", JSON.stringify(Tasks))
    }
    function saveNote() {
        localStorage.setItem("NoteList", JSON.stringify(Notes))
    }

})

/* 
Example response 

{
    "statusCode": 500,
    "data": {
        "user": {
            "_id": "69f5a0d8244d933467db2f69",
            "avatar": {
                "url": "https://placehold.co/200x299",
                "localpath": "",
                "_id": "69f5a0d8244d933467db2f68"
            },
            "username": "suraj",
            "email": "suraj@gmail.com",
            "isEmailVerified": false,
            "createdAt": "2026-05-02T06:59:36.630Z",
            "updatedAt": "2026-05-03T04:21:13.166Z",
            "__v": 0
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWY1YTBkODI0NGQ5MzM0NjdkYjJmNjkiLCJlbWFpbCI6InN1cmFqQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic3VyYWoiLCJpYXQiOjE3Nzc3ODIwNzMsImV4cCI6MTc3Nzg2ODQ3M30.EuMD0ysuPabjisinfIM91M8r1hFq1PcSm1oFRcd8Sgs",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWY1YTBkODI0NGQ5MzM0NjdkYjJmNjkiLCJpYXQiOjE3Nzc3ODIwNzMsImV4cCI6MTc3ODY0NjA3M30.zU3HBXI6YGMsvelLPgh7Xioyb6YkZpiZr4ndSylXkI8"
    },
    "message": "User logged in !",
    "succes": false
}
*/