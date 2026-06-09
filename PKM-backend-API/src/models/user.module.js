import mongoose, { Schema, trusted } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto, { hash } from "crypto"

const userSchema = new Schema(
    //First Object are fields/ properties
    {
        avatar: {
            type: {
                url: String,
                localpath: String
            },

            default: {
                url: `https://placehold.co/200x299`,
                localpath: ""
            }
        },

        username: {
            type: String,
            //We can the logic too, with mongoose, just by true , false
            required: true, //doesnt allow submit unitll filled
            unique: true,  //checks the whole DB, allo wunique only
            lowercase: true,
            trim: true,
            index: true //should give were useful, ease in search
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        full_name: {
            type: String,
            trim: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"]
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        refreshToken: {
            type: String
        },

        forgotPasswordToken: {
            type: String
        },

        forgotPasswordExpiry: {
            type: Date
        },

        emailVerficationToken: {
            type: String
        },

        emailVerficationExpiry: {
            type: Date
        }
    },
    //TimeStaps 
    {
        timestamps: true
    }
)


//writing "pre/post Hooks" on schemas and model
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next
    //Fit only when password is modiefied    
    this.password = await bcrypt.hash(this.password, 12)
    next
})


//Even we can write realted methods here too, rathor in controllers
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}

//now generate temporary token for password resets (and in-case of forgot assword)
userSchema.methods.generateTemporaryToken = function () {
    const unHashedToken = crypto.randomBytes(20).toString("hex")

    //let encrypt that
    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex")

    const tokenExpiry = Date.now() + (20 * 60 * 1000) // 20 mins

    return { unHashedToken, hashedToken, tokenExpiry }
}

export const User = mongoose.model("User", userSchema)
