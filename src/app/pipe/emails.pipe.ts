import { Pipe, PipeTransform } from '@angular/core';
import { IMessage } from '../interface/message';

@Pipe({ name: 'Emails', standalone: true })
export class Emails implements PipeTransform {
    transform(messages: IMessage[], args?: string[]): any {
        const emails = new Set();
        messages?.forEach(message => {
            emails.add(message.senderEmail === args[0] ? 'You' : message.senderEmail);
            emails.add(message.receiverEmail === args[0] ? 'You' : message.receiverEmail);
        });
        if(args.length == 1) {
            return [...emails];
        } else {
            return [...emails][0] === 'You' ? [...emails][1] : [...emails][0];
        }
    }
}