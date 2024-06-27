import {  Request,Response, NextFunction } from "express";
import { BaseMiddleware } from "inversify-express-utils";
import { responseMessage } from "../constants";
import jwt from 'jsonwebtoken'
import config from 'config'
import { errorHandler } from "../utils";
import { IDECODED } from "../interfaces/IDECODED";
export class AuthMiddleware extends BaseMiddleware{
    handler(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): void {
        try{
            // console.log(req.headers)
            const token = req.headers.authorization?.split(' ')[1]
            if(!token){
                throw new Error(responseMessage.TOKENNOTPROVIDED)
            }
            jwt.verify(token.toString(),config.get("SECRET_KEY"),(err:any,decoded:any)=>{
                if(err){
                    throw new Error(responseMessage.TOKENINVALID)
                }
                req.headers = {
                    ...req.headers,
                    _id:decoded._id,
                    role:decoded.role,
                }
                next()
            })
        }catch(err:any){
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }
}