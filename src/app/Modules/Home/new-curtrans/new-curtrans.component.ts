import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-curtrans',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-curtrans.component.html',
  styleUrls: ['./new-curtrans.component.css']
})
export class NewCurtransComponent implements OnInit {
  private post = inject(MyServiceService);
  categ: any;
  trans: any;
  trackingNumber: any;
  customerdata: any;
  laundry: any;
  selectedServices: string[] = [];  // Array to track selected services
  
  id = { cuid: localStorage.getItem('Cust_ID') };
  laundrylist: any[] = [];

  newtransac = new FormGroup({
    Tracking_number: new FormControl(null),
    Cust_ID: new FormControl(this.id.cuid),
    Transac_status: new FormControl('pending'),
    laundry: new FormControl(this.laundrylist),
    service: new FormControl<string[]>([]) // This is an array of selected services
  });
  



  constructor(
    private route: Router,
    private user: MyServiceService
  ) {}

  ngOnInit(): void {
    this.gentrack();
    console.log(this.selectedServices);

    const serviceControl = this.newtransac.get('service') as FormControl;
    console.log(serviceControl)
    if (serviceControl) {
      serviceControl.valueChanges.subscribe((selectedServices: string[]) => {
        this.selectedServices = selectedServices;  // Update with an array of selected services
        console.log('Selected Services:', this.selectedServices);  // Log the selected services array
      });
    }
  

    // Fetch categories and transactions from the service
    this.user.displaycategory().subscribe((data: any) => {
      this.categ = data;
      console.log(this.categ);
    });

    this.user.display(this.id.cuid).subscribe((data: any) => {
      this.trans = data.transaction;
      console.log(this.trans);
    });
  }

  // Method to generate tracking number
  gentrack() {
    this.post.getTrackingNo().subscribe((data: any) => {
      this.trackingNumber = data;
      console.log(data);
    });
  }

  // Add items to the laundry list
  addToList() {
    const selectElement = document.getElementById('laundryType') as HTMLSelectElement;
    const laundryType = selectElement.value;
    const count = (document.getElementById('weight') as HTMLInputElement).value;
    console.log(this.trackingNumber);

    if (laundryType && count) {
      const newItem = {
        Categ_ID: laundryType,
        Category: selectElement.options[selectElement.selectedIndex].text,
        Qty: count,
        Tracking_number: this.trackingNumber
      };
      this.laundrylist.push(newItem);
      console.log(this.laundrylist);

      // Reset form fields
      selectElement.value = '';
      (document.getElementById('weight') as HTMLInputElement).value = '';
    }
  }

  // Insert the transaction data into the database
  insert() {
    if (this.laundrylist.length === 0) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Please add at least one item to the list before saving!",
        showConfirmButton: true,
      });
      return;
    }

    // Update the laundry and service fields in the form group
    this.newtransac.patchValue({
      Tracking_number: this.trackingNumber,
      laundry: this.laundrylist,
      service: this.selectedServices.length > 0 ? this.selectedServices : ['none'],  // Set to 'none' if no service is selected
    });

    console.log(this.newtransac);

    // Call the API to insert transaction data
    this.post.addtrans(this.newtransac.value).subscribe(
      (result: any) => {
        console.log(result);
        if (result && result.Transaction) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Transaction details added successfully!",
            showConfirmButton: true,
          }).then(() => {
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
        console.error('API Error:', error);
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

  // Fetch transactions from the backend
  fetchtransactions() {
    this.post.display(this.id.cuid).subscribe((data: any) => {
      this.trans = data.transaction;
      if (this.trans && this.trans.length > 0) {
        this.trans = this.trans.filter((transs: any) =>
          ['handWash', 'press', 'rush', 'pick', 'deliver', 'paid'].includes(transs.trans_stat)
        );
      }
    });
  }

  onCheckboxChange(event: any) {
    const serviceArray = this.newtransac.get('service') as FormControl<string[]>;
  
    // Get current selected services array
    let selectedServices: string[] = serviceArray.value;
  
    if (event.target.checked) {
      // Add the selected service to the array if it is checked
      selectedServices.push(event.target.value);
    } else {
      // Remove the selected service from the array if it is unchecked
      selectedServices = selectedServices.filter((service) => service !== event.target.value);
    }
  
    // Update the FormControl value
    serviceArray.setValue(selectedServices);
    console.log('Updated selected services:', selectedServices);
  }

  // Remove an item from the laundry list
  removeFromList(item: any) {
    const index = this.laundrylist.indexOf(item);
    if (index !== -1) {
      this.laundrylist.splice(index, 1);
      console.log(this.laundrylist);
    }
  }
}
