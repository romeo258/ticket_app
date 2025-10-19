import { Routes } from '@angular/router';

export const NAVBAR_ROUTES: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: '',
        loadComponent: () => import('./navbar.component').then(c => c.NavbarComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent)
            },
            {
                path: 'tickets',
                loadComponent: () => import('./ticket/tickets/tickets.component').then(c => c.TicketsComponent)
            },
            {
                path: 'tickets/:ticketUuid',
                loadComponent: () => import('./ticket/ticket-detail/ticket-detail.component').then(c => c.TicketDetailComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./user/users/users.component').then(c => c.UsersComponent)
            },
            {
                path: 'users/:userUuid',
                loadComponent: () => import('./user/user-detail/user-detail.component').then(c => c.UserDetailComponent)
            },
            {
                path: 'messages',
                loadComponent: () => import('./message/messages/messages.component').then(c => c.MessagesComponent)
            },
            {
                path: 'messages/:conversationId',
                loadComponent: () => import('./message/message-detail/message-detail.component').then(c => c.MessageDetailComponent)
            },
            {
                path: 'reports',
                loadComponent: () => import('./reports/reports.component').then(c => c.ReportsComponent)
            }
        ]
    }
];
