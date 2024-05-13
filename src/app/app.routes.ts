import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { FrontDeskComponent } from './components/front-desk/front-desk.component';
import { FrontDestPatientConfirmationComponent } from './components/front-dest-patient-confirmation/front-dest-patient-confirmation.component';

export const routes: Routes = [{
    path:'', component:LoginComponent
},{
    path:'dashboard/admin', component: AdminDashboardComponent
}, {
    path:'frontdesk', component: FrontDeskComponent,
},
    {
        path:'frontdesk/appointment-confirmation', component: FrontDestPatientConfirmationComponent
    }
];
