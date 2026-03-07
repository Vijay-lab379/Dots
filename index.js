import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

let myusername = process.env.database

console.log("value is :",myusername);

console.log("Beggining of backend proj.");
