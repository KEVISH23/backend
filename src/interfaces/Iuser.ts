import mongoose from "mongoose";
import { IDECODED } from "./IDECODED";

export interface IUSERS {
    _id?: mongoose.Types.ObjectId,
    fullName: string,
    gender: string,
    email: string,
    password: string,
    role?: string,
    token?: string,
    createdAt?: string,
    updatedAt?: string,
    updatedBy?: mongoose.Types.ObjectId
}
