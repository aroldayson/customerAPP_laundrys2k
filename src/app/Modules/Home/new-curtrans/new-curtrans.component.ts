import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  selectedServices: string[] = [];  
  l_price:any;
  l_min_weight:any;
  total_estimated_price:any;
  townAddresses: any;
  selectedTownID: any;
  townAddress: any;
  sison: boolean = false;
  poz: boolean = false;
  rosario: boolean = false;
  pugo: boolean = false;
  selectBar: boolean = false;
  selectAddPick: boolean = false;
  selectAddDel: boolean = false;
  selectedPrice:any;
  showmodaladdress:boolean = false;

  deliveryTown: any;
  deliveryBarangay: any;
  deliveryStreet: any;

  pickupTown: any;
  pickupBarangay: any;
  pickupStreet: any;

  showservices: boolean = false

  address:any;

  selectedCity: string | null = null;
  custname:any;
  selectedDeliveryAddressId: string | null = null;
  selectedPickupAddressId: string | null = null;
  
  // address: any[] = []; // your array of addresses
  selectedAddress: number | null = null; // track selected address ID
  totalEstimatedPrice: number = 0; // to store the total price



  id = { cuid: localStorage.getItem('Cust_ID') };
  testid = localStorage.getItem('Cust_ID');
  laundrylist: any[] = [];

  barangaysInSison: any[] = ["Amagbagan", "Artacho", "Asan Norte", "Asan Sur", "Bantay Insik", "Bila", "Binmeckeg", "Bulaoen East", "Bulaoen West", "Cabaritan", "Calunetan", "Camangaan", "Cauringan", "Dungon", "Esperanza", "Inmalog", "Killo", "Labayug", "Paldit", "Pindangan", "Pinmilapil", "Poblacion Central", "Poblacion Norte"]

  barangaysInRosario = ["Agutaya", "Alipangpang", "Anonang", "Banaybanay", "Banug Norte", "Catubig", "Cato", "Dalumpinas", "Dicaloyungan", "Labney", "Salasa"];

  barangaysInPugo = ["Maoasoas Norte", "Maoasoas Sur", "Tavora East", "Tavora Proper"];

  barangaysInPoz = ["Batakil", "Poblacion I"];




  newtransac = new FormGroup({
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
  inputElement: any;

  constructor(
    private route: Router,
    private user: MyServiceService
  ){}

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

    this.user.getcustomer(this.id.cuid).subscribe((data:any)=>{
      this.custname = data.customerFirst.Cust_fname
      console.log(data)
    })

    this.getShippingAddress();
  }

  gentrack() {
    this.post.getTrackingNo().subscribe((data: any) => {
      this.trackingNumber = data;
      console.log(data);
    });
  }



//  selectedAddress: number | null = null; //
 shippingCost: number = 0;

 addShippingCost(selectedAddress: any) {

  const shippingFee = 50;

  this.selectedAddress = selectedAddress.CustAdd_ID;


  this.shippingCost = shippingFee;

  console.log(`Shipping cost added: ${this.shippingCost}`);

//   this.updateTotalPrice();
 }

 UpdateTotalPrice() {

  this.total_estimated_price += this.shippingCost;

  console.log(`Updated Total Estimated Price: ${this.total_estimated_price}`);
 }

  addToList() {
  const selectElement = document.getElementById('laundryType') as HTMLSelectElement;
  const laundryType = selectElement.value;
  const count = (document.getElementById('weight') as HTMLInputElement).value;

  // Ensure address details are shown before proceeding
  this.showaddress(this.id.cuid);
  console.log(this.trackingNumber);

  // Check if the laundry type is selected
  if (laundryType) {
    // Find the selected category from the categories list
    const selectedCategory = this.categ.find(
      (category: any) => category.Categ_ID === parseInt(laundryType, 10)
    );

    if (selectedCategory) {
      // Destructure the necessary fields from the selected category
      const { Minimum_weight, Price, Delivery_fee } = selectedCategory;

      // Calculate the total price based on the quantity, price, and delivery fee
      const totalPrice = (Minimum_weight * Price) + (Delivery_fee || 0) + this.shippingCost;

      console.log(`Price per unit: ${Price}, Minimum weight: ${Minimum_weight}`);
      console.log(`Delivery fee: ${Delivery_fee || 0}`);
      console.log(`Total price with delivery: ${totalPrice}`);

      // Create a new item object
      const newItem = {
        Categ_ID: laundryType,
        Category: selectedCategory.Category,
        Qty: count,
        Price: totalPrice, 
        Tracking_number: this.trackingNumber
      };

      // Add the new item to the laundry list
      this.laundrylist.push(newItem);
      console.log(this.laundrylist);

      // Reset the total estimated price and calculate the new total
      this.total_estimated_price = 0;
      this.laundrylist.forEach((item: any) => {
        this.total_estimated_price += item.Price;
      });

      // Clear the input fields and reset the selected price
      (document.getElementById('laundryType') as HTMLSelectElement).value = '';
      (document.getElementById('weight') as HTMLInputElement).value = '';
      this.selectedPrice = undefined;
    } else {
      console.error('Selected laundry type not found in categories.');
    }
  } else {
    console.error('Please select a laundry type.');
  }
}

  // selectAddress(selected: any): void {
  //   this.selectedAddress = selected.CustAdd_ID;
  //   // You can log or do any other processing you need
  //   console.log('Selected address:', selected);
  // }

  
  // Method to handle address selection
  selectAddress(selected: any): void {
    this.selectedAddress = selected.CustAdd_ID;
    // Get the ShipServ_price and add it to totalEstimatedPrice
    this.totalEstimatedPrice = selected.ShipServ_price;

    console.log('Selected address:', selected);
    console.log('Total Estimated Price:', this.totalEstimatedPrice);
  }

  // Method to delete an address
  // deleteaddress(addressId: number): void {
  //   this.address = this.address.filter(a => a.CustAdd_ID !== addressId);
  // }

  // Finalize transaction and include the selected address
  saveTransaction(): void {
    if (this.selectedAddress) {
      const transactionData = {
        addressId: this.selectedAddress,
        totalEstimatedPrice: this.totalEstimatedPrice,
        // other transaction details
      };

      console.log('Transaction data:', transactionData);

      // Call service to save transaction
      // this.transactionService.save(transactionData);
    } else {
      console.log('No address selected!');
    }
  }

  onCityAddressChange(event: Event): void {
    this.inputElement = event.target as HTMLInputElement;
    console.log('Selected City Address in Delivery:', this.inputElement.value);
  }
  onCityAddressChanges(event: Event): void {
    this.inputElement = event.target as HTMLInputElement;
    console.log('Selected City Address in Pickup:', this.inputElement.value);
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
      AddService_price: this.inputElement,
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
    const selServ = event.target.value; const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (value === 'PickUp-Service' || value === 'Delivery-Service') {
      this.showmodaladdress = checkbox.checked; 
    }

    let selectedServices: string[] = serviceArray.value;
    console.log(event.target.checked)

    if (event.target.checked) {
      selectedServices.push(event.target.value);
      console.log(selServ);
      if(selServ == 'PickUp-Service'){
        this.selectAddPick = true;
        this.showmodaladdress = true;
      }else if(selServ == 'Delivery-Service'){
        this.selectAddDel = true;
        this.showmodaladdress = true;
      }else if(selServ == 'Rush-Job'){

      }
      else{
        this.selectAddDel =false;
        this.selectAddPick = false;
      }
    } else {
      // Remove the selected service from the array if it is unchecked
      selectedServices = selectedServices.filter((service) => service !== event.target.value);
      if(selServ == 'PickUp-Service'){
        this.selectAddPick = false;
      }else if(selServ == 'Delivery-Service'){
        this.selectAddDel = false;
      }else{
        this.selectAddDel = this.selectAddDel;
        this.selectAddPick = this.selectAddPick;
      }
    }

    // Update the FormControl value
    serviceArray.setValue(selectedServices);
    console.log('Updated selected services:', selectedServices);
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

  deleteaddress(id: any)
  {
    console.log(id);
    this.post.deleteaddress(id).subscribe((result: any) => {
      this.showaddress(this.id.cuid)
      console.log("Success");
    });
  }

  getShippingAddress()
  {
    this.post.getShippingAddress().subscribe((result: any) => {
      this.townAddresses = result.shippings;
      console.log(this.townAddresses);
    });
  }

  getTownValue(selectedValue: any): void
  {
    this.townAddress = selectedValue.target.value;
    console.log(this.townAddress);
    this.selectBar = true;
    this.sison = false;
    this.poz = false;
    this.rosario = false;
    this.pugo = false;

    if(this.townAddress.toLowerCase() === 'sison'){
      this.sison = true;
    }else if(this.townAddress.toLowerCase() === 'pozorrubio'){
      this.poz = true;
    }else if(this.townAddress.toLowerCase() === 'rosario'){
      this.rosario = true;
    }else if(this.townAddress.toLowerCase() === 'pugo'){
      this.pugo = true;
    }

  }

  getshippingprice(){
    // this.id
    this.post.getshippingprice(this.id).subscribe((result:any)=>{

    })
  }

  getLaundryPrice(event: any): void {
    this.showservices = true;
    const selectedCategID = event.target.value;  // Get the selected Categ_ID
    const selectedCategory = this.categ.find((c:any) => c.Categ_ID == selectedCategID);  // Find category by Categ_ID

    if (selectedCategory) {
      this.selectedPrice = selectedCategory.Price;  // Store the price in selectedPrice
    }
  }

  removeFromList(item: any) {
    const index = this.laundrylist.indexOf(item);
    if (index !== -1) {
      this.laundrylist.splice(index, 1);
      console.log(this.laundrylist);
    }
  }

  openEditModal() {
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found');
    }
  }

  saveAddress() {
    console.log('Updated Address:', this.editAddress);
    // Send the updated address to your backend API or update your frontend list
  }


}