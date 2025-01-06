import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [RouterModule, CommonModule,ReactiveFormsModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  cust_id = { id: localStorage.getItem('Cust_ID') };
  steps:string[] =['pending','received','washing','folding','forRelease','completed'];
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
  servicearray: any;
  servicearray2:string[] = [];
  currentStep: number = 0;  // Update this dynamically based on user progress (e.g., using a value from your logic)
  progressPercent: number = (this.currentStep / (this.steps.length - 1)) * 100; // Calculate progress percentage
  serviceArray: any;
  latestTransactionDate:any;
  total: any;
  track: any;
  transacDate: any;
  estimatedate: any;
  totalserviceprice: any;

  constructor(private http: HttpClient, private service: MyServiceService) {}

  ngOnInit(): void {
    this.Transac_ID = localStorage.getItem('trans_ID');
  
    // Fetch customer details
    this.service.getcustomer(this.customer).subscribe((result: any) => {
      this.customer = result.customerFirst.Cust_fname;
      console.log(this.customer);
    });
  
    // Format current date
    this.currentDate = this.formatDate(new Date());
  
    // Fetch transaction details if Transac_ID exists
    if (this.Transac_ID) {
      this.service.getDetails(this.Transac_ID).subscribe(
        (result: any) => {  
          const price = result[0].total;
          const serviceprice = result[0].totalserviceprice;
          this.serviceprice = serviceprice;
          this.price = price;
          this.totalprice = price + serviceprice;
          this.totalqty = result[0].totalqty;
          this.servicearray = result[0].services;
          this.servicearray2 = result[0].services[1].AddService_name;
          this.getDet = result || [];
          this.totalweight = result[0].totalweight;
          this.details = result[0].details
          this.total = result[0].total
          this.track = result[0].Tracking_number 
          this.totalserviceprice = result[0].totalserviceprice
          this.transacDate = result[0].services[0].trans_date   
          this.estimatedate = result[0].services[0].estimated_date        
          console.log(result,this.getDet,this.servicearray2,this.servicearray)
  
          // Ensure transaction details are available
          if (this.getDet.length > 0) {
            const statuses: string[] = [];
            const transacDates: string[] = [];
  
            // Sort transaction details by datetime in descending order
            const sortedTransactions = this.getDet[0].Transac_status.sort((a: any) => {
              return new Date(a.TransacStatus_datetime).getTime()
            });
  
            // Process each sorted transaction to capture all the dates and statuses
            sortedTransactions.forEach((transac: any) => {
              const status = transac.TransacStatus_name;
              const transacDate = transac.TransacStatus_datetime;
  
              // Add status and datetime to the arrays
              if (status) {
                statuses.push(status.toLowerCase()); // Ensure the status is in lowercase
                this.updateCurrentStep(status.toLowerCase()); // Update the current step automatically
              }
  
              if (transacDate) {
                // Format and push each transaction date into the array
                transacDates.push(this.formatDateString(transacDate));
              } else {
                transacDates.push('No transaction date available');
              }
            });
  
            this.statuses = statuses;
            this.transacDates = transacDates;
  
            // Get the latest (last step) transaction date from the sorted list
            const latestTransactionDate = sortedTransactions.length > 0 ? sortedTransactions[0].TransacStatus_datetime : null;
  
            // Format and display the latest date in the console
            if (latestTransactionDate) {
              const formattedLatestDate = this.formatDateString(latestTransactionDate);
              console.log('Latest transaction date:', formattedLatestDate);
  
              // Here, you can display the latest transaction date in your template or component
              this.latestTransactionDate = formattedLatestDate;
            } else {
              console.log('No transaction date available');
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
      this.progressPercent = (this.currentStep / (this.steps.length + 1)) * 100;
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
