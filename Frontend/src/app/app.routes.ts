import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { RecoveryComponent } from './auth/recovery/recovery.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [

    {
        path: 'auth', component: AuthLayoutComponent,
        children: [
            {path: 'login', component: LoginComponent},
            {path: 'recovey', component: RecoveryComponent},
            {path: 'registro', component: RegistroComponent}
        ]
    },
    {
        path: 'admin', component: AdminLayoutComponent,
        children: [
            {path: 'dashboard', component: DashboardComponent}
        ]
    }

];
