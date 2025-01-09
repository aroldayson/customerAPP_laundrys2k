import { Routes } from "@angular/router";
import { Component } from '@angular/core';
import { MaintransComponent } from "./maintrans/maintrans.component";
import { ViewhistoryComponent } from "./viewhistory/viewhistory.component";
import { PanelComponent } from "./panel/panel.component";
import { HistoryComponent } from "./history/history.component";
import { HistorydetailsComponent } from "./historydetails/historydetails.component";
export const Transroute: Routes = [
    {path: 'maintrans',component: MaintransComponent,
        children: [ 
            // {path:"panel",component:PanelComponent,
            //     children:[
            //         {path:"history",component:HistoryComponent},
            //         {path:"",redirectTo:"history",pathMatch:"full"},
            //         {path:"historydetails",component:HistorydetailsComponent},
            //         // {path:"",redirectTo:"historydetails",pathMatch:"full"},
            //     ]
            // },
            {path:"panel",component:PanelComponent},
            {path:"viewhistory",component:ViewhistoryComponent},
            {path:"",redirectTo:"viewhistory",pathMatch:"full"},
            {path:'maintrans',component:MaintransComponent},
            {path:"",redirectTo:"maintrans",pathMatch:"full"}

    ]

    },
    
    {path:"",redirectTo:'maintrans',pathMatch:'full'}

]