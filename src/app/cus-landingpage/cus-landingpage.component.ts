import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface LaundryItem {
  Category: string;
  Qty: number;
  Price: number;
}

@Component({
  selector: 'app-cus-landingpage',
  standalone: true,
  imports: [
    RouterLink,
    RouterModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './cus-landingpage.component.html',
  styleUrl: './cus-landingpage.component.css'
})
export class CusLandingpageComponent implements OnInit {
  newtransac: FormGroup;
  categ: any[] = []; // Will store laundry categories
  selectedPrice: number | undefined;
  laundrylist: LaundryItem[] = [];

  constructor(private fb: FormBuilder) {
    this.newtransac = this.fb.group({
      Category: [''],
      Qty: [1],
    });
  }

  ngOnInit() {
    // Mock categories - replace with API call
    this.categ = [
      { Categ_ID: 1, Category: 'Regular Wash', Price: 50 },
      { Categ_ID: 2, Category: 'Dry Clean', Price: 75 },
      { Categ_ID: 3, Category: 'Blanket', Price: 100 }
    ];
  }

  getLaundryPrice(event: any) {
    const selectedCategId = event.target.value;
    const selectedCategory = this.categ.find(c => c.Categ_ID === +selectedCategId);
    this.selectedPrice = selectedCategory?.Price;
  }

  addToList() {
    if (this.newtransac.valid && this.selectedPrice) {
      const selectedCateg = this.categ.find(c => c.Categ_ID === +this.newtransac.value.Category);
      
      if (selectedCateg) {
        const newItem: LaundryItem = {
          Category: selectedCateg.Category,
          Qty: this.newtransac.value.Qty,
          Price: this.selectedPrice * this.newtransac.value.Qty
        };
        
        this.laundrylist.push(newItem);
        this.newtransac.reset({ Category: '', Qty: 1 });
        this.selectedPrice = undefined;
      }
    }
  }

  removeFromList(item: LaundryItem) {
    const index = this.laundrylist.indexOf(item);
    if (index > -1) {
      this.laundrylist.splice(index, 1);
    }
  }

  isNextStepDisabled(): boolean {
    return this.laundrylist.length === 0;
  }
}
