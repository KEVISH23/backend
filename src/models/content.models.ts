import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,'Userid is required']
    },
    contentPath:{
        type:String,
        required:[true,'Please upload file']
    },
    title:{
        type:String,
        required:[true,'Title is required'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'Description is required'],
        trim:true
    },
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{
    timestamps:true
})

const Content = mongoose.model('content',ContentSchema)
export {Content}