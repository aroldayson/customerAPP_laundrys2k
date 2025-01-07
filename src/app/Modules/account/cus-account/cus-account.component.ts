import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cus-account',
  standalone: true,
  imports: [],
  templateUrl: './cus-account.component.html',
  styleUrl: './cus-account.component.css'
})
export class CusAccountComponent implements OnInit{
  showConfirmPassword: boolean = false;
  showNewPassword: boolean = false;
  showCurrentPassword: boolean = false;
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  togglePasswordVisibility(data: any){

  }

}
