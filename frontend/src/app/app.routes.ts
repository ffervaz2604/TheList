import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent),
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    },
    {
        path: 'reset-password',
        loadComponent: () =>
            import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent),
        children: [
            { path: '', loadComponent: () => import('./dashboard/welcome/welcome.component').then(m => m.WelcomeComponent) },
        ]
    },
    {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
    },
];
