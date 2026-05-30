# Dashboard 
## User option
- Register: - first request
- login: - saves users email, pass
- Logout - option to login other

Once user is loged in 'load'
- Projects
- task assigned
  - click on task and get task deteals and subtasks
- project notes

example responses

Auth login response 
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


get projects -
{
    "statusCode": 200,
    "data": [
        {
            "role": "admin",
            "projects": {
                "_id": "69f9662537527c0235b9d7ce",
                "name": "Suraj's Project",
                "description": "Example project One",
                "createdBy": "69f5a0d8244d933467db2f69",
                "createdAt": "2026-05-05T03:38:13.859Z"
            }
        },
        {
            "role": "admin",
            "projects": {
                "_id": "69f9663237527c0235b9d7d4",
                "name": "Suraj's another Project",
                "description": "Example project Two",
                "createdBy": "69f5a0d8244d933467db2f69",
                "createdAt": "2026-05-05T03:38:26.036Z"
            }
        }
    ],
    "message": "Projects fetched succesfully",
    "succes": true
}

Get project by ID 
{
    "statusCode": 200,
    "data": {
        "_id": "69f9663237527c0235b9d7d4",
        "name": "Suraj's another Project",
        "description": "Example project Two",
        "createdBy": "69f5a0d8244d933467db2f69",
        "createdAt": "2026-05-05T03:38:26.036Z",
        "updatedAt": "2026-05-05T03:38:26.036Z",
        "__v": 0
    },
    "message": "Project fetched Succesfullly!",
    "succes": true
}


create task
{
    "statusCode": 201,
    "data": {
        "title": "Second",
        "description": "The task of this PKM",
        "project": "69f9663237527c0235b9d7d4",
        "assignedTo": "69ee03075dd0883d306f829e",
        "assignedBy": "69f5a0d8244d933467db2f69",
        "status": "todo",
        "attachments": [],
        "_id": "69f9674a37527c0235b9d7eb",
        "createdAt": "2026-05-05T03:43:06.314Z",
        "updatedAt": "2026-05-05T03:43:06.314Z",
        "__v": 0
    },
    "message": "Task created succesfully",
    "succes": true
}

get Tasks 

{
    "statusCode": 200,
    "data": [
        {
            "_id": "69f9674a37527c0235b9d7eb",
            "title": "Second",
            "description": "The task of this PKM",
            "project": "69f9663237527c0235b9d7d4",
            "assignedTo": {
                "_id": "69ee03075dd0883d306f829e",
                "avatar": {
                    "url": "https://placehold.co/200x299",
                    "localpath": "",
                    "_id": "69ee03075dd0883d306f829d"
                },
                "username": "pravin"
            },
            "assignedBy": "69f5a0d8244d933467db2f69",
            "status": "todo",
            "attachments": [],
            "createdAt": "2026-05-05T03:43:06.314Z",
            "updatedAt": "2026-05-05T03:43:06.314Z",
            "__v": 0
        },
        {
            "_id": "69f9679337527c0235b9d7f1",
            "title": "First",
            "description": "A task of this Surajs projec",
            "project": "69f9663237527c0235b9d7d4",
            "assignedTo": {
                "_id": "69ee03075dd0883d306f829e",
                "avatar": {
                    "url": "https://placehold.co/200x299",
                    "localpath": "",
                    "_id": "69ee03075dd0883d306f829d"
                },
                "username": "pravin"
            },
            "assignedBy": "69f5a0d8244d933467db2f69",
            "status": "todo",
            "attachments": [],
            "createdAt": "2026-05-05T03:44:19.078Z",
            "updatedAt": "2026-05-05T03:44:19.078Z",
            "__v": 0
        }
    ],
    "message": "Tasks fetched succeesfully",
    "succes": true
}


//Task by Id 
{
    "statusCode": 200,
    "data": [
        {
            "_id": "6a0eccd127c041239878d7bd",
            "title": "First",
            "description": "A task of this Surajs projec",
            "project": "6a0dbe3aaaea1709e52d2d03",
            "assignedBy": "6a0d2b5f01b0f46a327f9547",
            "status": "todo",
            "attachments": [],
            "createdAt": "2026-05-21T09:13:53.731Z",
            "updatedAt": "2026-05-21T09:13:53.731Z",
            "__v": 0,
            "subtasks": [
                {
                    "_id": "6a0ecd0527c041239878d7c3",
                    "title": "Non o these",
                    "task": "6a0eccd127c041239878d7bd",
                    "isCompleted": false,
                    "createdBy": {
                        "_id": "6a0d2b5f01b0f46a327f9547",
                        "avatar": {
                            "url": "https://placehold.co/200x299",
                            "localpath": "",
                            "_id": "6a0d2b5f01b0f46a327f9546"
                        },
                        "username": "vijay"
                    },
                    "createdAt": "2026-05-21T09:14:45.216Z",
                    "updatedAt": "2026-05-21T09:14:45.216Z",
                    "__v": 0
                },
                {
                    "_id": "6a0ee7f327c041239878eb4e",
                    "title": "I am a Subtask",
                    "task": "6a0eccd127c041239878d7bd",
                    "isCompleted": false,
                    "createdBy": {
                        "_id": "6a0d2b5f01b0f46a327f9547",
                        "avatar": {
                            "url": "https://placehold.co/200x299",
                            "localpath": "",
                            "_id": "6a0d2b5f01b0f46a327f9546"
                        },
                        "username": "vijay"
                    },
                    "createdAt": "2026-05-21T11:09:39.469Z",
                    "updatedAt": "2026-05-21T11:09:39.469Z",
                    "__v": 0
                }
            ]
        }
    ],
    "message": "Task fetched Succesfully!",
    "succes": true
}


//create Note
{
    "statusCode": 200,
    "data": {
        "project": "6a0dbe3aaaea1709e52d2d03",
        "createdBy": "6a0d2b5f01b0f46a327f9547",
        "content": "Another Note and all the way tit out I loved it I acm being crazy , Woooooooo!",
        "_id": "6a0dc2c7f4532b0f5938fe1f",
        "createdAt": "2026-05-20T14:18:47.495Z",
        "updatedAt": "2026-05-20T14:18:47.495Z",
        "__v": 0
    },
    "message": "Project Note created succesfuly!",
    "succes": true
}