import { Pipe, PipeTransform } from '@angular/core';
import { ITicket } from '../interface/ticket';

@Pipe({ name: 'LabelValue', standalone: true })
export class LabelValue implements PipeTransform {
  transform(tickets: ITicket[], args?: string[]): any {
    if(args[0] === 'count') {
      return [...new Set(tickets?.map(ticket => ticket.status))];
    }
    if(args[0] === 'type') {
      //return [...new Set(tickets.map(ticket => ticket.type))];
      const types = [...new Set(tickets?.map(ticket => ticket.type))];
      return types.map(type => [`${type}: ${this.ticketTotalByType(tickets, type)}`]);
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
      const data = []
      for(const key in groups) {
        data.push(key);
      }
      return { categories: data };
    }
    return {
      categories: [...new Set(tickets?.map(ticket => ticket.status))],
      position: 'top',
      labels: {
        offsetY: -18
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        fill: {
          colors: ['#F44336', '#E91E63', '#9C27B0']
        }
      },
      tooltip: {
        enabled: true,
        offsetY: -35
      }
    }
    }

    ticketTotalByType = (tickets: ITicket[], type: string) => tickets.filter(ticket => ticket.type === type).length;

    getWeekNumber = (date: any) => {
      const firstDayOfYear: Date | any = new Date(date.getFullYear(), 0, 1);
      const daysPassed = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
      const weekNumber = Math.ceil((daysPassed + firstDayOfYear.getDay() + 1) / 7);
      return `Year ${date.getFullYear()} - Week ${weekNumber.toString().padStart(2, '0')}`;
    }
  }
