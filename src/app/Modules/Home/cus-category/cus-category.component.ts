import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cus-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cus-category.component.html',
  styleUrl: './cus-category.component.css'
})
export class CusCategoryComponent implements OnInit {
  private post = inject(MyServiceService);
  categ: any;
  trans: any;
  trackingNumber: any;
  customerdata: any;
  laundry: any;
  selectedServices: string[] = [];  
  l_price: number = 0;
  l_min_weight: number = 0;
  total_estimated_price: number = 0;
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

  isNextStepDisabled: boolean = true;

  newtransac = new FormGroup({
    Category: new FormControl('Select Laundry Type', Validators.required),
    Qty: new FormControl(1, [Validators.required, Validators.min(1)]),
    CustAdd_ID: new FormControl<string | null>(null),
    AddService_price: new FormControl(null),
    Tracking_number: new FormControl(null), 
    Cust_ID: new FormControl(this.id.cuid),
    Transac_status: new FormControl('pending'),
    laundry: new FormControl(this.laundrylist),
    service: new FormControl<string[]>([])
  });
 

  editAddress = {
    Province: '',
    Town_City: '',
    Barangay: '',
    BuildingNo_Street: '',
  };

  inputElement: HTMLInputElement | null = null;

  discount: number = 0;
  shippingCharge: number = 0;
  shippingCost: number = 0;

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
    private user: MyServiceService
  ) {}

  ngOnInit(): void {
    this.gentrack();
    this.initializeForm();
    this.fetchInitialData();
    const serviceControl = this.newtransac.get('service') as FormControl;
  }

  // onServiceChange(selectedService: string): void {
  //   if (selectedService === 'rush' || selectedService === 'pick' || selectedService === 'deliver') {
  //     this.showShippingAddress = true;
  //   } else {
  //     this.showShippingAddress = false;
  //   }
  // }
  addaddress = new FormGroup({
    CustAdd_ID: new FormControl(null),
    Cust_ID: new FormControl(this.id.cuid),  
    Province: new FormControl(null),
    Phoneno: new FormControl(null, [Validators.required, Validators.pattern(/^\d{11}$/)]),  
    BuildingUnitStreet_No: new FormControl(null),
    Town_City: new FormControl(null),
    Barangay: new FormControl(null)
  });


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

  addToList(): void {
    if (this.laundryForm.valid) {
      const categoryValue = this.laundryForm.value.category;
      const quantityValue = this.laundryForm.value.quantity ?? 1;
      
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
        this.updateTotalEstimatedPrice();
        this.laundryForm.reset({ quantity: 1 });
        this.selectedPrice = 0;
      }

      const serviceValue = this.laundryForm.get('service')?.value || 0;
      console.log("🚀 ~ CusCategoryComponent ~ addToList ~ serviceValue:", serviceValue)
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
      this.updateTotalEstimatedPrice();
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
  insert() {
    const townElem = (document.getElementById("ShipServ_price") as HTMLSelectElement)?.value
    console.log("Selected Barangay in Delivery", townElem);

    const townElems = (document.getElementById("ShipServ_prices") as HTMLSelectElement)?.value
    console.log("Selected Barangay in Pickup", townElems);

    // Validate if the laundry list has items
    if (this.laundrylist.length === 0) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Please add at least one item to the list before saving!",
        showConfirmButton: false,
      });
      return;
    }

    // Prepare the transaction data
    this.newtransac.patchValue({
      CustAdd_ID: (document.getElementById("ShipServ_prices") as HTMLSelectElement)?.value || null, // Default to null if the value is empty or invalid
      // AddService_price: this.inputElement,
      Tracking_number: this.trackingNumber,
      laundry: this.laundrylist,
      service: this.selectedServices.length > 0 ? this.selectedServices : ['none'], // Default to 'none' if no service selected
    });

    const formData = this.newtransac.value;

    // Log form data for debugging
    console.log("Transaction Form Data:", formData);
    console.log(formData)

    // Call API to insert transaction data
    this.post.addtrans(formData).subscribe(
      (result: any) => {
        console.log("Transaction API Response:", result);

        if (result && result.Transaction) {
          // Get address data only if the elements exist
          const townElem = document.getElementById("town") as HTMLSelectElement | null;
          const barangayElem = document.getElementById("barangay") as HTMLSelectElement | null;
          const streetElem = document.getElementById("barangayInput") as HTMLSelectElement | null;

          const picktownElem = document.getElementById("picktown") as HTMLSelectElement | null;
          const pickbarangayElem = document.getElementById("pickbarangay") as HTMLSelectElement | null;
          const pickstreetElem = document.getElementById("pickbarangayInput") as HTMLSelectElement | null;

          // Ensure the elements exist before accessing their value
          const town = townElem ? townElem.value : '';
          const barangay = barangayElem ? barangayElem.value : '';
          const street = streetElem ? streetElem.value : '';

          const picktown = picktownElem ? picktownElem.value : '';
          const pickbarangay = pickbarangayElem ? pickbarangayElem.value : '';
          const pickstreet = pickstreetElem ? pickstreetElem.value : '';




          // Check if any address field is null or empty
          if (!(town || barangay || street) && !(picktown || pickbarangay || pickstreet)) {
            // If address fields are null or empty, proceed only with the transaction (no address insertion)
            console.log("Address data is incomplete. Skipping address insertion.");

            Swal.fire({
              position: "center",
              icon: "success",
              title: "Transaction details added successfully",
              showConfirmButton: false,
            }).then(() => {
              this.route.navigate(['/main/cusmainhome/homemain/cuscurtrans']);
              this.fetchtransactions();
            });

          } else {
            // If all address fields are filled, proceed with both transaction and address insertion
            const addressData = {
              delivery: {
                Cust_ID: this.id.cuid,
                Town_City: town,
                Barangay: barangay,
                BuildingNo_Street: street,
              },
              pickup: {
                Cust_ID: this.id.cuid,
                Town_City: picktown,
                Barangay: pickbarangay,
                BuildingNo_Street: pickstreet,
              }
            };

            console.log("Prepared Address Data:", addressData);

            // Insert address data
            this.post.insertaddress(addressData).subscribe(
              (response: any) => {
                console.log("Address data inserted:", response);

                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Transaction details and address added successfully!",
                  showConfirmButton: false,
                }).then(() => {
                  this.route.navigate(['/main/cusmainhome/homemain/cuscurtrans']);
                  this.fetchtransactions();
                });
              },
              (error) => {
                console.error("Error inserting address data:", error);
                Swal.fire({
                  position: "center",
                  icon: "error",
                  title: "Error occurred while saving address data.",
                  text: error.message || "Unknown error",
                  showConfirmButton: false,
                });
              }
            );
          }
        } else {
          console.error("Unexpected Transaction API Response:", result);
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error occurred during saving transaction.",
            text: result?.message || "Unknown error",
            showConfirmButton: false,
          });
        }
      },
      (error) => {
        console.error("Transaction API Error:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "An error occurred while saving the transaction.",
          text: error.message || "No additional error details provided by the server",
          showConfirmButton: false,
        });
      }
    );
  }
  newaddress(){
    console.log(this.addaddress.value);
    if (this.addaddress.valid) {
      const addressData = this.addaddress.value;  // Make sure to use this.ddaddress
      this.post.addAddress(addressData).subscribe(
        (response) => {
          console.log('Address saved successfully:', response);
          this.addaddress.reset();  // Reset form after successful submission
          this.showaddress(this.id.cuid)
        },
        (error) => {
          console.error('Error saving address:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}