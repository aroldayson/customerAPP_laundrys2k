import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mainaccount',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './mainaccount.component.html',
  styleUrls: ['./mainaccount.component.css'] // Corrected property name
})
export class MainaccountComponent implements OnInit {
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  cusid: any;
  showPassword: boolean = false;

  constructor(private myserv: MyServiceService) {}

  custid = { id: localStorage.getItem('Cust_ID') };
  customerData: any;
  temp: any;

  profileform = new FormGroup({
    Cust_ID: new FormControl(this.custid.id),
    Cust_fname: new FormControl(null),
    Cust_lname: new FormControl(null),
    Cust_mname: new FormControl(null),
    Cust_email: new FormControl(null),
    Cust_phoneno: new FormControl(null),
    Cust_address: new FormControl(null),
    Cust_password: new FormControl(null),
    Cust_image: new FormControl(null) // Changed binding
  });

  ngOnInit(): void {
    console.log(this.custid.id);
    this.cusid = { id: localStorage.getItem('Cust_ID') };
    this.myserv.getcustomer(this.cusid.id).subscribe((data: any) => {
      console.log(data);
      this.customerData = data.customerFirst;
      this.profileform.patchValue({
        Cust_ID: this.customerData.Cust_ID,
        Cust_fname: this.customerData.Cust_fname,
        Cust_lname: this.customerData.Cust_lname,
        Cust_mname: this.customerData.Cust_mname,
        Cust_email: this.customerData.Cust_email,
        Cust_phoneno: this.customerData.Cust_phoneno,
        Cust_address: this.customerData.Cust_address,
        Cust_password: this.customerData.Cust_password,
        Cust_image: this.customerData.Cust_image
      });
      this.loadExistingImage();
      console.log(this.customerData);
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  onFileSelected(event: any){
    const file = (event.target as HTMLInputElement).files![0];
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () =>{
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);


    // this.selectedFile = event.target.files[0] as File;
    // this.previewimage();
  }

  // onFileSelected(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedFile = file;
  //     this.profileform.patchValue({ Cust_image: file });

  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.previewUrl = reader.result;
  //       localStorage.setItem('previewImage', this.previewUrl as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  loadExistingImage(): void {
    const storedImage = localStorage.getItem('previewImage');
    if (storedImage) {
      this.previewUrl = storedImage;
    }
  }

  save(): void {
    const formData = new FormData();
    Object.keys(this.profileform.controls).forEach((key) => {
      formData.append(key, this.profileform.get(key)?.value as string);
    });

    if (this.selectedFile) {
      formData.append('Cust_image', this.selectedFile);
    }

    console.log('Form Data:', this.profileform.value);

    this.myserv.updateuser(formData).subscribe(
      (result: any) => {
        this.temp = result;

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your profile has been updated successfully.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'There was an issue updating your profile. Please try again.',
          confirmButtonText: 'OK'
        });
        console.error('Error updating profile:', error);
      }
    );
  }
}


  