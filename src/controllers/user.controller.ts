import { Request, Response } from "express";
import { controller, httpDelete, httpGet, httpPut, request, response } from "inversify-express-utils";
import { IUSERS } from "../interfaces";
import { errorHandler } from "../utils";
import { UserService } from "../services";
import { responseMessage, TYPES } from "../constants";
import { inject } from "inversify";
import { IDECODED } from "../interfaces/IDECODED";
@controller('/user')
export class UserController {

    constructor(
        @inject<UserService>(TYPES.UserService) private userService: UserService
    ) { }
    // @httpGet('/')
    // async getAllUsers(@request() req: Request, @response() res: Response): Promise<void> {
    //     try {
    //         const data: IUSERS[] = await this.userService.getAllUsers()
    //         res.json({ status: true, data })
    //     } catch (err) {
    //         const message: string = errorHandler(err)
    //         res.json({ status: false, message })
    //     }
    // }
    @httpGet('/getUserById', TYPES.AuthMiddleware)
    async getUserById(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const _id  = req.headers._id as string
            const data: IUSERS | null = await this.userService.getUserById(_id)
            res.json({ status: true, data })
        } catch (err) {
            const message: string = errorHandler(err)
            res.json({ status: false, message })
        }
    }
    @httpPut('/updateUserById', TYPES.AuthMiddleware)
    async updateUserById(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const _id  = req.headers._id as string
            const { fullName, gender, email, password } = req.body as IUSERS
            const data: IUSERS | null = await this.userService.updateUserById(_id, { fullName, gender, email, password }, _id)
            res.json({ status: true, data,message:responseMessage.USERUPDATED })
        } catch (err) {
            const message: string = errorHandler(err)
            res.json({ status: false, message })
        }
    }

    @httpDelete('/deleteUserById', TYPES.AuthMiddleware)
    async deleteUserById(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const _id  = req.headers._id as string
            await this.userService.deleteUserById(_id)
            res.json({ status: true, message:responseMessage.DELETEDUSER })
        } catch (err) {
            const message: string = errorHandler(err)
            res.json({ status: false, message })
        }
    }
}