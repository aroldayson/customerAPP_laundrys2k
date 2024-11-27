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
  steps = ['Ordered', 'Shipped', 'On the way', 'Delivered'];
  currentStep = 0;
  // stepDates = ['2024-11-21', '2024-11-22', '2024-11-23', '2024-11-24'];
  transacDates: string[] = [];

  currentDate: string | null = null;
  getDet: any[] = [];
  Transac_ID: string | null = null;
  transactionDate: string | null = null;
  transactionDates: string | null = null;

  statuses: any;

  constructor(private http: HttpClient, private service: MyServiceService) {}

  ngOnInit(): void {
    this.Transac_ID = localStorage.getItem('trans_ID');
    this.currentDate = this.formatDate(new Date());

    if (this.Transac_ID) {
      this.service.getDetails(this.Transac_ID).subscribe(
        (result: any) => {
          this.getDet = result || [];
    
          if (this.getDet.length > 0) {
            // Initialize arrays to store the statuses and dates
            const statuses: string[] = [];
            const transacDates: string[] = [];
    
            // Loop through all transaction statuses to capture each one and its corresponding date
            this.getDet[0].Transac_status.forEach((transac: any) => {
              const status = transac.Transac_status;
              const transacDate = transac.TransacStatus_datetime;
    
              // Store the status and date in arrays
              if (status) {
                statuses.push(status.toLowerCase());
                this.updateCurrentStep(status.toLowerCase()); // Update the current step based on the status
              }
    
              if (transacDate) {
                transacDates.push(this.formatDateString(transacDate));
              } else {
                transacDates.push('No transaction date available');
              }
            });
    
            // Now statuses and transacDates hold the arrays of status and transaction dates
            this.statuses = statuses;
            this.transacDates = transacDates;
    
            // Log the status and dates
            console.log('Statuses:', this.statuses);
            console.log('Transaction Dates:', this.transacDates);
          }
    
          console.log('Transaction Details:', this.getDet);
        },
        (error) => {
          console.error('Error fetching transaction details:', error);
        }
      );
    }
    
    

    // if (this.Transac_ID) {
    //   this.service.getDetails(this.Transac_ID).subscribe(
    //     (result: any) => {
    //       this.getDet = result || [];
    //       if (this.getDet.length > 0 && this.getDet[0].Transac_status) {
    //         const status = this.getDet[0].Transac_status.toLowerCase();
    //         this.updateCurrentStep(status);
    
    //         // Process and format the Transac_date
    //         const transacDate = this.getDet[0].Transac_date;
    //         if (transacDate) {
    //           this.transactionDate = this.formatDateString(transacDate);
    //         } else {
    //           this.transactionDate = 'No transaction date available';
    //         }
    //       }
    //       console.log('Transaction Details:', this.getDet);
    //     },
    //     (error) => {
    //       console.error('Error fetching transaction details:', error);
    //     }
    //   );
    // }
  }

  // Format transaction date string to a readable format
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

  tracking(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.currentStep = stepIndex;
    }
  }

  updateCurrentStep(status: string): void {
    const stepIndex = this.steps.findIndex(step => step.toLowerCase() === status);
    this.tracking(stepIndex >= 0 ? stepIndex : 0);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.previewImage();
    }
  }

  previewImage(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  upload(): void {
    if (this.selectedFile && this.cust_id.id) {
      const formData = new FormData();
      formData.append('Cust_image', this.selectedFile, this.selectedFile.name);

      this.http
        .post(
          `http://localhost:8000/api/upload-payment-image/${this.cust_id.id}`,
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
