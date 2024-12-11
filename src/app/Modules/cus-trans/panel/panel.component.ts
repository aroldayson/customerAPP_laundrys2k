import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'], // Fix: Use styleUrls instead of styleUrl
})
export class PanelComponent implements OnInit {

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  cust_id = { id: localStorage.getItem('Cust_ID') };
  steps = ['Pending', 'Shipped', 'On the way', 'Delivered'];
  currentStep = 0;
  // stepDates = ['2024-11-21', '2024-11-22', '2024-11-23', '2024-11-24'];
  transacDates: string[] = [];

  currentDate: string | null = null;
  getDet: any[] = [];
  Transac_ID = localStorage.getItem('trans_ID');
  transactionDate: string | null = null;
  transactionDates: string | null = null;
  statuses: any;
  // currentDate: string | null = null;
  // getDet: any[] = [];
  // Transac_ID: string | null = null;
  // track: string | null = null;
  // detget: any;

  // steps = ['Ordered', 'Shipped', 'On the way', 'Delivered'];
  // currentStep = 0;

  constructor(private myserv: MyServiceService) {}

  ngOnInit(): void {
    console.log('Transaction ID:', this.Transac_ID);
    console.log('HAHAHAHA')
    this.test()
  }




  test(){
    this.currentDate = this.formatDate(new Date());
    console.log(this.Transac_ID)
    if (this.Transac_ID) {
      this.myserv.getDetails(this.Transac_ID).subscribe((result: any) => {
          console.log(result)
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
  }

  updateCurrentStep(status: string): void {
    const stepIndex = this.steps.findIndex(step => step.toLowerCase() === status);
    this.tracking(stepIndex >= 0 ? stepIndex : 0);
  }


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
      console.log("Current step updated:", this.currentStep); // Add a console log to check if currentStep is updated correctly
    }
  }

  trackByTransacDet(index: number, item: any): string {
    return item.Transac_det || index; // Use unique identifier
  }

  trackByDetID(index: number, item: any): string {
    return item.TransacDet_ID || index; // Use unique identifier
  }
}
