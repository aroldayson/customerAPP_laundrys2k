import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  selectedFile: File | null = null;

  imagePreview: any;
  // modeOfPayment: any;
  // paymentAmount: any;

  cust_id: any = {id:localStorage.getItem('Cust_ID')};
  trackingNumber = {id:localStorage.getItem('temp_ID')};

  uploadform: any;

  constructor(private http: HttpClient, private route: Router){
    this.uploadform = new FormGroup({
      Mode_of_Payment: new FormControl(null),
      Amount: new FormControl(null),
    })
  }

  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    this.previewImage();
  }

  previewImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Update image preview with selected file
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveform(){
    console.log(this.uploadform.value)
  }
  upload(){
    console.log(this.trackingNumber.id);
    console.log(this.uploadform.value)
    if (this.selectedFile) {
      const formData = new FormData();

      formData.append('Mode_of_Payment', this.uploadform.get('Mode_of_Payment').value);
      formData.append('Amount', this.uploadform.get('Amount').value);
      formData.append('Proof_filename', this.selectedFile, this.selectedFile.name);
      formData.append('Cust_ID',this.cust_id.id);
    
      this.http.post(`http://10.0.118.71:8000/api/upload/${this.trackingNumber.id}`, formData)
        .subscribe(
          (response: any) => {
            Swal.fire({
              title: 'Success!',
              text: 'Image uploaded successfully',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.route.navigate(["/main/cusmainhome/homemain/cuscurtrans"]);
            });
          },
          (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: 'Error uploading image',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            console.error('Error', error);
          }
        );
    } else {
      Swal.fire({
        title: 'Warning!',
        text: 'Please select an image first',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
    
  }
  
  ngOnInit(): void {
    
    
  }

}
