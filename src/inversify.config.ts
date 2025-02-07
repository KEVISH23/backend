import { Container } from "inversify";
import { AuthService, ContentService, UserService } from "./services";
import { TYPES } from "./constants";
import { AuthMiddleware,AdminMiddleware } from "./middlewares";
import { AdminService } from "./services/admin.service";
const container = new Container()
container.bind<AuthService>(TYPES.AuthService).to(AuthService)
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware)
container.bind<AdminMiddleware>(TYPES.AdminMiddleware).to(AdminMiddleware)
container.bind<UserService>(TYPES.UserService).to(UserService)
container.bind<ContentService>(TYPES.ContentService).to(ContentService)
container.bind<AdminService>(TYPES.AdminService).to(AdminService)
export {container}