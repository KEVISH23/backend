import mongoose from "mongoose";

export interface IContent{
    _id?: mongoose.Types.ObjectId,
    userId?:string,
    title:string,
    contentPath:string
    description:string,
    createdAt?: string,
    updatedAt?: string,
    updatedBy?: mongoose.Types.ObjectId
}