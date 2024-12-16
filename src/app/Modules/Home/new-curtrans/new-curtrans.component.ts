import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

  deliveryTown: any;
  deliveryBarangay: any;
  deliveryStreet: any;

  pickupTown: any;
  pickupBarangay: any;
  pickupStreet: any;

  showservices: boolean = false

  address:any;

  selectedCity: string | null = null;

  
  id = { cuid: localStorage.getItem('Cust_ID') };
  testid = localStorage.getItem('Cust_ID');
  laundrylist: any[] = [];

  barangaysInSison: any[] = ["Amagbagan", "Artacho", "Asan Norte", "Asan Sur", "Bantay Insik", "Bila", "Binmeckeg", "Bulaoen East", "Bulaoen West", "Cabaritan", "Calunetan", "Camangaan", "Cauringan", "Dungon", "Esperanza", "Inmalog", "Killo", "Labayug", "Paldit", "Pindangan", "Pinmilapil", "Poblacion Central", "Poblacion Norte"]

  barangaysInRosario = ["Agutaya", "Alipangpang", "Anonang", "Banaybanay", "Banug Norte", "Catubig", "Cato", "Dalumpinas", "Dicaloyungan", "Labney", "Salasa"];
  
  barangaysInPugo = ["Maoasoas Norte", "Maoasoas Sur", "Tavora East", "Tavora Proper"];

  barangaysInPoz = ["Batakil", "Poblacion I"];




  newtransac = new FormGroup({
    AddService_price: new FormControl("90"),
    Tracking_number: new FormControl(null),
    Cust_ID: new FormControl(this.id.cuid),
    Transac_status: new FormControl('pending'),
    laundry: new FormControl(this.laundrylist),
    service: new FormControl<string[]>([]) // This is an array of selected services
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

    this.getShippingAddress();
  }

  // Method to generate tracking number
  gentrack() {
    this.post.getTrackingNo().subscribe((data: any) => {
      this.trackingNumber = data;
      console.log(data);
    });
  }

  // onCityAddressChange(event: Event): void {
  //   const inputElement = event.target as HTMLInputElement;
  //   console.log('Selected City Address:', inputElement.value);
  // }
  

  // Add items to the laundry list
  // addToList() {
  //   const selectElement = document.getElementById('laundryType') as HTMLSelectElement;
  //   const laundryType = selectElement.value;
  //   const count = (document.getElementById('weight') as HTMLInputElement).value;
  //   console.log(this.trackingNumber);

  //   if (laundryType && count) {
  //     const newItem = {
  //       Categ_ID: laundryType,
  //       Category: selectElement.options[selectElement.selectedIndex].text,
  //       Qty: count,
  //       // price: laundryType.Price,
  //       Tracking_number: this.trackingNumber
  //     };
  //     this.laundrylist.push(newItem);
  //     console.log(this.laundrylist);

  //     // Reset form fields
  //     selectElement.value = '';
  //     (document.getElementById('weight') as HTMLInputElement).value = '';
  //   }
  // }


  addToList() {
    const selectElement = document.getElementById('laundryType') as HTMLSelectElement;
    const laundryType = selectElement.value;
    const count = (document.getElementById('weight') as HTMLInputElement).value;
    this.showaddress(this.id.cuid);
    console.log(this.trackingNumber);
  
    if (laundryType) {
      // Find the specific category object based on Categ_ID
      const selectedCategory = this.categ.find(
        (category: any) => category.Categ_ID === parseInt(laundryType, 10)
      );
    
      if (selectedCategory) {
        // Get Minimum_weight and Price
        const { Minimum_weight, Price } = selectedCategory;
    
        // Calculate total price
        const totalPrice = Minimum_weight * Price;
    
        console.log(`Price per unit: ${Price}, Minimum weight: ${Minimum_weight}`);
        console.log(`Total price: ${totalPrice}`);
    
        const newItem = {
          Categ_ID: laundryType,
          Category: selectedCategory.Category,
          Qty:count,
          Price: totalPrice, // Calculated based on Minimum_weight * Price
          Tracking_number: this.trackingNumber
        };
    
        this.laundrylist.push(newItem);
        console.log(this.laundrylist);

        this.total_estimated_price = 0;

       this.laundrylist.forEach((item: any) => {
        this.total_estimated_price += item.Price;
      });
        // Reset form fields
        (document.getElementById('laundryType') as HTMLSelectElement).value = '';
        (document.getElementById('weight') as HTMLInputElement).value = '';
        this.selectedPrice = undefined
      } else {
        console.error('Selected laundry type not found in categories.');
      }
    }    
  }

  // insert() {
  //   console.log("Selected Barangay",this.deliveryTown)
  //   // Validate if the laundry list has items
  //   if (this.laundrylist.length === 0) {
  //     Swal.fire({
  //       position: "center",
  //       icon: "warning",
  //       title: "Please add at least one item to the list before saving!",
  //       showConfirmButton: true,
  //     });
  //     return;
  //   }

  //   // Prepare the transaction data
  //   this.newtransac.patchValue({
  //     Tracking_number: this.trackingNumber,
  //     laundry: this.laundrylist,
  //     service: this.selectedServices.length > 0 ? this.selectedServices : ['none'], // Default to 'none' if no service selected
  //   });

  //   const formData = this.newtransac.value;

  //   // Log form data for debugging
  //   console.log("Transaction Form Data:", formData);

  //   // Call API to insert transaction data
  //   this.post.addtrans(formData).subscribe(
  //     (result: any) => {
  //       console.log("Transaction API Response:", result);

  //       if (result && result.Transaction) {
  //         const town = (document.getElementById("town") as HTMLSelectElement).value;
  //         const barangay = (document.getElementById("barangay") as HTMLSelectElement).value;
  //         const street = (document.getElementById("barangayInput") as HTMLSelectElement).value;

  //         const picktown = (document.getElementById("picktown") as HTMLSelectElement).value;
  //         const pickbarangay = (document.getElementById("pickbarangay") as HTMLSelectElement).value;
  //         const pickstreet = (document.getElementById("pickbarangayInput") as HTMLSelectElement).value;
  //         // console.log(test)
  //         // Prepare address data to insert
  //         const addressData = {
  //           delivery: {
  //             Cust_ID: this.id.cuid,
  //             Town_City: town,
  //             Barangay: barangay,
  //             BuildingNo_Street: street,
  //           },
  //           pickup: {
  //             Cust_ID: this.id.cuid,
  //             Town_City: picktown,
  //             Barangay: pickbarangay,
  //             BuildingNo_Street: pickstreet,
  //           }
  //         };

  //         console.log("Prepared Address Data:", addressData);

  //         // Insert address data
  //         this.post.insertaddress(addressData).subscribe(
  //           (response: any) => {
  //             console.log("Address data inserted:", response);

  //             Swal.fire({
  //               position: "center",
  //               icon: "success",
  //               title: "Transaction details and address added successfully!",
  //               showConfirmButton: true,
  //             }).then(() => {
  //               this.route.navigate(['/main/cusmainhome/homemain/cuscurtrans']);
  //               this.fetchtransactions();
  //             });
  //           },
  //           (error) => {
  //             console.error("Error inserting address data:", error);
  //             Swal.fire({
  //               position: "center",
  //               icon: "error",
  //               title: "Error occurred while saving address data.",
  //               text: error.message || "Unknown error",
  //               showConfirmButton: true,
  //             });
  //           }
  //         );
  //       } else {
  //         console.error("Unexpected Transaction API Response:", result);
  //         Swal.fire({
  //           position: "center",
  //           icon: "error",
  //           title: "Error occurred during saving transaction.",
  //           text: result?.message || "Unknown error",
  //           showConfirmButton: true,
  //         });
  //       }
  //     },
  //     (error) => {
  //       console.error("Transaction API Error:", error);
  //       Swal.fire({
  //         position: "top-end",
  //         icon: "error",
  //         title: "An error occurred while saving the transaction.",
  //         text: error.message || "No additional error details provided by the server",
  //         showConfirmButton: true,
  //       });
  //     }
  //   );

  // }
  onCityAddressChange(event: Event): void {
    this.inputElement = event.target as HTMLInputElement;
    console.log('Selected City Address:', this.inputElement.value);
  }
  insert() {
    const townElem = document.getElementById("ShipServ_price") as HTMLSelectElement | null;
    console.log("Selected Barangay", townElem?.value);

    // Validate if the laundry list has items
    if (this.laundrylist.length === 0) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Please add at least one item to the list before saving!",
        showConfirmButton: true,
      });
      return;
    }
  
    // Prepare the transaction data
    this.newtransac.patchValue({
      AddService_price: this.inputElement,
      Tracking_number: this.trackingNumber,
      laundry: this.laundrylist,
      service: this.selectedServices.length > 0 ? this.selectedServices : ['none'], // Default to 'none' if no service selected
    });
  
    const formData = this.newtransac.value;
  
    // Log form data for debugging
    console.log("Transaction Form Data:", formData);
  
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
              title: "Transaction details added successfully without address!",
              showConfirmButton: true,
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
                  showConfirmButton: true,
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
                  showConfirmButton: true,
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
            showConfirmButton: true,
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
    const selServ = event.target.value;
  
    // Get current selected services array
    let selectedServices: string[] = serviceArray.value;
    console.log(event.target.checked)
  
    if (event.target.checked) {
      // Add the selected service to the array if it is checked
      selectedServices.push(event.target.value);
      console.log(selServ);
      if(selServ == 'PickUp-Service'){
        this.selectAddPick = true;
      }else if(selServ == 'Delivery-Service'){
        this.selectAddDel = true;
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
    Cust_ID: new FormControl(80),  // You may want to adjust this to your needs
    Province: new FormControl(null),
    Phoneno: new FormControl(null, [Validators.required, Validators.pattern(/^\d{10}$/)]),  // Example for phone number validation
    BuildingNo_Street: new FormControl(null),
    Town_City: new FormControl(null),
    Barangay: new FormControl(null),
  });

  showaddress(id:any){
    this.post.showaddress(id).subscribe((res:any)=>{
      console.log(res)
      console.log(id)
      this.address = res;
    })
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

  deleteaddress(id: any){
    console.log(id);
    this.post.deleteaddress(id).subscribe((result: any) => {
      this.showaddress(this.id.cuid)
      console.log("Success");
    });
  }

  getShippingAddress(){
    this.post.getShippingAddress().subscribe((result: any) => {
      this.townAddresses = result.shippings;
      console.log(this.townAddresses);
    });
  }

  getTownValue(selectedValue: any): void{
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

  // Remove an item from the laundry list
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
  
    // Save the address (or send to backend)
    saveAddress() {
      console.log('Updated Address:', this.editAddress);
      // Send the updated address to your backend API or update your frontend list
    }


}
