const data = {
    "statusCode": 200,
    "data": {
        "message": "Server is running!"
    },
    "message": "Succes",
    "succes": true
}

let stringifydata =JSON.stringify(data)

console.log(JSON.parse(stringifydata));
