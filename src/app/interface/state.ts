import { defaultQuery, IQuery } from "./query";
import { ITicket } from "./ticket";
import { IUser } from "./user";
import { ITicketDetail } from "./ticketdetail";
import { IMessage } from "./message";
import { IDevice } from "./device";

export interface IState {
    loading: boolean;
    profile?: IUser;
    user?: IUser;
    ticketDetail?: ITicketDetail;
    tickets?: ITicket[];
    allTickets?: ITicket[];
    pages?: number;
    currentPage?: number;
    reportRequest?: {},
    error?: string;
    query?: IQuery;
    users?: IUser[];
    report?: ITicket[];
    messages?: IMessage[];
    conversation?: any[];
    devices?: IDevice[];
}

export const initialState: IState = { profile: null, user: null, users: null, ticketDetail: null, tickets: null, allTickets: null, report: null, pages: null, currentPage: 0, reportRequest: undefined, loading: false, error: null, messages: null, conversation: null, devices: null, query: defaultQuery };
