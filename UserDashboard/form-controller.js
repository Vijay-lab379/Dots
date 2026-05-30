/* ═══════════════════════════════════════════════════════════
   FORM PANEL CONTROLLER
   Paste this entire block inside your DOMContentLoaded callback,
   after your existing DOM element declarations.
   
   Usage anywhere in your code:
     openForm('project')               // Add mode
     openForm('project', projectData)  // Edit mode — pre-fills fields
     openForm('task')
     openForm('task', taskData)
     openForm('subtask')
     openForm('member')
     openForm('note')
     openForm('note', noteData)

   After the user clicks Save, the resolved data comes back via:
     formPanel.onSubmit = (formType, data, isEdit) => { ... }
═══════════════════════════════════════════════════════════ */

const formPanel = (() => {
    const panel      = document.getElementById('form-panel')
    const overlay    = document.getElementById('auth-overlay')   // reuse existing overlay
    const titleEl    = document.getElementById('form-panel-title')
    const closeBtn   = document.getElementById('form-close-btn')

    // All form bodies
    const forms = {
        project : document.getElementById('form-project'),
        task    : document.getElementById('form-task'),
        subtask : document.getElementById('form-subtask'),
        member  : document.getElementById('form-member'),
        note    : document.getElementById('form-note'),
    }

    // Field refs — keyed by form type then field name
    const fields = {
        project : {
            name        : document.getElementById('fp-name'),
            description : document.getElementById('fp-desc'),
        },
        task : {
            title       : document.getElementById('ft-title'),
            description : document.getElementById('ft-desc'),
            status      : document.getElementById('ft-status'),
            assignedTo  : document.getElementById('ft-assignee'),
        },
        subtask : {
            title       : document.getElementById('fst-title'),
            description : document.getElementById('fst-desc'),
        },
        member : {
            email : document.getElementById('fm-email'),
            role  : document.getElementById('fm-role'),
        },
        note : {
            content : document.getElementById('fn-content'),
        },
    }

    // Title labels
    const titles = {
        project : { add: 'Add Project',  edit: 'Edit Project'  },
        task    : { add: 'Add Task',     edit: 'Edit Task'     },
        subtask : { add: 'Add Subtask',  edit: 'Edit Subtask'  },
        member  : { add: 'Add Member',   edit: 'Update Role'   },
        note    : { add: 'Add Note',     edit: 'Edit Note'     },
    }

    let _activeType = null
    let _editData   = null      // null = add mode, object = edit mode
    let _submitBtn  = null

    function _hideAll() {
        Object.values(forms).forEach(f => f.classList.add('hidden'))
    }

    function _clearFields(type) {
        Object.values(fields[type]).forEach(el => { el.value = '' })
    }

    function _fillFields(type, data) {
        const f = fields[type]
        Object.keys(f).forEach(key => {
            if (data[key] !== undefined) f[key].value = data[key]
        })
    }

    function _getFormData(type) {
        const f = fields[type]
        const data = {}
        Object.keys(f).forEach(key => { data[key] = f[key].value.trim() })
        return data
    }

    function open(type, existingData = null) {
        _activeType = type
        _editData   = existingData

        // Show correct sub-form
        _hideAll()
        forms[type].classList.remove('hidden')

        // Set title
        titleEl.textContent = existingData ? titles[type].edit : titles[type].add

        // Pre-fill or clear
        existingData ? _fillFields(type, existingData) : _clearFields(type)

        // Wire submit — use { once: true } to prevent stacking
        _submitBtn = forms[type].querySelector('.form-btn-submit')
        _submitBtn.addEventListener('click', _handleSubmit, { once: true })

        // Show panel + overlay
        overlay.classList.add('open')
        panel.classList.add('open')
    }

    function close() {
        overlay.classList.remove('open')
        panel.classList.remove('open')
        _activeType = null
        _editData   = null
    }

    function _handleSubmit() {
        if (!_activeType) return
        const data    = _getFormData(_activeType)
        const isEdit  = _editData !== null

        // Basic validation — at least the first field must be non-empty
        const firstVal = Object.values(data)[0]
        if (!firstVal) {
            // Highlight first empty field
            Object.values(fields[_activeType])[0].focus()
            return
        }

        // Merge the original _id in for edit requests
        if (isEdit && _editData._id) data._id = _editData._id

        close()
        if (typeof formPanel.onSubmit === 'function') {
            formPanel.onSubmit(_activeType, data, isEdit)
        }
    }

    // Wire close buttons
    closeBtn.addEventListener('click', close)
    // Cancel buttons — one per form body, all do the same thing
    document.querySelectorAll('.form-btn-cancel').forEach(btn => {
        btn.addEventListener('click', close)
    })
    // Clicking the overlay also closes
    overlay.addEventListener('click', close)

    // Public API
    return { open, close, onSubmit: null }
})()


/* ──────────────────────────────────────────────────────────
   WIRE OPEN CALLS — replace / add these in your existing code
   (shown here as standalone listeners so you can see them
   all in one place; move them into your existing handlers)
──────────────────────────────────────────────────────────── */

// +Add Project button
document.getElementById('add-project-btn').addEventListener('click', () => {
    formPanel.open('project')
})

// Edit Project (in col-2 header)
document.getElementById('btn-edit-project')?.addEventListener('click', () => {
    formPanel.open('project', Actives.Project)
})

// +Add Task button — the button is created dynamically in renderTasks()
// so wire it via event delegation on tasklist instead:
document.getElementById('tasks-block').addEventListener('click', (e) => {
    if (e.target.id === 'add-task-btn') formPanel.open('task')
})

// +Add Subtask
document.getElementById('add-subtask-btn')?.addEventListener('click', () => {
    formPanel.open('subtask')
})

// Add Note / Comment
document.getElementById('btn-add-comment')?.addEventListener('click', () => {
    formPanel.open('note')
})


/* ──────────────────────────────────────────────────────────
   CENTRAL SUBMIT HANDLER
   Replace your scattered edit/add calls with this one block.
──────────────────────────────────────────────────────────── */

formPanel.onSubmit = async (type, data, isEdit) => {

    const projectId = Actives.Project._id
    const taskId    = Actives.Task._id
    let response

    if (type === 'project') {
        response = isEdit
            ? await requestAPI(paths.UpdateProject(projectId), data)
            : await requestAPI(paths.CreateProject, data)

        if (!response) { messageDisplay('Could not save project.'); return }

        if (isEdit) {
            Projects[Projects.findIndex(p => p._id === projectId)] = { ...Actives.Project, ...data }
        } else {
            Projects.unshift(response.data)
        }
        saveProjects()
        projectList.innerHTML = ''
        Projects.forEach(p => renderProject(p))
        renderTasks() // refreshes header
        messageDisplay(response.message)
    }

    else if (type === 'task') {
        response = isEdit
            ? await requestAPI(paths.UpdateTask(projectId, data._id), data)
            : await requestAPI(paths.CreateTask(projectId), data)

        if (!response) { messageDisplay('Could not save task.'); return }

        if (isEdit) {
            Tasks[Tasks.findIndex(t => t._id === data._id)] = response.data
        } else {
            Tasks.unshift(response.data)
        }
        saveTasks()
        tasklist.innerHTML = ''
        renderTasks()
        messageDisplay(response.message)
    }

    else if (type === 'subtask') {
        response = isEdit
            ? await requestAPI(paths.UpdateSubtask(projectId, data._id), data)
            : await requestAPI(paths.CreateSubtask(projectId, taskId), data)

        if (!response) { messageDisplay('Could not save subtask.'); return }

        if (isEdit) {
            Subtasks[Subtasks.findIndex(s => s._id === data._id)] = response.data
        } else {
            Subtasks.unshift(response.data)
        }
        saveSubtasks()
        renderTask()
        messageDisplay(response.message)
    }

    else if (type === 'member') {
        response = isEdit
            ? await requestAPI(paths.UpdateMemberRole(projectId, data._id), { role: data.role })
            : await requestAPI(paths.AddProjectMember(projectId), data)

        if (!response) { messageDisplay('Could not update member.'); return }
        messageDisplay(response.message)
    }

    else if (type === 'note') {
        const noteId = data._id
        response = isEdit
            ? await requestAPI(paths.UpdateNote(projectId, noteId), data)
            : await requestAPI(paths.CreateNote(projectId), data)

        if (!response) { messageDisplay('Could not save note.'); return }

        if (isEdit) {
            Notes[Notes.findIndex(n => n._id === noteId)] = response.data
        } else {
            Notes.unshift(response.data)
        }
        saveNotes()
        renderNotes()
        messageDisplay(response.message)
    }
}
