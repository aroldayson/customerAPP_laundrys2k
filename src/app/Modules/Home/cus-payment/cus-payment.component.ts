import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MyServiceService } from '../../../my-service.service';

@Component({
  selector: 'app-cus-payment',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './cus-payment.component.html',
  styleUrls: ['./cus-payment.component.css']
})
export class CusPaymentComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  payment:any;
  serviceprice:any;
  paymentexists:boolean = false;
  price_exists:boolean = false;
  transactiondetails: any[] = [];

  cust_id = localStorage.getItem('Cust_ID');
  trackingNumber = localStorage.getItem('trans_ID');

  constructor(private http: HttpClient, private router: Router,private post: MyServiceService) {
    this.uploadForm = new FormGroup({
      Mode_of_Payment: new FormControl(null, [Validators.required]),
      Amount: new FormControl(null, [Validators.required, Validators.min(1)]),
      uploadpic:new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.post.getDetails(this.trackingNumber).subscribe((result:any)=>{
      const total = result[0].total;
      const totalservice = result[0].totalserviceprice
      this.serviceprice = totalservice
      this.payment = total + totalservice
      console.log(this.payment)

      this.uploadForm.patchValue({
        Amount: this.payment
      });
    })

    this.post.checkPaymentExists(this.trackingNumber).subscribe((paymentResult: any) => {
      // First, check if the payment exists
      if (paymentResult.exists) {
        console.log(paymentResult);
        console.log("Payment already made.");
        this.paymentexists = true;
        // Disable form controls if payment exists
        this.uploadForm.get('Mode_of_Payment')?.disable();
        this.uploadForm.get('Amount')?.disable();
        this.uploadForm.get('uploadpic')?.disable();
      } else {
        console.log("Payment not made.");
        this.paymentexists = false;
        // Enable form controls if payment doesn't exist
        this.uploadForm.get('Mode_of_Payment')?.enable();
        this.uploadForm.get('Amount')?.enable();
        this.uploadForm.get('uploadpic')?.enable();
      }
      
      // Now check for the price existence after checking payment
      this.post.checkPriceExists(this.trackingNumber).subscribe((priceResult: any) => {
        console.log(priceResult);
        const pricecheck = priceResult.Price;
        console.log(pricecheck);
    
        // If price exists and payment has not been made, enable the form
        if (priceResult.exists && priceResult.Price !== null && !this.paymentexists) {
          this.price_exists = true;
          console.log("Price exists and payment has not been made.");
          this.uploadForm.get('Mode_of_Payment')?.enable();
          this.uploadForm.get('Amount')?.enable();
          this.uploadForm.get('uploadpic')?.enable();
        } 
        
        // If price does not exist or is null, disable the form
        else if (!priceResult.exists || priceResult.Price === null) {
          this.price_exists = false;
          console.log("Price does not exist or is null.");
          this.uploadForm.get('Mode_of_Payment')?.disable();
          this.uploadForm.get('Amount')?.disable();
          this.uploadForm.get('uploadpic')?.disable();
        } 
        
        // If both price and payment exist, disable the form
        else if (this.paymentexists && priceResult.exists && priceResult.Price !== null) {
          this.price_exists = true;
          console.log("Price exists, but payment already made.");
          this.uploadForm.get('Mode_of_Payment')?.disable();
          this.uploadForm.get('Amount')?.disable();
          this.uploadForm.get('uploadpic')?.disable();
        }
        
        // If price exists but payment has not been made, enable the form
        else if (priceResult.exists && !this.paymentexists) {
          this.price_exists = true;
          console.log("Price exists, but payment has not been made.");
          this.uploadForm.get('Mode_of_Payment')?.enable();
          this.uploadForm.get('Amount')?.enable();
          this.uploadForm.get('uploadpic')?.enable();
        }
        console.log(priceResult)
      });

    
    });
    


  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log(this.selectedFile)
  
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: 'Error!',
          text: 'Please select a valid image file (jpeg, png, jpg).',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.selectedFile = null;
        return;
      }
  
      // Preview the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  upload(): void {
    if (!this.cust_id) {
      Swal.fire({
        title: 'Error!',
        text: 'Customer ID is missing. Please log in again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    if (this.uploadForm.invalid || !this.selectedFile || !this.trackingNumber) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill out all fields and select a file.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('Mode_of_Payment', this.uploadForm.get('Mode_of_Payment')?.value);
    formData.append('Amount', this.uploadForm.get('Amount')?.value);
    formData.append('Proof_filename', this.selectedFile, this.selectedFile.name); // Use backend's expected field name
    formData.append('Cust_ID', this.cust_id || '');
  
    this.http.post(`http://192.168.3.85:8000/api/upload/${this.trackingNumber}`, formData)

    // .subscribe((result:any)=>{

    //   console.log(formData);
    //   console.log(result);
    // })
      .subscribe({
        next: (response) => {
          //  console.log(response)
          Swal.fire({
            title: 'Success!',
            text: 'Payment uploaded successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/main/cusmainhome/homemain/cuscurtrans']);
          });
        },
        error: (error) => {
          // console.log(error)
          Swal.fire({
            title: 'Error!',
            text: 'Error uploading the payment. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          console.error('Upload failed:', error);
        }
      });
  }
}  



