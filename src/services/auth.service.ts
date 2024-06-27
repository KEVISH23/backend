import { injectable } from "inversify";
import { IUSERS } from "../interfaces";
import { User } from "../models";
import { responseMessage } from "../constants";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from 'config'
@injectable()
export class AuthService{
    async registerService(data:IUSERS):Promise<void>{
        try {
            await User.create(data)
            return;
        } catch (error) {
            throw(error)
        }
    }

    async loginService(email:string,password:string):Promise<IUSERS|null>{
        try {
            const user:IUSERS|null = await User.findOne({email})
            if(!user){
                throw new Error(responseMessage.NOTREGISTERED)
            }
            const comparePass = bcrypt.compareSync(password,user.password)
            if(!comparePass){
                throw new Error(responseMessage.INVALID_CREDENTIALS)
            }
            if(user.token && user.token.length > 0){
                throw new Error(responseMessage.ALREADY_LOGGEDIN)
            }
            const {_id,role} = user
            const token = jwt.sign({_id,email,role},config.get("SECRET_KEY"))
            await User.findOneAndUpdate({email},{
                $set:{token}
            })
            const user1:IUSERS|null = await User.findOne({email})
            return user1

        } catch (error:any) {
            throw(error)
        }
    }

    
    async logoutService(_id:string):Promise<void>{
        try {
            await User.findByIdAndUpdate({_id},{
                $set:{token:""}
            })
        } catch (error) {
            throw(error)
        }
    }
}