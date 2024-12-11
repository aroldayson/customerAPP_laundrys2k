import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  cust_id = { id: localStorage.getItem('Cust_ID') };
  steps:string[] =['pending','received','washing','folding','forRelease','released'];
  // currentStep = 0;
  transacDates: string[] = [];
  currentDate: string | null = null;
  getDet: any[] = [];
  Transac_ID: string | null = null;
  statuses: string[] = [];
  details: any;
  customer = localStorage.getItem('Cust_ID');
  price:any;
  totalprice:any;
  totalweight:any;
  totalqty:any;
  servicename:any;
  serviceprice:any;
  servicearray: string[] = [];
  currentStep: number = 0;  // Update this dynamically based on user progress (e.g., using a value from your logic)
  progressPercent: number = (this.currentStep / (this.steps.length - 1)) * 100; // Calculate progress percentage

  constructor(private http: HttpClient, private service: MyServiceService) {}

  ngOnInit(): void {
    this.Transac_ID = localStorage.getItem('trans_ID');

    this.service.getcustomer(this.customer).subscribe((result:any)=>{
      console.log(result)
      this.customer = result.customerFirst.Cust_fname;
      console.log(this.customer)
    })

    // Format current date
    this.currentDate = this.formatDate(new Date());

    if (this.Transac_ID) {
      this.service.getDetails(this.Transac_ID).subscribe(
        (result: any) => {  
          const price = result[0].total;
          const serviceprice = result[0].totalserviceprice
          this.serviceprice = serviceprice
          this.price = price;
          this.totalprice = price + serviceprice
          this.totalqty = result[0].totalqty;
          this.servicearray = result[0].services;   
          this.getDet = result || [];
          this.totalweight = result[0].totalweight
          console.log(this.totalweight)
          console.log(this.servicearray)
          console.log(result) 

          if (this.getDet.length > 0) {
            const statuses: string[] = [];
            const transacDates: string[] = [];

            // Process transaction status and date
            this.getDet[0].Transac_status.forEach((transac: any) => {
              console.log(transac);
              const status = transac.TransacStatus_name;
              const transacDate = transac.TransacStatus_datetime;

              if (status) {
                statuses.push(status.toLowerCase()); // Ensure the status is in lowercase
                this.updateCurrentStep(status.toLowerCase()); // Update the current step automatically
                console.log(status);
              }

              if (transacDate) {
                transacDates.push(this.formatDateString(transacDate));
              } else {
                transacDates.push('No transaction date available');
              }
            });

            this.statuses = statuses;
            this.transacDates = transacDates;
            console.log(this.transacDates);

            // Log the statuses and dates for debugging
            console.log('Statuses:', this.statuses);
            console.log('Transaction Dates:', this.transacDates);

            // Access the details array if it exists
            if (this.getDet[0].details && this.getDet[0].details.length > 0) {
              this.details = this.getDet[0].details;
              console.log('Transaction Details:', this.details);
            } else {
              console.log('No details available.');
            }
          }
        },
        (error) => {
          console.error('Error fetching transaction details:', error);
        }
      );
    }
  }

  // Update the current step based on status
  updateCurrentStep(status: string): void {
    const stepIndex = this.steps.findIndex(step => step.toLowerCase() === status.toLowerCase());
    if (stepIndex >= 0) {
      this.currentStep = stepIndex;
      this.progressPercent = (this.currentStep / (this.steps.length - 1)) * 100;
      this.currentStep = stepIndex; // Update the current step when status matches
      this.checkAndShowDateForCurrentStep(stepIndex); // Ensure the current step date is updated
    }
    console.log('Updated current step:', this.currentStep); // Optional: Debugging log
  }

  // Ensure current step's transaction date is available
  checkAndShowDateForCurrentStep(stepIndex: number): void {
    // Check if the transaction date for the current step is available
    if (this.transacDates[stepIndex]) {
      console.log('Date for current step:', this.transacDates[stepIndex]); // Debugging log
    }
  }

  // Format the transaction date string to a readable format
  formatDateString(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }

  // Format the current date to a string
  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }

  // Handle click on a specific step
  tracking(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.currentStep = stepIndex; // Update the current step
    }
  }

  // Handle file selection and image preview
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.previewImage();
    }
  }

  // Preview selected image
  previewImage(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Upload the selected file
  upload(): void {
    if (this.selectedFile && this.cust_id.id) {
      const formData = new FormData();
      formData.append('Cust_image', this.selectedFile, this.selectedFile.name);

      this.http
        .post(
          `http://10.0.118.62:8000/api/upload/${this.cust_id.id}`,
          formData
        )
        .subscribe(
          () => {
            console.log('Image uploaded successfully');
          },
          (error) => {
            console.error('Error uploading image:', error);
          }
        );
    } else {
      console.error('No file selected or customer ID missing.');
    }
  }
}
