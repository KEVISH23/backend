import { injectable } from "inversify";
import {  IUSERS } from "../interfaces";
import bcrypt from 'bcrypt'
import { User } from "../models";
import { responseMessage } from "../constants";
import mongoose from "mongoose";
@injectable()
export class UserService {
    async getAllUsers(): Promise<IUSERS[]> {
        try {
            return await User.find()
        } catch (error: any) {
            throw (error)
        }
    }
    async getUserById(id: string): Promise<IUSERS | null> {
        try {
            return await User.findById(id)
        } catch (error: any) {
            throw (error)
        }
    }
    async updateUserById(id: string, data: IUSERS,updatedBy:string): Promise<IUSERS | null> {
        try {
            let { fullName, gender, email, password } = data
            if (!fullName && !gender && !email && !password) {
                throw new Error(responseMessage.USERUPDATEFIELDS)
            }
            if (password) {
                const salt = bcrypt.genSaltSync(10)
                const hashPassword = bcrypt.hashSync(password, salt)
                password = hashPassword
            }
            data = {
                ...data,
                updatedBy:new mongoose.Types.ObjectId(updatedBy)
            }
            return await User.findByIdAndUpdate(id, data)
        } catch (error: any) {
            throw (error)
        }
    }
    async deleteUserById(id: string): Promise<void> {
        try {
            await User.findByIdAndDelete(id)
        } catch (error: any) {
            throw (error)
        }
    }
}