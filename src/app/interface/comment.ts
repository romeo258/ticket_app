export interface IComment {
    commentId: number;
    commentUuid: string;
    comment: string;
    status: string;
    edited: boolean;
    userUuid: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}