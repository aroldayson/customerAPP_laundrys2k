import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MyServiceService } from '../my-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cus-login',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,FormsModule,CommonModule,RouterLink],
  templateUrl: './cus-login.component.html',
  styleUrl: './cus-login.component.css'
})
export class CusLoginComponent implements OnInit{
  constructor(private myserv: MyServiceService, private route: Router){}
  
  loginForm =new FormGroup({
    email: new FormControl(null),
    password: new FormControl(null),
  })
  logdata: any;
  ngOnInit(): void {  

  }
//  login(){
//   this.myserv.login(this.loginForm.value).subscribe((result:any)=>{
//     console.log(result);
//     const token = result.token;
//     console.log('Token: ', token);
//     localStorage.setItem('authToken: ', token);
//     if(token != null){
//           this.route.navigate(['/main/cusmainhome']);
//           localStorage.setItem("cust_id",result.cust_id);
//         }else{
//           console.log("ERROR login");
//         }
//       })}

  login() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.myserv.login(this.loginForm.value).subscribe(
        (result: any) => {
          if (result && result.token) {
            // Display success notification
            Swal.fire({
              icon: 'success',
              title: 'Login Successful!',
              text: 'You are now logged in.',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false
            });

            // Store the token in localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('Cust_ID', result.user.Cust_ID); 
            // Navigate to the main page
            this.route.navigate(['/main/cusmainhome/homemain/cuscurtrans']);
          } else {
            // Handle case where the result doesn't contain the token
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: 'Login was unsuccessful. Please try again.',
              showConfirmButton: true
            });
          }
          console.log(result);
        },
        (error) => {
          // Handle error response from the server (e.g., 401 Unauthorized)
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Please check your email and password.',
            showConfirmButton: true
          });

          // Log the error for debugging
          console.error('Login error:', error);
        }
      );
    } else {
      // Handle case where the form is not valid
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please fill in all required fields correctly.',
        showConfirmButton: true
      });
      console.log("Form is not valid");
    }
  }

  accout(data: any){
    localStorage.setItem('Cust_ID', data);
    this.route.navigate(['/main/mainaccount/main']);
  }
 }
