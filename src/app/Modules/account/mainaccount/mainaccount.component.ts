import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  fname:any;
  lname:any;
  email:any;
  address:any;

  profileform = new FormGroup({
    Cust_ID: new FormControl(this.custid.id),
    Cust_fname: new FormControl(null),
    Cust_lname: new FormControl(null),
    Cust_mname: new FormControl(null),
    Cust_email: new FormControl(null),
    Cust_phoneno: new FormControl(null,[Validators.required,Validators.pattern('^[0-9]{11}$')]),
    Cust_address: new FormControl(null),
    Cust_password: new FormControl(null),
    Cust_image: new FormControl(null) // Changed binding
  });

  ngOnInit(): void {
    console.log(this.previewUrl)
    console.log(this.custid.id);
    this.cusid = { id: localStorage.getItem('Cust_ID') };
    this.myserv.getcustomer(this.cusid.id).subscribe((data: any) => {
      console.log(data);
      this.customerData = data.customerFirst;
      this.fname = this.customerData.Cust_fname
      this.lname = this.customerData.Cust_lname
      this.email = this.customerData.Cust_email
      this.address = this.customerData.Cust_address
      console.log(this.customerData)
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
      console.log(this.customerData.Cust_image)
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

    if(this.profileform.invalid){
      Swal.fire({
        title:"Error",
        text:"Please Enter a valid Phone Number",
        icon:"error",
        confirmButtonText:"OK"
      })
    }else{
    const formData = new FormData();
    Object.keys(this.profileform.controls).forEach((key) => {
      formData.append(key, this.profileform.get(key)?.value as string);
      console.log(formData)
    });

    if (this.selectedFile) {
      formData.append('Cust_image', this.selectedFile);
    }

    console.log('Form Data:', this.profileform.value);

    this.myserv.updatecus(formData).subscribe(
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

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
        fileInput.click();
    }
  }

}


  