import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/asyncHandler.js"
/*
const healthhCheck = async  (req, res, next) => {
    try {

        const user = await getUserFromDB
        // DB may theow an Errro 
        res
        .status(200)
        .json(
            new ApiResponse(200, {message: "Sever is running!"})
        )
    } catch (error) {
        next(err)
    }
}
*/

//if you use try catch -> you need to use async-await on each of them
//try catch is great to handl issues 
// Avoid using too much of try catch 
const healthCheck = asyncHandler((req, res) => {
    res
        .status(200)
        .json(
            new ApiResponse(200, { message: "Server is running!", })
        )
}
)

export { healthCheck }