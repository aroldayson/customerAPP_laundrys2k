import { Routes } from '@angular/router';
import { CusSidenavComponent } from './cus-sidenav/cus-sidenav.component';
import { homeRoute } from './Modules/Home/home.routes';
import { accountroute } from './Modules/account/account.routes';
import { Transroute } from './Modules/cus-trans/transaction.routes';
import { CusLoginComponent } from './cus-login/cus-login.component';
import { CusSignupComponent } from './cus-signup/cus-signup.component';
import { CusLandingpageComponent } from './cus-landingpage/cus-landingpage.component';

export const routes: Routes = [
    {path:"landingpage", component:CusLandingpageComponent},
    {path:"login", component:CusLoginComponent},
    {path:"signup", component:CusSignupComponent},
    {path:"main", component: CusSidenavComponent,
        children:[
            {path:"cusmainhome",loadChildren:()=> import('./Modules/Home/home.routes').then(r=>homeRoute)},
            {path:"mainaccount",loadChildren:()=> import('./Modules/account/account.routes').then(r=>accountroute)},
            {path:"maintrans", loadChildren:()=> import('./Modules/cus-trans/transaction.routes').then(r=>Transroute)},
            {path:"",redirectTo:"cusmainhome",pathMatch:'full'},
            {path:"",redirectTo:"login",pathMatch:'full'}
        ]
    },
    // {path:"",redirectTo:"login", pathMatch:'full'}
    {path:"",redirectTo:"landingpage", pathMatch:'full'}

];

