import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';

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
        component: DashboardComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./dashboard/welcome/welcome.component').then(m => m.WelcomeComponent),
            },
            {
                path: 'profile',
                loadComponent: () => import('./profile/profile/profile.component').then(m => m.ProfileComponent),
            },
            {
                path: 'change-password',
                loadComponent: () => import('./profile/change-password/change-password.component').then(m => m.ChangePasswordComponent),
            },
            {
                path: 'shared-lists',
                loadComponent: () =>
                    import('./shared-lists/shared-lists/shared-lists.component').then(m => m.SharedListsComponent),
            }

        ],
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    }
];
