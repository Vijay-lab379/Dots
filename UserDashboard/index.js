/*NOW -
  logout fn -> final permision.
  Edit -Delete & Add logic -> needs custom forms
  - Task - name, description, attachments, status, assignedTo
  - subtask -name, description, assignedTo,
  - project -name, descreption,
  - proj. member - user( id/email), role.
*/

/* What issues I encountered??
  Actually I'm offline! and checking dashboard.
  - Opened Task is shown ->even when there is no Opened Project shown !!
  - when I clicked logout -> it vanished all user -> and left default system
  - the default Project was admin -> allowed comment is obvious
  - But when I clicked one of the project -> even comment disabled is not shown!!
  - Sync btn -> showed upToDate first -> then Unable to load task and notes msg
 */
document.addEventListener('DOMContentLoaded', () => {
    const server = 'http://localhost:8000/api/v1'
    const paths = {
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
        DeleteProject: ((projectId) => ({ path: `/projects/${projectId}`, method: 'DELETE' })),
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
        UpdateSubtask: ((projectId, subtaskId) => ({ path: `/tasks/${projectId}/st/${subtaskId}`, method: 'PUT' })),
        DeleteSubtask: ((projectId, subtaskId) => ({ path: `/tasks/${projectId}/st/${subtaskId}`, method: 'DELETE' })),

        //notes
        GetProjectNotes: ((projectId) => ({ path: `/notes/${projectId}`, method: 'GET' })),
        CreateNote: ((projectId) => ({ path: `/notes/${projectId}`, method: 'POST' })),
        GetNote: ((projectId, noteId) => ({ path: `/notes/${projectId}/n/${noteId}`, method: 'GET' })),
        UpdateNote: ((projectId, noteId) => ({ path: `/notes/${projectId}/n/${noteId}`, method: 'PUT' })),
        DeleteNote: ((projectId, noteId) => ({ path: `/notes/${projectId}/n/${noteId}`, method: 'DELETE' })),
        //check server
        HealthCheck: { path: `/healthcheck`, method: `GET` }
    }

    //DOM elements:- Auth Panel
    const RegisterBtn = document.getElementById("link-register")
    const loginBtn = document.getElementById("link-login")
    const logoutBtn = document.getElementById('btn-logout')
    const submitBtn = document.getElementById("auth-submit-btn")
    const UserMenu = document.getElementById('dropdown-user-list')
    //Form headers
    const NameInput = document.getElementById('auth-field-name')
    const EmailInput = document.getElementById('auth-field-email')
    const PassInput = document.getElementById('auth-field-password')
    const AuthTitle = document.getElementById('auth-panel-title')
    //Form Elements
    const BGoverlay = document.getElementById('auth-overlay')
    const AuthPage = document.getElementById('auth-panel')
    const AuthError = document.getElementById('auth-error')
    const closeFormBtn = document.getElementById('form-close-btn')

    //Forms
    const formTitle = document.getElementById('form-panel-title')
    const projForm = document.getElementById('form-project')
    const taskForm = document.getElementById('form-task')
    const subtaskForm = document.getElementById('form-subtask')
    const memberForm = document.getElementById('form-member')
    const noteForm = document.getElementById('form-note')

    //Active User info
    const Title = document.getElementById('title-username')
    const AvatarBtn = document.getElementById('avatar-btn')
    const AcctiveUserInfo = document.getElementById('active-user-info')

    //Project
    const projectList = document.getElementById('projects-body')
    const activeProjectTitle = document.getElementById('proj-detail-title')
    const activeProjectDescription = document.getElementById('proj-description-text')
    const projectAction = document.getElementById('proj-detail-actions') // Update & Delete
    const AddProjectBtn = document.getElementById('add-project-btn') //Add

    //Tasks
    const tasklist = document.getElementById('tasks-block')
    const activeTaskTitle = document.getElementById('task-detail-name')
    const activeTaskDescription = document.getElementById('task-description-text')
    const taskAction = document.getElementById('task-detail-actions') //Update & Delete
    const AddTaskBtn = document.getElementById('add-task-btn') //Add
    //Subtasks
    const subtaskList = document.getElementById("subtasks-block")
    const subtaskAction = document.getElementById('subtask-btn') //Update & Delete
    const AddSubtaskBtn = document.getElementById('add-subtask-btn')

    //Notes
    const notelist = document.getElementById('notes-block')
    const noteActions = document.getElementById('note-btn')//Update & Delete
    const AddNoteBtn = document.getElementById('btn-add-comment') //Add

    //accesories
    const messageBox = document.getElementById('message-container')
    const SyncBtn = document.getElementById('btn-sync')
    let authBtns = document.getElementsByClassName('row-btns')
    const AddNote = document.getElementById('btn-add-comment')

    //Sustaining during Sesion reloads)
    let Users = safeLoad('UserList', [
        {
            _id: '6a11b3005d4548f7b49af640',
            username: 'cristiano_ronaldo',
            email: 'cristiano_ronaldo@gmail.com',
            password: 'Cristiano_ronaldo@123',
            isEmailVerified: false
        },
        {
            _id: '6a11b3005d4548f7b49af640',
            username: 'vijay',
            email: 'vijay@gmail.com',
            password: 'Vijay@123',
            isEmailVerified: false
        }
        // 'user-id-2': {},
    ]); //'Active-User' Ref -for 'Sync' and 'dashboard render'
    let Projects = safeLoad('ProjectList', [])
    let Notes = safeLoad('NoteList', []);
    let Tasks = safeLoad('TaskList', []);
    let Subtasks = safeLoad('SubtaskList', [
        {
            "title": "Non o these",
            "task": "6a0eccd127c041239878d7bd",
            "isCompleted": false,
            "createdBy": "6a0d2b5f01b0f46a327f9547",
            "_id": "6a0ecd0527c041239878d7c3",
            "createdAt": "2026-05-21T09:14:45.216Z",
            "updatedAt": "2026-05-21T09:14:45.216Z",
            "__v": 0
        },
        {
            "title": "Non o these",
            "task": "6a0eccd127c041239878d7ed",
            "isCompleted": false,
            "createdBy": "6a0d2b5f01b0f46a327f9547",
            "_id": "6a0ecd0527c041239878d093",
            "createdAt": "2026-05-21T09:14:45.216Z",
            "updatedAt": "2026-05-21T09:14:45.216Z",
            "__v": 0
        }
    ])
    const defaults = {
        Project: {
            name: "Project-Title",
            description: "Description of the project goes here. Short summary of what this project is about.",
            _id: "6a0dbe3aaaea1709e52d2d03"
        },
        Task: {
            title: "Task-Details",
            description: 'Click a task on the left to see its details.',
            _id: "Id"
        }
    }
    let Actives = safeLoad('SelectedItems', { ...defaults, accessToken: "", refreshToken: "" }); //Active User, Project and Task -> Deteals - name, id, description 

    //Intial User dashboard load
    loginUser();
    (() => {
        updateUser(); projectList.innerHTML = "";
        Projects.forEach(project => renderProject(project));
        renderTasks(); renderNotes(); renderTask();
    })()// Offline Render 

    //Auth listeneres 
    loginBtn.addEventListener('click', () => {
        AuthTitle.innerText = "Log In"; submitBtn.innerText = "Log In";
        NameInput.classList.remove('show'); ShowAuthFrom()
    })
    RegisterBtn.addEventListener('click', () => {
        AuthTitle.innerText = "Register"; submitBtn.innerText = "Register";
        NameInput.classList.add('show'); ShowAuthFrom()
    })
    logoutBtn.addEventListener('click', () => {
        const user = requestAPI(paths.logout)
        if (!user) { messageDisplay('Server is not available Temporarily!'); return }
        else messageDisplay(`${user?.message}`); Users.shift(); saveUsers(); loginUser();
    })
    function ShowAuthFrom() { BGoverlay.classList.add('open'); AuthPage.classList.add('open'); submitBtn.addEventListener('click', handleSubmit) };
    closeFormBtn.addEventListener('click', () => {
        BGoverlay.classList.remove('open'); AuthPage.classList.remove('open');
        NameInput.value = ""; EmailInput.value = ""; PassInput.value = "";
    })
    async function handleSubmit(e) {
        e.preventDefault()  //get credentials 
        const credentials = new FormData(authForm)
        const userData = Object.fromEntries(credentials.entries());

        if (!userData || userData === {}) return

        let response = await requestAPI(AuthTitle.innerHTML == 'Register' ? paths.Register : paths.login, userData)
        if (!response) { AuthError.innerText = "Someting went wrong. PLease Try Again later"; }

        let { user: newUser, accessToken: at, refreshToken: rt } = response.data;
        newUser.password = userData.password;
        if (!Users.includes(newUser)) Users.unshift(newUser);
        saveUsers();
        Actives.accessToken = at; Actives.refreshToken = rt; saveActives()
        updateUser(); SyncDashboard();
        setTimeout(() => { BGoverlay.classList.remove('open'); AuthPage.classList.remove('open') }, 3000)

    }

    //
    SyncBtn.addEventListener('click', SyncDashboard);

    //Project Listeners 
    projectAction.querySelector('.btn-edit').addEventListener('click', () => {
        let projectId = Actives.Project._id; updateProject();
        const project = requestAPI(paths.UpdateProject(projectId), projData)
        if (!project) { messageDisplay('Server is not availbale Temporarily!'); return }
        Projects[Projects.findIndex(proj => proj._id === project._id)] = project; saveProjects();
        projectList = ""; Projects.forEach(project => renderProject(project));//update project que
        renderTasks();//update project headers
    })
    projectAction.querySelector('.btn-delete').addEventListener('click', (e) => {
        e.stopPropagation()
        let projectId = Actives.Project._id; deleteProject();
        const project = requestAPI(paths.DeleteProject(projectId), projData)
        if (!project) { messageDisplay(project.message); return }
        projectId = project._id
        requestAPI(paths.DeleteProject(projectId))
            .then(Projects = Projects.filter((p => p._id != projectId)))
            .then(saveProjects())
            .then(Projects.forEach(project => renderProject(project)))
    })

    //Core functions 
    async function requestAPI(reqOpt = {}, data = null) { // Genereal fetch req 
        // -> pass 'data' n 'path(route, method)' -> get 'dataBack'
        const isServerAvailable = await (async () => { //CheckServerAvailablity
            try {
                const response = await fetch(`${server}/healthcheck`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                return response.ok
            } catch (err) {
                console.error('requestAPI failed:', err);
                return false;
            };
        })(); if (!isServerAvailable) return

        //setting 'options' 
        const options = {
            method: reqOpt.method,
            headers: {
                'Content-Type': 'application/json'
            },
        }

        if (Actives.accessToken != "") { options.headers.Authorization = `Bearer ${Actives.accessToken}` }
        if (data && reqOpt.method !== 'GET') { options.body = JSON.stringify(data) }

        console.log(options);

        try {
            let response = await fetch(`${server}${reqOpt.path}`, options)

            // If the server returned HTML (error page)
            const contentType = response.headers.get('Content-Type') || '';
            if (!response.ok && contentType.includes('text/html')) {
                console.error(`Server returned HTML error — Status: ${response.status} ${response.statusText}`)
                return null
            }
            response = await response.json()
            console.log(response.message)
            return response
        } catch (err) {
            console.error('requestAPI failed:', err);
            return null;
        };
    };
    async function loginUser(UserData = Users[0]) {//updates Tokens, Users
        let loginResponse = await requestAPI(paths.login, UserData)
        if (!loginResponse) { messageDisplay("Server is Not Available Temporerily!"); return }
        const { user: newUser, accessToken: at, refreshToken: rt } = loginResponse.data
        //Update LoggedIn user with injected password 
        newUser.password = UserData.password
        Users = Users.filter(user => user._id !== newUser._id)
        Users.unshift(newUser); saveUsers(); updateUser();
        //update the dashboard
        Actives = { ...defaults, accessToken: at, refreshToken: rt }; saveActives();
        SyncDashboard();
    }

    async function SyncDashboard() {
        SyncBtn.classList.add('spinning');
        getProjects()
        if (!Actives.Project === defaults.Project || !Projects.find(project => project._id === Actives.Project._id) || Projects === []) {
            Actives = { ...Actives, Project: defaults.Project, Task: defaults.Task }; saveActives()
            Notes = []; saveNotes(); renderNotes(); Tasks = []; saveTasks(); renderTasks();
            Subtasks = []; saveSubtasks(); renderTask();
            SyncBtn.classList.remove('spinning'); messageDisplay("This project is deleted!");
            return
        } getProjectTasks(); getProjectNotes();
        if (!Tasks.find(task => task._id === Actives.Task._id)) {
            Actives = { ...Actives, Task: defaults.Task }; saveActives()
            Subtasks = []; saveSubtasks(); renderTask();
            SyncBtn.classList.remove('spinning'); messageDisplay("This task is deleted!");
            return
        }
        getTask()
        SyncBtn.classList.remove('spinning'); messageDisplay("You are Up to Date!")
    }
    async function getProjects() {
        //Get Projects -> Updates container -> dash projects
        const projects = await requestAPI(paths.Getprojects);
        if (!projects) {
            SyncBtn.classList.remove('spinning');
            messageDisplay("Unable to load Projects!");
            return
        }
        Projects = projects.data; saveProjects();
        projectList.innerHTML = "";
        Projects.forEach(project => renderProject(project))
    }
    async function getProjectNotes() {
        const notes = await requestAPI(paths.GetProjectNotes(Actives.Project._id))
        if (!notes) { SyncBtn.classList.remove('spinning'); messageDisplay("Unable to load Notes"); return }
        Notes = notes.data; saveNotes();
        notelist.innerHTML = ""; renderNotes();
    }
    async function getProjectTasks() {
        const tasks = await requestAPI(paths.GetProjectTasks(Actives.Project._id));
        if (!tasks) { SyncBtn.classList.remove('spinning'); messageDisplay("Unable to load Tasks"); return }
        Tasks = tasks.data; saveTasks(); tasklist.innerHTML = ""; renderTasks();

    }
    async function getTask() {
        if (Actives.Task === defaults.Task) return
        const task = await requestAPI(paths.GetTask(Actives.Project._id, Actives.Task._id));
        if (!task) { SyncBtn.classList.remove('spinning'); messageDisplay("Unable to load Task"); return }
        Subtasks = task.data.subtasks; saveTasks(); renderTask();
    }

    //Render Functions
    function updateUser() {//update top bar 
        //Logged IN user -> UserTitle, avatar and userMenu
        const AcctiveUser = Users[0] //grab loggedIN user
        Title.innerText = AcctiveUser.username.toUpperCase()
        AvatarBtn.innerHTML = `${AcctiveUser.username[0].toUpperCase()}`
        AcctiveUserInfo.innerHTML = `
        <div class="du-avatar">${AcctiveUser.username[0].toUpperCase()}</div>
            <div>
              <div class="du-name" id="dropdown-name">${AcctiveUser.username.toUpperCase()}</div>
              <div class="du-email" id="dropdown-email">${AcctiveUser.email}</div>
        </div>`

        //laod User Menu
        UserMenu.innerHTML = ""
        Users.forEach((user, index) => {
            if (index === 0) return
            const li = document.createElement('li')
            li.innerHTML = `<div class="user-radio "></div>${user.username}`
            li.setAttribute('user-id', index)
            UserMenu.appendChild(li)

            li.addEventListener('click', (e) => {
                const selectedUser = e.target;
                const userId = Number(selectedUser.getAttribute('user-id'));
                const userData = Users[userId];
                console.log(userData);
                loginUser(userData)
            })
        })
    }
    function renderProject(project) {
        //generate project li and append
        const li = document.createElement('li');
        li.setAttribute('project-id', project._id);
        li.innerHTML = `
        <li class="project-item" project-id="${project._id}">
            <h1 class="project-item-name">${project.name}</h1>           
        </li>`;
        projectList.appendChild(li)

        //Select 'Project' -> Get Project details, tasks, notes 
        li.addEventListener('click', (e) => {
            li.classList.add('active');
            Actives.Project = project; saveActives();
            if (project.role !== "admin") {
                [...authBtns].forEach(btn => btn.classList.remove('hidden'));
                AddNote.classList.remove('hidden')
            } else {
                [...authBtns].forEach(btn => btn.classList.add('hidden'));
                AddNote.classList.add('hidden')
            }
            getProjectNotes(); getProjectTasks();
        });
    }
    function renderNotes() {
        notelist.innerHTML = `<li id="notes-block-label">Notes &amp; Comments </li>`//headerOnly
        Notes.forEach(note => {
            const li = document.createElement('li')
            li.innerHTML = `
            <li class="note-row" note-id="${note._id}"> 
                <span class="note-at">@ ${note.content}</span> 
                <div class="row-btns">
                <button class="btn-edit">✒️</button>
                <button class="btn-delete">🗑️</button><div>
            </li>`;

            //edit controler
            li.querySelector('.btn-edit').addEventListener('click', () => {
                //show note form -> when submited 'grab noteData'
                const note = requestAPI(paths.UpdateNote(Actives.Project._id, noteId), noteData)
                // if (!note) { messageDisplay("");}
                /*
                - note doesn't exist-> show msg
                - null response -> show msg
                - valid res -> 
                */
            })

            // delete contoler

            notelist.appendChild(li);
        })
    }
    function renderTasks() {
        //update Active Project Details
        const project = Actives.Project;
        if (project && project.role === "admin") {
            [...authBtns].forEach(btn => btn.classList.add('hidden'));
            AddNote.classList.remove('hidden')
        }
        activeProjectTitle.innerText = `${project.name}`;
        activeProjectTitle.setAttribute('project-id', project._id);
        activeProjectDescription.innerText = `${project.description}`;

        //load taskList 
        tasklist.innerHTML = `<li id="tasks-block-label">TASKS <button class="btn-edit" id="add-task-btn">+Add</button></li>`;
        Tasks.forEach(task => {
            const li = document.createElement('li')
            li.setAttribute('taskId', task._id)
            li.innerHTML =
                `<li class="task-row" task-id="${task._id}">
                <div class="task-checkbox"></div>
                <span class="task-row-name">${task.title}</span>
                <div class="row-btns">
                  <button class="btn-edit" id="btn-edit-task">Edit</button>
                  <button class="btn-delete" id="btn-delete-task">Delete</button>
                </div>
              </li>`;

            //click on task
            li.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') return
                Actives.Task = task; saveActives();
                getTask();
            })

            //edit logic

            //delete logic
            li.querySelector('.btn-delete').addEventListener('click', (e) => {
                e.stopPropagation()

                const projectId = activeProjectTitle.getAttribute('project-id')
                requestAPI(paths.DeleteTask(projectId, task._id))
                    .then(Tasks = Tasks.filter((t => t._id != task._id)))
                    .then(saveTasks())
                    .then(li.remove())
            })

            tasklist.appendChild(li)
        })
    }
    function renderTask() {
        //set selelcted Project
        const task = Actives.Task;
        activeTaskTitle.innerText = `${task.title}`;
        activeTaskTitle.setAttribute('task-id', task._id);
        activeTaskDescription.innerText = `${task.description}`
        //load subtaskList
        subtaskList.innerHTML = `<li id="subtasks-label">Subtasks <button class="btn-edit" id="add-subtask-btn">+Add</button></li>`;
        Subtasks.forEach(subtask => {
            const li = document.createElement('div')
            li.setAttribute('subtask-id', subtask._id)
            li.innerHTML = `
              <li class="subtask-row" subtask-id="${subtask._id}">
                <div class="subtask-checkbox"></div>
                <span class="subtask-name">${subtask.title}</span>
                <div class="row-btns subtask-btn">
                  <button class="btn-edit" id="btn-edit-subtask">✒️</button>
                  <button class="btn-delete" id="btn-delete-subtask">🗑️</button>
                </div>
              </li>`

            //Select logic
            li.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') return
                subtask.completed = !subtask.completed
                li.classList.toggle('completed')
                saveSubtasks()
            })

            //edit logic
            li.querySelector('.btn-edit').addEventListener('click', (e) => {
                e.stopPropagation();
            })

            //Delete logic
            li.querySelector('.btn-edit').addEventListener('click', (e) => {
                e.stopPropagation();
            })
            subtaskList.appendChild(li)
        })
    }
    function messageDisplay(message) { //any notifications
        const MsgLi = document.createElement('li');
        MsgLi.innerHTML = `<li">${message}</li>`
        MsgLi.classList.add("message");
        MsgLi.classList.add("show");
        messageBox.appendChild(MsgLi);
        setTimeout(() => { MsgLi.classList.remove('show'); MsgLi.remove() }, 5000)
    }

    //Sesion storage 
    function saveActives() { localStorage.setItem('SelectedItems', JSON.stringify(Actives)) }
    function saveUsers() { localStorage.setItem('UserList', JSON.stringify(Users)) }
    function saveProjects() { localStorage.setItem("ProjectList", JSON.stringify(Projects)) }
    function saveTasks() { localStorage.setItem("TaskList", JSON.stringify(Tasks)) }
    function saveNotes() { localStorage.setItem("NoteList", JSON.stringify(Notes)) }
    function saveSubtasks() { localStorage.setItem('SubtaskList', JSON.stringify(Subtasks)) }
    function safeLoad(key, fallback = []) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }
})
