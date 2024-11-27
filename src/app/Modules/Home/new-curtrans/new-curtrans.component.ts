import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-curtrans',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
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
  
  id = { cuid: localStorage.getItem('Cust_ID') };
  laundrylist: any[] = [];
  
  newtransac = new FormGroup({
    Tracking_number: new FormControl(null),
    Cust_ID: new FormControl(this.id.cuid),
    Transac_status: new FormControl('pending'),
    laundry: new FormControl(this.laundrylist),
  });

  constructor(
    private route: Router,
    private user: MyServiceService
  ) {}

  ngOnInit(): void {
    this.gentrack();
    this.user.displaycategory().subscribe((data: any) => {
      this.categ = data;
      console.log(this.categ);
    });
    this.user.display(this.id.cuid).subscribe((data: any) => {
      this.trans = data.transaction;
      console.log(this.trans);
    });
  }

  gentrack() {
    const randomNumber = Math.floor(Math.random() * 1000000000000) + 100000000000;
    this.trackingNumber = `S2K-${randomNumber}`;
    this.newtransac.controls['Tracking_number'].setValue(this.trackingNumber);
  }

  addToList() {
    const selectElement = document.getElementById('laundryType') as HTMLSelectElement;
    const laundryType = selectElement.value;
    const count = (document.getElementById('weight') as HTMLInputElement).value;

    if (laundryType && count) {
      const newItem = {
        Categ_ID: laundryType,
        Category: selectElement.options[selectElement.selectedIndex].text,
        Qty: count,
      };
      this.laundrylist.push(newItem);
      console.log(this.laundrylist);

      // Reset form fields
      selectElement.value = '';
      (document.getElementById('weight') as HTMLInputElement).value = '';
    }
  }

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

    // Update the laundry field in the form group with the laundrylist data
    this.newtransac.patchValue({
      laundry: this.laundrylist
    });

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

  removeFromList(item: any) {
    const index = this.laundrylist.indexOf(item);
    if (index !== -1) {
      this.laundrylist.splice(index, 1);
      console.log(this.laundrylist);
    }
  }
}
