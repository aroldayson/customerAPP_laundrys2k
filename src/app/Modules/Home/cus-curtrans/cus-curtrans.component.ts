import { CommonModule } from '@angular/common';
import { Component,ElementRef,inject,OnInit } from '@angular/core';
import { Router, RouteReuseStrategy, RouterLink } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-cus-curtrans',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './cus-curtrans.component.html',
  styleUrl: './cus-curtrans.component.css'
})
export class CusCurtransComponent implements OnInit{

  post = inject(MyServiceService);
  categ: any;
  trans: any;
  MyServiceService: any;

  selectedTransaction: any = {}; // This will hold the selected transaction details
  deletedDetails: number[] = [];  // Array to track deleted transaction details
  availableServices: any;
  
  constructor(
    private route: Router,
    private user: MyServiceService
  
  ){}

  list: any;
  Tracking_Number:any;
  customerdata:any
  id = {cuid: localStorage.getItem('Cust_ID')};
  trans_id: {id: string | null} = {id: localStorage.getItem('Tracking_Number')};

  
  category:any;
  qty:any;

  laundrylist = this.post.post; 

  newtransac = new FormGroup({
    Tracking_number: new FormControl(null),
    Cust_ID: new FormControl("1"),
    Qty: new FormControl(this.laundrylist),
    Transac_status: new FormControl(null),
    Categ_ID: new FormControl(this.laundrylist)
  })
  
  // addToList() {
  //   const laundryType = (document.getElementById('laundryType') as HTMLInputElement).value;
  //   const count = (document.getElementById('weight') as HTMLInputElement).value;
  //   if(laundryType && count != null){
  //     const newItem = {
  //       Categ_ID: laundryType,
  //       Qty: count,
  //     };
  //     this.laundrylist.push(newItem);
  //     console.log(this.laundrylist);

  //     const laundryTypes = (document.getElementById('laundryType') as HTMLInputElement);
  //     laundryTypes.value = '';

  //     const counts = (document.getElementById('weight') as HTMLInputElement);
  //     counts.value = '';
  //   }
  // }

  addToList() {
    // Cast the select element to HTMLSelectElement
    const selectElement = document.getElementById('laundryType') as HTMLSelectElement;
    const laundryType = selectElement.value;
  
    // Access the input element for the weight/quantity
    const count = (document.getElementById('weight') as HTMLInputElement).value;
  
    // Ensure that both laundryType and count are present
    if (laundryType && count != null) {
      const newItem = {
        Categ_ID: laundryType,
        Category: selectElement.options[selectElement.selectedIndex].text, // Access options and selectedIndex from HTMLSelectElement
        Qty: count,
      };
  
      this.laundrylist.push(newItem);
      // if(this.laundrylist){
      //   this.laundrylist = [''];
      // }
      console.log('asd', this.laundrylist)
      // 
      
      
      console.log(this.laundrylist);
  
      // Reset the dropdown and input field values
      selectElement.value = '';
      (document.getElementById('weight') as HTMLInputElement).value = '';
    }
  }
  fetchtransactions(){
    this.post.display(this.id.cuid).subscribe((data:any)=>{
      this.trans = data.transaction;
      if(this.trans && this.trans.length > 0){
        const pendingTransactions = this.trans.filter((transs: any) => transs.trans_stat === 'Shipped' || transs.trans_stat === 'Ordered' || transs.trans_stat === 'rush' || transs.trans_stat === 'pick' || transs.trans_stat === 'delivered' || transs.trans_stat === 'On the way' || transs.trans_stat === 'pending');

        if(pendingTransactions.length > 0){
          console.log('Pending Trans', pendingTransactions);
          this.trans = pendingTransactions;
        } else {
          console.log( "no pending")
          this.trans = [];
        }
      }
      console.log(this.trans);
    })
  }
  ngOnInit(): void{
    // this.fetchransactions();
    console.log(this.id)

    // this.post.displaytransaction().subscribe((data:any)=>{
    //   this.customerdata = data.transactions;
    //   console.log(this.customerdata);
    // })

    this.post.displaycategory().subscribe((data:any)=>{
      this.categ = data;
      console.log(this.categ);
    })
    this.post.display(this.id.cuid).subscribe((data:any)=>{
      this.trans = data.transaction;
      this.fetchtransactions();
      console.log(this.trans);
    })
  }

  gentrack(){
   const randomNumber = Math.floor(Math.random() * 1000000000000) + 100000000000;
   this.Tracking_Number = `S2K-${randomNumber}`;

   this.newtransac.controls['Tracking_number'].setValue(this.Tracking_Number);
   this.route.navigate(["/main/cusmainhome/homemain/newcurtrans"])
  }
  updateTransaction() {
    if (this.selectedTransaction && this.selectedTransaction.details) {
      const updates: any[] = [];
      const newEntries: any[] = [];

      const transacStatus = this.selectedTransaction.Transac_status || 'Pending';

      // Prepare data for updates, new additions, and deletions
      this.selectedTransaction.details.forEach((detail: any) => {
        if (detail.TransacDet_ID) {
          updates.push({
            TransacDet_ID: detail.TransacDet_ID,
            Categ_ID: detail.Categ_ID,
            Qty: detail.Qty,
            Transac_status: transacStatus
          });
        } else {
          newEntries.push({
            Categ_ID: detail.Categ_ID,
            Qty: detail.Qty,
            Tracking_Number: this.selectedTransaction.track_num
          });
        }
      });

      console.log('Updates:', updates);
      console.log('New Entries:', newEntries);
      console.log('Deleted Entries:', this.deletedDetails);

      // Send updates to the server
      if (updates.length > 0) {
        this.post.updatetransac({ updates }).subscribe((result: any) => {
          console.log('Update result:', result);
          this.fetchtransactions();
          this.closeModal();
        });
      }

      // Send new entries to the server
      if (newEntries.length > 0) {
        this.post.insertNewDetails(newEntries).subscribe((result: any) => {
          console.log('Insert result:', result);
          this.fetchtransactions();
          this.closeModal();
        });
      }

      // Send deleted entries to the server
      if (this.deletedDetails.length > 0) {
        this.post.deleteDetails(this.deletedDetails).subscribe((result: any) => {
          console.log('Deleted result:', result);
          this.fetchtransactions();
          this.closeModal();
        });
      }

      // Update the transaction status in the transactions table
      if (this.selectedTransaction.Tracking_number) {
        this.post.updateTransactionStatus(this.selectedTransaction.Tracking_number, transacStatus).subscribe((result: any) => {
          console.log('Transaction status updated:', result);
        });
      }
    }
  }

  showDetails(Tracking_number: any, transaction: any) {
    // First, set selectedTransaction based on the passed transaction
    this.selectedTransaction = { ...transaction }; // Create a copy of the transaction
    console.log('Selected transaction:', this.selectedTransaction);

    // Then, fetch the details and add them to the selected transaction
    this.post.displayDet(Tracking_number).subscribe((res: any) => {
      this.selectedTransaction.details = res; // Assign details separately
      console.log('Transaction details:', this.selectedTransaction.details);

      // Now open the modal
      const modalElement = document.getElementById('updateModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    });
  }

  // Method to remove a detail
  removeDetail(index: number) {
    const detail = this.selectedTransaction.details[index];
    if (detail.TransacDet_ID) {
      // Track the detail for deletion if it exists in the database
      this.deletedDetails.push(detail.TransacDet_ID);
    }
    // Remove it from the details array
    this.selectedTransaction.details.splice(index, 1);
  }

  // Method to close the modal
  closeModal() {
    const modalElement = document.getElementById('updateModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else {
        const newModal = new bootstrap.Modal(modalElement);
        newModal.hide();
      }
    } else {
      console.error('Modal element not found!');
    }
  }

  // Method to add a new detail row
  addDetail() {
    if (!this.selectedTransaction.details) {
      this.selectedTransaction.details = [];
    }
    this.selectedTransaction.details.push({
      Categ_ID: null, // Default or null category
      Qty: 1, // Default quantity
    });
  }

  // Optionally, add method to clear deletedDetails after saving
  resetDeletedDetails() {
    this.deletedDetails = [];
  }


  removeFromList(item: any) {
    const index = this.laundrylist.indexOf(item);
    if (index !== -1) {
      this.laundrylist.splice(index, 1);
      console.log(this.laundrylist);
    }
  }

  viewItem(data: any) {
    // Implement logic to view details of the item based on tracking number
    console.log(data);
    localStorage.setItem('trans_ID', data)
    this.route.navigate(['/main/cusmainhome/homemain/history/payment']);
  }
  cancelItem(id: any){
    console.log(id);
    // if (this.newtransac.valid) {
      // const updatedData = { id: this.trans_id.id, ...this.newtransac.value };
      this.user.updatetrans(id).subscribe(
        (response: any) => {
          // location.reload();
          console.log('Update successful', response);
          Swal.fire('Success!', 'Laundry Category Price details dalete successfully.', 'success').then(() => {
            // location.reload(); 
            this.fetchtransactions();
          });
          this.route.navigate(['/main/cusmainhome/homemain/cuscurtrans']);
        },
        error => {
          console.error('Update failed', error);
          Swal.fire('Error!', 'There was an error updating the category.', 'error');
        }
      );
    // } else {
    //   Swal.fire('Warning!', 'Please fill in all required fields.', 'warning');
    // }
    
  }
  insert() {
    // Ensure the form data is properly patched before making the API call
    const categories = this.laundrylist.map(item => item.Categ_ID);
    const quantities = this.laundrylist.map(item => item.Qty);
  
    // Check if there are any items in the list
    if (categories.length === 0 || quantities.length === 0) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Please add at least one item to the list before saving!",
        showConfirmButton: true,
      });
      return;
    }
  
    // Patch the form data
    this.newtransac.patchValue({
      Categ_ID: categories,
      Qty: quantities,
    });
  
    // Log the patched value to verify
    console.log("Patched Transaction Data:", this.newtransac.value);
  
    // Debugging: Validate the data before making the API call
    if (!this.newtransac.value.Tracking_number || !this.newtransac.value.Cust_ID) {
      console.error('Missing required fields:', this.newtransac.value);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Missing required fields! Please check the form data.",
        showConfirmButton: true,
      });
      return;
    }
  
    // Make the API call with validated data
    this.post.addtrans(this.newtransac.value).subscribe(
      (result: any) => {
        // Check if the response is successful
        if (result && result.message === 'Transaction details added successfully') {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Transaction details added successfully!",
            showConfirmButton: true,
          }).then(() => {
            // Redirect to the desired route after success
            this.route.navigate(['/main/cusmainhome/homemain/cuscurtrans']);
            this.fetchtransactions();
          });
        } else {
          console.error('Unexpected response:', result);
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error occurred during saving: " + (result.message || 'Unknown error'),
            showConfirmButton: true,
          });
        }
      },
      (error) => {
        // Log the error to see the exact issue
        console.error('API Error:', error);
  
        // Show detailed error message in the alert
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "An error occurred while saving. Please try again.",
          text: error.message || 'No additional error details provided by the server',
          showConfirmButton: true,
        });
      }
    );
    
  }
  
  
}
