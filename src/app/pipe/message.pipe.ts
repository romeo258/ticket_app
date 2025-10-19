import { Pipe, PipeTransform } from '@angular/core';
import { IMessage } from '../interface/message';

@Pipe({ name: 'MessageGroup', standalone: true })
export class MessageGroup implements PipeTransform {
    transform(messages: IMessage[], args?: string[]): any {
        const emails = new Set();
        const groups = messages?.reduce((acc, message, index, array) => {
            emails.add(message.senderEmail);
            emails.add(message.receiverEmail);
            let key = message.conversationId;
            if (!acc[key]) { acc[key] = []; }
            acc[key].push(message);
            return acc;
        }, {});
        const data = [];
        for (const key in groups) {
            data.push({ conversationId: key, participants: this.getEmails(groups[key], args[0])[0], images: this.getEmails(groups[key], args[0])[1], status: this.getEmails(groups[key], args[0])[2], subject: groups[key][0].subject, messages: groups[key] });
        }
        return data;
    }

    getEmails = (messages: IMessage[], email: string) => {
        const emails = new Set();
        const images = new Set();
        const newMessageCount = [];
        messages.forEach(message => {
            images.add(message.senderImageUrl);
            // images.add(message.receiverImageUrl);
            emails.add(message.senderEmail === email ? 'You' : message.senderEmail);
            emails.add(message.senderEmail === email ? 'You' : message.senderEmail);
            if(message.status === 'UNREAD') { newMessageCount.push(message.status)}
        });
        return [[...emails], [...images], newMessageCount.length > 0 ? 'UNREAD' : 'OPENED'];
    }
}