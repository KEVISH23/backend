import {  controller, httpDelete, httpGet, httpPost, httpPut, request, response } from "inversify-express-utils";
import { errorHandler } from "../utils/errorHandler";
import { Request, Response } from "express";
import { IUSERS } from "../interfaces";
import { inject } from "inversify";
import { ContentService, UserService } from "../services";
import { responseMessage, TYPES } from "../constants";
import { IDECODED } from "../interfaces/IDECODED";
import { IContent } from "../interfaces/IContent";
import multer from "multer";
import path from 'path'
import { isValidObjectId } from "mongoose";
const storageConfig = multer.diskStorage({
    destination: path.join(__dirname, "../public/uploads"),
    filename: (req, file, res) => {
            req.body = {
                ...req.body,
                contentPath: path.join("/../public/uploads/"+Date.now() + file.originalname)
            }
            res(null, Date.now() + file.originalname)
    }
})
const upload = multer(
    {
        storage: storageConfig,
        dest: '../../public/uploads',
        fileFilter:(req, file, callback)=> {
            if (!req.body.title || !req.body.description) {
                callback(null,false)
            }else{
                callback(null,true)
            }
        },
    }
)
@controller('/admin',TYPES.AuthMiddleware,TYPES.AdminMiddleware)
export class AdminController{
    constructor(
        @inject<UserService>(TYPES.UserService) private userService:UserService,
        @inject<ContentService>(TYPES.ContentService) private contentService: ContentService
    ){}
    @httpGet('/getAllUser')
    async getAllUsers(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const data:IUSERS[] = await this.userService.getAllUsers()
            res.json({status:true,data})
        }catch(err){
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }

    @httpGet('/getParticularUser/:userId')
    async getParticularUser(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const {userId} = req.params
            const data:IUSERS|null = await this.userService.getUserById(userId)
            res.json({status:true,data})
        }catch(err){
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }
    @httpPut('/updateParticularUser/:userId')
    async updateParticularUser(@request() req:Request,@response() res:Response):Promise<void>{
        try{
            const _id  = req.headers._id as string
            const {userId} = req.params
            const {fullName,gender,email,password} = req.body as IUSERS
            const data:IUSERS|null = await this.userService.updateUserById(userId,{fullName,gender,email,password},_id)
            res.json({status:true,data,message:responseMessage.USERUPDATED})
        }catch(err){
            const message:string = errorHandler(err)
            res.json({status:false,message})
        }
    }
    @httpDelete('/deleteUserById/:userId', TYPES.AuthMiddleware)
    async deleteUserById(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const {userId} = req.params
            await this.userService.deleteUserById(userId)
            res.json({ status: true, message:responseMessage.DELETEDUSER })
        } catch (err) {
            const message: string = errorHandler(err)
            res.json({ status: false, message })
        }
    }
    @httpGet('/getAllContents')
    async getAllContents(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const data:IContent[] = await this.contentService.getAllContents()
            res.json({ status: true, data })
        } catch (err) {
            const message: string = errorHandler(err)
            res.json({ status: false, message })
        }
    }

    @httpGet('/getContentOfParticularUser/:userId')
    async getContentOfParticularUser(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const {userId} = req.params
            const data:IContent[] = await this.contentService.getContentOfUser(userId)
            res.json({ status: true, data })
        } catch (err) {
            const message: string = errorHandler(err)
            res.json({ status: false, message })
        }
    }

    @httpDelete('/deleteContent/:contentId')
    async deleteContent(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const {contentId} = req.params
           await this.contentService.deleteContentOfUser(contentId)
            res.json({ status: true ,message:responseMessage.CONTENTREMOVED})
        } catch (err) {
            const message: string = errorHandler(err)
            res.json({ status: false, message })
        }
    }

    @httpPut('/updateContent/:contentId',upload.single('content'))
    async updateContentById(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const {contentId} = req.params
            const _id  = req.headers._id as string
            const formData = { ...req.body } as IContent
            const {title,description,contentPath} = formData
            if(!isValidObjectId(contentId)){
                throw new Error(responseMessage.IDNOTVALID)
            }
            await this.contentService.updateContentOfUser(contentId,{title,description,contentPath},_id)
            res.json({status:true,message:responseMessage.CONTENTUPDATED})
        } catch (error) {
            const message: string = errorHandler(error)
            res.json({ status: false, message })
        }
    }
}