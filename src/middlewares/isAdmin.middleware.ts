import {  Request,Response, NextFunction } from "express";
import { BaseMiddleware } from "inversify-express-utils";
import { responseMessage } from "../constants";
import jwt from 'jsonwebtoken'
import config from 'config'
import { errorHandler } from "../utils";
import { IDECODED } from "../interfaces/IDECODED";
export class AdminMiddleware extends BaseMiddleware{
    handler(req: Request, res: Response<any, Record<string, any>>, next: NextFunction): void {
        try{
            // console.log(req.headers)
            const role = req.headers.role 
            if(role==='Admin'){
                next()
            }else{
                throw new Error(responseMessage.UNAUTHORIZED)
            }
        }catch(err:any){
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }
}