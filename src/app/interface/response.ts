
import { IComment } from "./comment";
import { IDevice } from "./device";
import { IFile } from "./file";
import { IMessage } from "./message";
import { ITask } from "./task";
import { TechSupport } from "./techsupport";
import { ITicket } from "./ticket";
import { IUser } from "./user";

export interface IResponse {
    time: Date | string;
    code: number;
    status: string;
    message: string;
    path: string;
    exception?: string;
    data: { user?: IUser, users?: IUser[], ticket?: ITicket, tickets?: ITicket[], comment?: IComment, comments?: IComment[], files?: IFile[], task?: ITask, tasks?: ITask[], pages?: number, assignee?: TechSupport, techSupports?: TechSupport[], report?: ITicket[], messages: IMessage[], message: IMessage, conversation: IMessage[], devices: IDevice[] };
}