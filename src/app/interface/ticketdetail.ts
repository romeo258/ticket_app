import { IComment } from "./comment";
import { IFile } from "./file";
import { TechSupport } from "./techsupport";
import { ITicket } from "./ticket";
import { IUser } from "./user";

export interface ITicketDetail {
    ticket: ITicket;
    comments?: IComment[];
    files?: IFile[];
    tasks?: any[];
    assignee?: TechSupport;
    techSupports?: TechSupport[];
    user?: IUser;
}