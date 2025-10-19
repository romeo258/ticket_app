import { Pipe, PipeTransform } from '@angular/core';
import { ITicket } from '../interface/ticket';

@Pipe({ name: 'DataValue', standalone: true })
export class DataValue implements PipeTransform {
  transform(tickets: ITicket[], args?: string[]): any {
    if (args[0] === 'count') {
      const statuses = [...new Set(tickets?.map(ticket => ticket.status))];
      return statuses.map(status => this.ticketTotalByStatus(tickets, status));
    }
    if (args[0] === 'status') {
      return this.ticketTotalByStatus(tickets, args[1]);
    }
    if (args[0] === 'type') {
      const types = [...new Set(tickets?.map(ticket => ticket.type))];
      return types.map(type => this.ticketTotalByType(tickets, type));
    }
    if (args[0] === 'sortByDate') {
      return tickets?.filter(ticket => ticket.status !== 'COMPLETED' && ticket.status !== 'CLOSED')
        .map(ticket => ({ ...ticket, createdAt: new Date(ticket.createdAt) }))
        .sort((ticket1, ticket2) => ticket1.createdAt.getTime() - ticket2.createdAt.getTime()) as ITicket[];
    }
    if (args[0] === 'line') {
      const newTickets = tickets?.map(ticket => ({ ...ticket, createdAt: new Date(ticket.createdAt) }))
      .sort((ticket1, ticket2) => ticket1.createdAt.getTime() - ticket2.createdAt.getTime());
      const groups = newTickets?.reduce((acc, ticket) => {
        const yearWeek = this.getWeekNumber(ticket.createdAt);
        if (!acc[yearWeek]) { acc[yearWeek] = []; }
        acc[yearWeek].push(ticket);
        return acc;
      }, {});
      console.log(groups);
      const data: number[] = []
      for(const key in groups) {
        data.push(groups[key].length);
      }
      return [{ name: 'Tickets', data }];
    }
    const statuses = [...new Set(tickets?.map(ticket => ticket.status))];
    const data = statuses.map(status => this.ticketTotalByStatus(tickets, status));
    return [{ name: 'Tickets', data }];
  }

  private ticketTotalByStatus = (tickets: ITicket[], status: string) => tickets?.filter(ticket => ticket.status === status).length;
  private ticketTotalByType = (tickets: ITicket[], type: string) => tickets?.filter(ticket => ticket.type === type).length;

  private getWeekNumber = (date: Date | any) => {
    const firstDayOfYear: Date | any = new Date(date.getFullYear(), 0, 1);
    const daysPassed = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((daysPassed + firstDayOfYear.getDay() + 1) / 7);
    return `Year ${date.getFullYear()} - W${weekNumber.toString().padStart(2, '0')}`;
  }
}