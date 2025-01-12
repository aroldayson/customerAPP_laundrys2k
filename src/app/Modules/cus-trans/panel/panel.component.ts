import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'], // Fix: Use styleUrls instead of styleUrl
})
export class PanelComponent implements OnInit {

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  cust_id = { id: localStorage.getItem('Cust_ID') };
  steps:string[] =['pending','received','washing','folding','forRelease','completed'];
  // currentStep = 0;
  transacDates: string[] = [];
  currentDate: string | null = null;
  getDet: any[] = [];
  // Transac_ID: string | null = null;
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
  payments: any;
  paymentss: any;
  Transac_ID = localStorage.getItem('trans_ID');
  lastname: any;
  firstname: any;
  middlename: any;
  email: any;
  phoneno: any;
  filteredSteps: string[] =['pending','received','washing','folding','forRelease','completed'];

  constructor(private myserv: MyServiceService) {}

  ngOnInit(): void {
    console.log('Transaction ID:', this.Transac_ID);
    console.log('HAHAHAHA')
    this.test()

    this.myserv.getcustomer(this.customer).subscribe((result: any) => {
      this.lastname = result.customerFirst.Cust_lname;
      this.firstname = result.customerFirst.Cust_fname;
      this.middlename = result.customerFirst.Cust_mname;
      this.email = result.customerFirst.Cust_email;
      this.phoneno = result.customerFirst.Cust_phoneno;
      console.log(this.customer);
    });

    if (this.Transac_ID) {
      this.myserv.getDetails(this.Transac_ID).subscribe(
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
          this.paymentss = result[0].payments      
          console.log(result,this.getDet,this.servicearray2,this.servicearray,this.paymentss)
  
          if (this.getDet.length > 0) {
            const statuses: string[] = [];
            const transacDates: string[] = [];

            const sortedTransactions = this.getDet[0].Transac_status.sort((a: any) => {
              return new Date(a.TransacStatus_datetime).getTime()
            });
  
            sortedTransactions.forEach((transac: any) => {
              const status = transac.TransacStatus_name;
              const transacDate = transac.TransacStatus_datetime;

              if (status) {
                statuses.push(status.toLowerCase());
                this.updateCurrentStep(status.toLowerCase());
              }
  
              if (transacDate) {
                transacDates.push(this.formatDateString(transacDate));
              } else {
                transacDates.push('No transaction date available');
              }
            });
  
            this.statuses = statuses;
            this.transacDates = transacDates;
  
            const latestTransactionDate = sortedTransactions.length > 0 ? sortedTransactions[0].TransacStatus_datetime : null;
  
            if (latestTransactionDate) {
              const formattedLatestDate = this.formatDateString(latestTransactionDate);
              console.log('Latest transaction date:', formattedLatestDate);
  
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

  getColor(i: number): string {
    if (i === 0) return '#FFA94D';  // Green for first step
    if (i === 1) return '#FFD84D';  // Orange for second step
    if (i === 2) return '#4FC3F7';  // Blue for third step
    if (i === 3) return '#B39DDB';  // Purple for fourth step
    if (i === 4) return '#FFEB3B';  // Blue-green for fifth step
    if (i === 5) return '#7CB342';  // Red for sixth step
    return '#4e73df';  
  }
  // updateCurrentStep(status: string): void {
  //   const stepIndex = this.steps.findIndex(step => step.toLowerCase() === status);
  //   this.tracking(stepIndex >= 0 ? stepIndex : 0);
  // }
  updateCurrentStep(status: string): void {
    const stepIndex = this.steps.findIndex(step => step.toLowerCase() === status.toLowerCase());
  
    if (stepIndex >= 0) {
      this.currentStep = stepIndex;
      this.progressPercent = (this.currentStep / (this.steps.length + 1)) * 100;
      this.checkAndShowDateForCurrentStep(stepIndex);
  
      const allSteps = ['pending','received','washing','folding','forrelease','completed']; 
  
      this.filteredSteps = this.steps.filter(step => 
        allSteps.includes(step.toLowerCase())
      );
  
      this.filteredSteps = this.filteredSteps.slice(0,stepIndex + 1);
      
      console.log('Updated current step:', this.currentStep);
      console.log('Filtered steps:', this.filteredSteps);
    } else {
      this.filteredSteps = [];
      console.log('Invalid step, no update to filtered steps');
    }
  }

  checkAndShowDateForCurrentStep(stepIndex: number): void {
    // Check if the transaction date for the current step is available
    if (this.transacDates[stepIndex]) {
      console.log('Date for current step:', this.transacDates[stepIndex]); // Debugging log
    }
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
