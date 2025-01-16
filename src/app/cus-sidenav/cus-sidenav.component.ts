import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { MyServiceService } from '../my-service.service';


@Component({
  selector: 'app-cus-sidenav',
  standalone: true,
  imports: [RouterLink,RouterOutlet,RouterModule,CommonModule],
  templateUrl: './cus-sidenav.component.html',
  styleUrl: './cus-sidenav.component.css'
})
export class CusSidenavComponent {
  isOpen: boolean = true;

  constructor(
    private route: Router,
    private myserv: MyServiceService
  ){}

  toggleNav(): void {
    this.isOpen = !this.isOpen;
  }

  logout() {
    const token = localStorage.getItem('token');  // Get the token from localStorage
  
    if (token) {
      const headers = { 'Authorization': `Bearer ${token}` };  // Set the Authorization header
  
      this.myserv.logout(headers).subscribe(
        (result: any) => {
          // Clear the token and other data from localStorage
          localStorage.removeItem('token');
  
          // Display success notification
          Swal.fire({
            icon: 'success',
            title: 'Logout Successful!',
            text: 'You have been logged out.',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          });
  
          // Navigate to the login page
          this.route.navigate(['/login']);
        },
        (error: any) => {
          // Handle logout errors, such as expired or invalid tokens
          Swal.fire({
            icon: 'error',
            title: 'Logout Failed',
            text: 'There was an error logging you out. Please try again.',
            showConfirmButton: true
          });
          console.error('Logout Error:', error);
        }
      );
    } else {
      // If no token is found, immediately navigate to the login page
      Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'You are not logged in.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      this.route.navigate(['/login']);
    }
  }
  
  
}
