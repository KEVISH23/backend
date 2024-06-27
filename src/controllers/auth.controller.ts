import {  controller, httpPost, request, response } from "inversify-express-utils";
import { errorHandler } from "../utils/errorHandler";
import { Request, Response } from "express";
import { IUSERS } from "../interfaces";
import { inject } from "inversify";
import { AuthService } from "../services";
import { responseMessage, TYPES } from "../constants";
import { IDECODED } from "../interfaces/IDECODED";
@controller('/auth')
export class AuthController{
    constructor(
        @inject<AuthService>(TYPES.AuthService) private authService:AuthService
    ){}

    @httpPost('/register')
    async registerUser(@request() req:Request,@response() res:Response):Promise<void>{
        try {
            const {email,fullName,password,role,gender} = req.body as IUSERS
            await this.authService.registerService({email,fullName,password,role,gender})
            res.json({status:true,message:responseMessage.CREATED})
        } catch (error) {
            const message:string = errorHandler(error)
            res.json({status:false,message})
        }
    }

    @httpPost('/login')
    async loginUser(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const {email,password} = req.body
            const user:IUSERS|null = await this.authService.loginService(email,password)
            res.json({status:true,message:responseMessage.LOGGEDIN,user})
        }catch(err:any){
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }

    @httpPost('/logout',TYPES.AuthMiddleware)
    async logout(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const _id  = req.headers._id as string
            await this.authService.logoutService(_id)
            res.json({status:true,message:responseMessage.LOGGEDOUT})
        }catch(err:any){
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }
}