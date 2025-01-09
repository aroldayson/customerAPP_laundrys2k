import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-cus-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cus-category.component.html',
  styleUrl: './cus-category.component.css'
})
export class CusCategoryComponent implements OnInit {
  private post = inject(MyServiceService);
  categ: any[] = [];
  trans: any;
  trackingNumber: any;
  customerdata: any;
  laundry: any;
  selectedServices: string[] = [];  
  l_price: number = 0;
  l_min_weight: number = 0;
  total_estimated_price: any ;
  townAddresses: any[] = [];
  selectedTownID: string = '';
  townAddress: string = '';
  sison: boolean = false;
  poz: boolean = false;
  rosario: boolean = false;
  pugo: boolean = false;
  selectBar: boolean = false;
  selectAddPick: boolean = false;
  selectAddDel: boolean = false;
  selectedPrice: number = 0;
  showmodaladdress: boolean = false;
  Town_City: any;

  deliveryTown: string = '';
  deliveryBarangay: string = '';
  deliveryStreet: string = '';

  pickupTown: string = '';
  pickupBarangay: string = '';
  pickupStreet: string = '';

  showservices: boolean = false;

  address: any[] = [];

  selectedCity: string | null = null;
  custname: string = '';
  selectedDeliveryAddressId: string | null = null;
  selectedPickupAddressId: string | null = null;
  
  selectedAddress: number | null = null;
  totalEstimatedPrice: number = 0;

  isRushJob: boolean = false;
  isPickUpService: boolean = false;
  isDeliveryService: boolean = false;

  id = { cuid: localStorage.getItem('Cust_ID') };
  testid = localStorage.getItem('Cust_ID');
  laundrylist: any[] = [];

  showShippingAddress: boolean = false;

  editingItem: any = null;

  inputElement: HTMLInputElement | null = null;

  discount: number = 0;
  shippingCharge: number = 0;
  shippingCost: number = 0;

  addressupdate: any;



  barangaysInSison: string[] = [
    "Amagbagan", "Artacho", "Asan Norte", "Asan Sur", "Bantay Insik", 
    "Bila", "Binmeckeg", "Bulaoen East", "Bulaoen West", "Cabaritan",
    "Calunetan", "Camangaan", "Cauringan", "Dungon", "Esperanza",
    "Inmalog", "Killo", "Labayug", "Paldit", "Pindangan",
    "Pinmilapil", "Poblacion Central", "Poblacion Norte"
  ];

  barangaysInRosario: string[] = [
    "Agutaya", "Alipangpang", "Anonang", "Banaybanay", "Banug Norte",
    "Catubig", "Cato", "Dalumpinas", "Dicaloyungan", "Labney", "Salasa"
  ];

  barangaysInPugo: string[] = [
    "Maoasoas Norte", "Maoasoas Sur", "Tavora East", "Tavora Proper"
  ];

  barangaysInPoz: string[] = ["Batakil", "Poblacion I"];


  towns: string[] = ['Pugo', 'Sison', 'Rosario', 'Pozurubio'];
  province: string[] = ["Pangasinan", "La Union"];

  isNextStepDisabled: boolean = true;

  
  newtransac = new FormGroup({
    CustAdd_ID: new FormControl<string | null>(null),
    AddService_price: new FormControl(null),
    Tracking_number: new FormControl(null),
    Cust_ID: new FormControl(this.id.cuid),
    Transac_status: new FormControl('pending'),
    laundry: new FormControl(this.laundrylist),
    service: new FormControl<string[]>([]) 
  });

  editaddress = new FormGroup({
    CustAdd_ID: new FormControl(null),
    Phoneno: new FormControl(null),
    Town_City: new FormControl(null),
    Barangay: new FormControl(null),
    Province: new FormControl(null),
    BuildingUnitStreet_No: new FormControl(null),
  });


  openEditModal(address: any) {
    console.log(address)
    this.user.getaddress(address).subscribe((data: any) => {
      this.addressupdate = data.data;
      
      // Update the form with the received data
      this.editaddress.patchValue({
        CustAdd_ID: data.data.CustAdd_ID || '',
        Phoneno: data.data.Phoneno || '',
        Town_City: data.data.Town_City || '',
        Barangay: data.data.Barangay || '',
        Province: data.data.Province || '',
        BuildingUnitStreet_No: data.data.BuildingUnitStreet_No || '',
      });
      console.log(this.addressupdate);
    });
  }
  
  updateAddress() {
    if (this.editaddress.valid) {
      const updatedAddress = this.editaddress.value;
      updatedAddress.CustAdd_ID = this.addressupdate.CustAdd_ID;
  
      this.user.updateaddress(updatedAddress).subscribe((data: any) => {
        // Handle success
        Swal.fire({
          title: 'Success!',
          text: 'Address updated successfully.',
          icon: 'success',
          showConfirmButton: false, 
          timer: 1500, 
        });
        this.showaddress(this.addressupdate.CustAdd_ID); 
        console.log(this.addressupdate.CustAdd_ID)
      }, (error) => {
        // Handle error
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update address.',
          icon: 'error',
          showConfirmButton: false, 
          timer: 1500, 
        });
      });
    }
  }
  
  laundryForm = new FormGroup({
    category: new FormControl('', Validators.required),
    quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    service: new FormControl('')
  });

  servicesForm = new FormGroup({
    service: new FormControl('', Validators.required)
  });


  constructor(
    private route: Router,
    private user: MyServiceService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.gentrack();
    this.initializeForm();
    this.fetchInitialData();
    const serviceControl = this.newtransac.get('service') as FormControl;
    this.getShippingAddress();
    this.showaddress(this.addressupdate.CustAdd_ID); 
  }

  addaddress = new FormGroup({
    CustAdd_ID: new FormControl(null),
    Cust_ID: new FormControl(this.id.cuid),  
    Province: new FormControl(null),
    Phoneno: new FormControl(null, [Validators.required, Validators.pattern(/^\d{11}$/)]),  
    BuildingUnitStreet_No: new FormControl(null),
    Town_City: new FormControl(null),
    Barangay: new FormControl(null)
  });

  onTownCityChange() {
    const townSelected = this.addaddress.get('Town_City')?.value;
    if (townSelected) {
      this.addaddress.get('Barangay')?.enable();
      this.addaddress.get('Province')?.enable();
      this.addaddress.get('BuildingUnitStreet_No')?.enable();
    } else {
      this.addaddress.get('Barangay')?.disable();
      this.addaddress.get('Province')?.disable();
      this.addaddress.get('BuildingUnitStreet_No')?.disable();
    }
  }


  public initializeForm(): void {
    const serviceControl = this.newtransac.get('service') as FormControl;
    if (serviceControl) {
      serviceControl.valueChanges.subscribe((selectedServices: string[]) => {
        this.selectedServices = selectedServices;
      });
    }
  }

  public updateTotalEstimatedPrice(): void {
    let baseTotal = this.laundrylist.reduce((sum, item) => sum + item.Price, 0);
    
    if (this.isRushJob) {
      baseTotal *= 2;
    }
    
    if (this.isPickUpService) {
      baseTotal += 50;
    }
    
    if (this.isDeliveryService) {
      baseTotal += 50;
    }

    this.total_estimated_price = baseTotal;
  }

  private fetchInitialData(): void {
    this.user.displaycategory().subscribe((data: any) => {
      this.categ = data;
    });

    this.user.display(this.id.cuid).subscribe((data: any) => {
      this.trans = data.transaction;
    });

    this.user.getcustomer(this.id.cuid).subscribe((data: any) => {
      this.custname = data.customerFirst.Cust_fname;
    });

    this.getShippingAddress();
  }

  gentrack(): void {
    this.post.getTrackingNo().subscribe((data: any) => {
      this.trackingNumber = data;
    });
  }

  private getShippingAddress(): void {
    this.post.getShippingAddress().subscribe((result: any) => {
      this.townAddresses = result.shippings || [];
    });
  }

  calculateTotal(): number {
    return this.calculateSubTotal() - this.discount + this.shippingCharge;
  }

  calculateSubTotal(): number {
    // return this.laundrylist.reduce((total, item) => {
    //   return total + parseFloat(item.Price.toString());
    // }, 0);
    let subtotal = this.laundrylist.reduce((total, item) => {
      return total + parseFloat(item.Price.toString());
    }, 0);

    if (this.isRushJob) {
      subtotal *= 2; // Double the subtotal for rush job
    }

    return subtotal;
  }

 

  edit(item: any): void {
    this.editingItem = this.editingItem === item ? null : item;
    console.log('Editing item:',item);
  }
  
  saveQty(item: any, newQty: any): void {
    if (newQty > 0) {

      const townElem = (document.getElementById("Qty") as HTMLSelectElement)?.value;
      console.log("Piniling Barangay sa Delivery", townElem);

      const index = this.laundrylist.findIndex((i) => i.Categ_ID === item.Categ_ID);
      if (index !== -1) {
        this.laundrylist[index].Qty = townElem; 
  
        console.log('Updated item:', this.laundrylist[index]);
      }

      this.editingItem = null;
  
      Swal.fire({
        icon: 'success',
        title: 'Quantity Updated',
        showConfirmButton: false,
        timer: 1500,
      });
  
      this.cdr.detectChanges();
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Quantity',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
  
  
  getUniqueCategories(): any[] {
    const uniqueCategories = new Set<string>();
    return this.laundrylist.filter((item) => {
      if (uniqueCategories.has(item.Category)) {
        return false;
      } else {
        uniqueCategories.add(item.Category);
        return true;
      }
    });
  }  

  addToList(): void {
    if (this.laundryForm.valid) {
      const categoryValue = this.laundryForm.value.category;
      const quantityValue = this.laundryForm.value.quantity ?? 1;
  
      // Check if the category already exists in the uniqueCategories set
      const uniqueCategories = new Set(this.laundrylist.map(item => item.Category));
  
      if (uniqueCategories.has(this.categ?.find(c => c.Categ_ID === parseInt(categoryValue!, 10))?.Category)) {
        // Alert using SweetAlert2 for duplicate category
        Swal.fire({
          icon: 'warning',
          title: 'Duplicate Category',
          text: 'This category already exists in the list.',
          showConfirmButton: false, // Removes the "OK" button
          timer: 1500, // Automatically closes after 1.5 seconds
        });
        return;
      }
  
      const selectedCategory = this.categ?.find(
        (c: any) => c.Categ_ID === parseInt(categoryValue!, 10)
      );
  
      if (selectedCategory) {
        const newItem = {
          Categ_ID: categoryValue,
          Category: selectedCategory.Category,
          Qty: quantityValue,
          Price: selectedCategory.Price,
          Tracking_number: this.trackingNumber,
          State: 'Pending'
        };
  
        this.laundrylist.push(newItem);
  
        // Reset the form fields
        this.laundryForm.reset({ quantity: 1 });
        this.selectedPrice = 0;
      }
  
      const serviceValue = this.laundryForm.get('service')?.value || 0;
      if (this.laundrylist.length > 0 && serviceValue && serviceValue.length > 0) {
        this.isNextStepDisabled = false;
      }
    }
  }
  
  

  showaddress(id: any) {
    this.post.showaddress(id).subscribe((res: any) => {
      console.log(res);
      console.log(id);
  
      if (res && res.length > 0) {
        this.address = res;
  
        // Filter to get the default address
        this.address = this.address.filter((addr: any) => addr.CustAdd_status === 'default');
    
        const selectedAddress = this.address[0];
        this.addaddress.patchValue({
          CustAdd_ID: selectedAddress.CustAdd_ID,
          Province: selectedAddress.Province,
          Phoneno: selectedAddress.Phoneno,
          BuildingUnitStreet_No: selectedAddress.BuildingUnitStreet_No,
          Town_City: selectedAddress.Town_City,
          Barangay: selectedAddress.Barangay
        });
      } else {
        console.log("No address found for the provided id");
      }
    }, (error) => {
      // Handle error if the request fails
      console.error("Error fetching address:", error);
    });
  }

  onCheckboxChange(event: any) {
    const serviceArray = this.newtransac.get('service') as FormControl<string[]>;
    const selServ = event.target.value;
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;
    const checkboxValue = event.target.value;
    const isChecked = event.target.checked;
  
    if (checkboxValue === "Rush-Job") {
      this.isRushJob = isChecked;
    } else if (checkboxValue === "PickUp-Service") {
      this.isPickUpService = isChecked;
    } else if (checkboxValue === "Delivery-Service") {
      this.isDeliveryService = isChecked;
    }
  
    // Recalculate total price
    const basePrice = this.laundrylist.reduce((acc: number, item: any) => acc + item.Price, 0);
    this.total_estimated_price = basePrice;
  
    if (this.isRushJob) {
      this.total_estimated_price *= 2; // Double the price for rush job
    }
  
    // Calculate shipping charge based on services
    let shippingCharge = 0;
    if (this.isPickUpService) {
      shippingCharge += 50; // Pick-up fee
    }
  
    if (this.isDeliveryService) {
      shippingCharge += 50; // Delivery fee
    }
  
    this.shippingCharge = shippingCharge; // Update shipping charge
  
    // Include shipping charge in the total price
    this.total_estimated_price += this.shippingCharge;
  
    if (value === 'PickUp-Service' || value === 'Delivery-Service') {
      this.showmodaladdress = checkbox.checked;
    }
  
    let selectedServices: string[] = serviceArray.value;
    if (isChecked) {
      selectedServices.push(value);
      if (selServ === 'PickUp-Service') {
        this.selectAddPick = true;
        this.showmodaladdress = true;
      } else if (selServ === 'Delivery-Service') {
        this.selectAddDel = true;
        this.showmodaladdress = true;
      }
    } else {
      selectedServices = selectedServices.filter(service => service !== value);
      if (selServ === 'PickUp-Service') {
        this.selectAddPick = false;
      } else if (selServ === 'Delivery-Service') {
        this.selectAddDel = false;
      }
    }
  
    serviceArray.setValue(selectedServices);
    console.log('Updated selected services:', selectedServices);
  }
  
  getLaundryPrice(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedCategID = select.value;
    const selectedCategory = this.categ.find((c: any) => c.Categ_ID == selectedCategID);
    
    if (selectedCategory) {
      this.selectedPrice = selectedCategory.Price;
      this.showservices = true;
    }
  }

  removeFromList(item: any): void {
    const index = this.laundrylist.indexOf(item);
    if (index !== -1) {
      this.laundrylist.splice(index, 1);
      // this.updateTotalEstimatedPrice();
    }
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

  deleteaddress(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this address?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(id);
        this.post.deleteaddress(id).subscribe(
          (response: any) => {
            this.showaddress(this.id.cuid);
            Swal.fire({
              title: 'Deleted!',
              text: 'The address has been deleted.',
              icon: 'success',
              showConfirmButton: false, // Removes the "OK" button
              timer: 1500, // Automatically closes after 1.5 seconds
            });
          },
          (error) => {
            Swal.fire({
              title: 'Error!',
              text: 'An error occurred while deleting the address.',
              icon: 'error',
              showConfirmButton: false, // Removes the "OK" button
              timer: 1500, // Automatically closes after 1.5 seconds
            });
          }
        );
      } else {
        Swal.fire({
          title: 'Cancelled',
          text: 'The address was not deleted.',
          icon: 'info',
          showConfirmButton: false, // Removes the "OK" button
          timer: 1500, // Automatically closes after 1.5 seconds
        });
      }      
    });
  }
  

  insert() {
    const townElem = (document.getElementById("ShipServ_price") as HTMLSelectElement)?.value;
    console.log("Piniling Barangay sa Delivery", townElem);
  
    const townElems = (document.getElementById("ShipServ_prices") as HTMLSelectElement)?.value;
    console.log("Piniling Barangay sa Pickup", townElems);
  
    // Suriin kung may mga item sa laundry list
    if (this.laundrylist.length === 0) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Mangyaring magdagdag ng kahit isang item sa listahan bago mag-save!",
        showConfirmButton: false, // Removes the "OK" button
        timer: 1500, // Automatically closes after 1.5 seconds
      });
      return;
    }
  
    // I-prepare ang transaction data
    this.newtransac.patchValue({
      CustAdd_ID: townElems && townElem ? townElem : null,
      AddService_price: this.total_estimated_price ? this.total_estimated_price : 0,
      Tracking_number: this.trackingNumber,
      laundry: this.laundrylist,
      service: this.selectedServices && this.selectedServices.length > 0 ? this.selectedServices : null
    });
    
    const formData = this.newtransac.value;
  
    // I-log ang form data para sa debugging
    console.log("Transaction Form Data:", formData);
    console.log(formData);
  
    // Tumawag sa API para mag-insert ng transaction data
    this.post.addtrans(formData).subscribe(
      (result: any) => {
        console.log("Transaction API Response:", result);
  
        if (result && result.Transaction) {
          // Kung walang address na isusunod, magpatuloy lamang sa transaction
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Transaction details and address added successfully!",
            showConfirmButton: false, // Removes the "OK" button
            timer: 1500, // Automatically closes after 1.5 seconds
          }).then(() => {
            this.route.navigate(['/main/cusmainhome/homemain/cuscurtrans']);
            this.fetchtransactions();
          });
        } else {
          console.error("Unknown error:", result);
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error occurred while saving address data.",
            text: result?.message || "Unknown error",
            showConfirmButton: false, // Removes the "OK" button
            timer: 1500, // Automatically closes after 1.5 seconds
          });
        }
      },
      (error) => {
        console.error("Transaction API Error:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error occurred during saving transaction..",
          text: error.message || "Unknown error",
          showConfirmButton: false, // Removes the "OK" button
          timer: 1500, // Automatically closes after 1.5 seconds
        });
      }
    );
  }

  newaddress() {
    console.log(this.addaddress.value);
  
    if (this.addaddress.valid) {
      const addressData = this.addaddress.value; 
  
      this.post.addAddress(addressData).subscribe(
        (response) => {
          console.log('Address saved successfully:', response);
  
          Swal.fire({
            title: 'Success!',
            text: 'Address saved successfully!',
            icon: 'success',
            showConfirmButton: false, // Removes the "OK" button
            timer: 1500, // Automatically closes after 1.5 seconds
          });
          this.showaddress(this.id.cuid);
        },
        (error) => {
          console.error('Error saving address:', error);
          Swal.fire({
            title: 'Error!',
            text: 'There was an issue saving the address.',
            icon: 'error',
            showConfirmButton: false, // Removes the "OK" button
            timer: 1500, // Automatically closes after 1.5 seconds
          });
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
  
  selectAddress(selected: any): void {
    this.selectedAddress = selected.CustAdd_ID;
    // Get the ShipServ_price and add it to totalEstimatedPrice
    this.totalEstimatedPrice = selected.ShipServ_price;

    console.log('Selected address:', selected);
    console.log('Total Estimated Price:', this.totalEstimatedPrice);
  }
  // getShippingAddress()
  // {
  //   this.post.getShippingAddress().subscribe((result: any) => {
  //     this.townAddresses = result.shippings;
  //     console.log(this.townAddresses);
  //   });
  // }
}