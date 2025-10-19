import { Routes } from '@angular/router'

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: '',
        loadComponent: () => import('./auth.component').then(c => c.AuthComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./home/home.component').then(c => c.HomeComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./register/register.component').then(c => c.RegisterComponent)
            },
            {
                path: 'resetpassword',
                loadComponent: () => import('./resetpassword/resetpassword.component').then(c => c.ResetpasswordComponent)
            },
            {
                path: 'verify/password',
                loadComponent: () => import('./verifypassword/verify-password.component').then(c => c.VerifypasswordComponent)
            },
            {
                path: 'verify/account',
                loadComponent: () => import('./verifyaccount/verifyaccount.component').then(c => c.VerifyaccountComponent)
            }
        ]
    }
];