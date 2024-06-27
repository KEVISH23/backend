import { controller, httpDelete, httpGet, httpPost, httpPut, request, response } from 'inversify-express-utils'
import { responseMessage, TYPES } from '../constants';
import { errorHandler } from '../utils';
import { Response, Request, NextFunction } from 'express';
import multer from 'multer';
import path from 'node:path'
import { IContent } from '../interfaces/IContent';
import { ContentService } from '../services';
import { inject } from 'inversify';
import { isValidObjectId } from 'mongoose';
const storageConfig = multer.diskStorage({
    destination: path.join(__dirname, "../public/uploads"),
    filename: (req, file, res) => {
            const randomValue = Date.now()
            req.body = {
                ...req.body,
                contentPath: path.join("/public/uploads" + "/" + randomValue + file.originalname)
            }
            res(null, randomValue + file.originalname)
    }
})
const upload = multer(
    {
        storage: storageConfig,
        dest: '../../public/uploads',
        limits:{files:1},
        fileFilter:(req, file, callback)=> {
            if (!req.body.title || !req.body.description) {
                callback(null,false)
            }else{
                callback(null,true)
            }
        },
    }
)
const multerErrorHandling = (err:any, req:Request, res:Response, next:NextFunction) => {
    if (err instanceof multer.MulterError) {
      res.status(400).send("Multer error: " + err.message);
    } else {
      next();
    }
    };
@controller('/content', TYPES.AuthMiddleware)
export class ContentController {
    constructor(
        @inject<ContentService>(TYPES.ContentService) private contentService: ContentService
    ) { }
    @httpPost('/addContent', upload.single('content'),multerErrorHandling)
    async addContent(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const _id  = req.headers._id as string
            const formData = { ...req.body,userId:_id } as IContent
            await this.contentService.addContent(formData)
            res.json({status:true,message:responseMessage.CONTENTUPLOADED})
        } catch (error) {
            const message: string = errorHandler(error)
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

    @httpGet('/getContentOfUser')
    async getContentOfUser(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const _id  = req.headers._id as string
            const data:IContent[] = await this.contentService.getContentOfUser(_id)
            res.json({status:true,data})
        } catch (error) {
            const message: string = errorHandler(error)
            res.json({ status: false, message })
        }
    }

    @httpDelete('/deleteContentOfUser/:contentId')
    async deleteContentOfUser(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const {contentId} = req.params
            if(!isValidObjectId(contentId)){
                throw new Error(responseMessage.IDNOTVALID)
            }
            await this.contentService.deleteContentOfUser(contentId)
            res.json({status:true,message:responseMessage.CONTENTREMOVED})
        } catch (error) {
            const message: string = errorHandler(error)
            res.json({ status: false, message })
        }
    }

    @httpPut('/updateContentById/:contentId',upload.single('content'))
    async updateContentById(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const {contentId} = req.params
            const _id  = req.headers._id as string
            const formData = { ...req.body,userId:_id } as IContent
            const {title,description,contentPath,userId} = formData
            if(!isValidObjectId(contentId)){
                throw new Error(responseMessage.IDNOTVALID)
            }
            await this.contentService.updateContentOfUser(contentId,{title,description,contentPath,userId},_id)
            res.json({status:true,message:responseMessage.CONTENTUPDATED})
        } catch (error) {
            const message: string = errorHandler(error)
            res.json({ status: false, message })
        }
    }


    @httpGet('/getContentById/:id')
    async getContentById(@request() req: Request, @response() res: Response):Promise<void>{
        try {
            const {id} = req.params
            if(!isValidObjectId(id)){
                throw new Error(responseMessage.IDNOTVALID)
            }
            const data:IContent|null = await this.contentService.getContentById(id)
            res.json({status:true,data})
        } catch (error) {
            const message: string = errorHandler(error)
            res.json({ status: false, message })
        }
    }
}