import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Email is required'],
        unique:true
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        trim: true,
        enum: ["CC", "Admin"],
        required: [true, 'Role is required']
    },
    token: {
        type: String,
        default: ""
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    gender: {
        type: String,
        enum:['male','female','others'],
        required:[true,'Gender is required']
    }
}, {
    timestamps: true
})
UserSchema.pre('save',async function(next){
    if (this.password) {
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(this.password, salt)
        this.password = hashPassword
    }
   
})
const User = mongoose.model('User', UserSchema)
export { User }