import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MyServiceService } from '../my-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cus-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, RouterOutlet],
  templateUrl: './cus-signup.component.html',
  styleUrls: ['./cus-signup.component.css']  // Corrected from 'styleUrl' to 'styleUrls'
})
export class CusSignupComponent implements OnInit {

  constructor(
    private route: Router,
    private myserv: MyServiceService
  ) { }

  // Initialize the form group with validators
  signup = new FormGroup({
    Cust_fname: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    Cust_lname: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    Cust_mname: new FormControl(null),
    Cust_address: new FormControl(null),
    Cust_phoneno: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
    Cust_email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(255)]),
    Cust_password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    Cust_password_confirmation: new FormControl(null, [Validators.required])
  }, { validators: this.passwordMatchValidator });
  
  // Custom validator to ensure password and confirmation match
  passwordMatchValidator(formGroup: any) {
    const password = formGroup.get('Cust_password')?.value;
    const confirmPassword = formGroup.get('Cust_password_confirmation')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {
    // Initialize component
  }

  // Save method
  save() {

    console.log(this.signup.value);
    if (this.signup.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please ensure all required fields are filled correctly.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Call service to add customer
    this.myserv.addcustomer(this.signup.value).subscribe(
      (result: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Customer added successfully!',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          // Redirect after success
          this.route.navigate(['/login']).then(success => {
            if (success) {
              location.reload(); // Reload page to reflect changes
            }
          });
        });
      },
      (error) => {
        console.error('Error adding customer:', error);

        // SweetAlert for error
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error?.error?.message || 'There was an issue adding the customer. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
}
