import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-curtrans',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule,ReactiveFormsModule],
  templateUrl: './new-curtrans.component.html',
  styleUrl: './new-curtrans.component.css'
})
export class NewCurtransComponent implements OnInit{
  
  laundrylist = this.user.post; 
  categ: any;
  trackingNumber:any;
  trans: any;
  id = {cuid: localStorage.getItem('Cust_ID')};
  trans_id: {id: string | null} = {id: localStorage.getItem('Tracking_Number')};
  selectedService: any;
  laundryList: any;

  

  ngOnInit(): void {
    this.gentrack();
    this.user.displaycategory().subscribe((data:any)=>{
      this.categ = data;
      console.log(this.categ);
    })
    this.user.display(this.id.cuid).subscribe((data:any)=>{
      this.trans = data.transaction;
      // this.fetchtransactions();
      console.log(this.trans);
    })
  }
    
  constructor(
    private route: Router,
    private user: MyServiceService
  
  ){}

  newtransac = new FormGroup({
    Tracking_number: new FormControl(null),
    Cust_ID: new FormControl("1"),
    Qty: new FormControl(this.laundrylist),
    Transac_status: new FormControl(null),
    Categ_ID: new FormControl(this.laundrylist)
  })

  gentrack() {
    const randomNumber = Math.floor(Math.random() * 1000000000000) + 100000000000;
    this.trackingNumber = `S2K-${randomNumber}`;

    this.newtransac.controls['Tracking_number'].setValue(this.trackingNumber);
  }

  addToList() {
    // Cast the select element to HTMLSelectElement
    const selectElement = document.getElementById('laundryType') as HTMLSelectElement;
    const laundryType = selectElement.value;
    const transacStatus = this.selectedService; 
  
    // Access the input element for the weight/quantity
    const count = (document.getElementById('weight') as HTMLInputElement).value;
  
    // Ensure that both laundryType and count are present
    if (laundryType && count != null) {
      const newItem = {
        Categ_ID: laundryType,
        Category: selectElement.options[selectElement.selectedIndex].text, // Access options and selectedIndex from HTMLSelectElement
        Qty: count,
        Status: transacStatus
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
    this.user.addtrans(this.newtransac.value).subscribe(
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
            // this.fetchtransactions();
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

  removeFromList(item: any) {
    const index = this.laundryList.indexOf(item);
    if (index !== -1) {
      this.laundryList.splice(index, 1);
      console.log(this.laundryList);
    }
  }
  
  

}
