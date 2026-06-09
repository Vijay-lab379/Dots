// Enum basically means - iteratabel or basicaly we can loop thought it
export const UserRolesEnum = {
    ADMIN : "admin",
    PROJECT_ADMIN : "project_admin",
    MEMBER : "member"
}

export const AvailabelRole = Object.values(UserRolesEnum)

export const TaskStatusEnum = {
    TODO : "todo",
    IN_PROGRESS : "in_progress",
    DONE : "done"
}

export const AvailabelTaskStatusEnum = Object.values(TaskStatusEnum)