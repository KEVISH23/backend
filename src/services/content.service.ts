import { injectable } from "inversify";
import { IContent } from "../interfaces/IContent";
import { Content } from "../models";

@injectable()
export class ContentService{
    async addContent(data:IContent):Promise<void>{
        try {
            await Content.create(data)
        } catch (error) {
            throw(error)
        }
    }
    async getContentOfUser(id:string):Promise<IContent[]>{
        try {
            return await Content.find({userId:id})
        } catch (error) {
            throw(error)
        }
    }
    async deleteContentOfUser(id:string):Promise<void>{
        try {
            await Content.findByIdAndDelete(id)
        } catch (error) {
            throw(error)
        }
    }
    async updateContentOfUser(id:string,data:IContent,updatedBy:string):Promise<void>{
        try {
            await Content.findByIdAndUpdate(id,{...data,updatedBy})
        } catch (error) {
            throw(error)
        }
    }
    async getAllContents():Promise<IContent[]>{
        try {
            return await Content.find()
        } catch (error) {
            throw(error)
        }
    }
    async getContentById(id:string):Promise<IContent|null>{
        try {
            return await Content.findById(id)
        } catch (error) {
            throw(error)
        }
    }
}