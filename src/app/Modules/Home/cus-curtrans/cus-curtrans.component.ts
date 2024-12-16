import { CommonModule } from '@angular/common';
import { Component,ElementRef,inject,OnInit } from '@angular/core';
import { Router, RouteReuseStrategy, RouterLink } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { SearchFilterPipe } from '../../../search-filter.pipe';


@Component({
  selector: 'app-cus-curtrans',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,SearchFilterPipe],
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
  service:any;
  servicearray: string[] = [];
  removedServices: string[] = [];
  servicesUpd: string[] = [];
  address:any;
  selectedservices = {
    rush: false,
    pick: false,
    deliver: false,
  };
  
  constructor(
    private route: Router,
    private user: MyServiceService
  
  ){}

  list: any;
  Tracking_Number:any;
  customerdata:any;
  errormessage:any;
  id = {cuid: localStorage.getItem('Cust_ID')};
  trans_id: {id: string | null} = {id: localStorage.getItem('Tracking_Number')};

  
  category:any;
  qty:any;
  searchText:any;
  keyword:any;
  
  rush:boolean = false;
  pick:boolean = false;
  delivery:boolean = false;

  laundrylist = this.post.post; 

  newtransac = new FormGroup({
    Tracking_number: new FormControl(null),
    Cust_ID: new FormControl(null),
    Qty: new FormControl(this.laundrylist),
    Services: new FormControl(null),
    Categ_ID: new FormControl(this.laundrylist)
  })

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

  deliveryTown: string = '';
  deliveryBarangay: string = '';
  deliveryStreet: string = '';

  pickupTown: string = '';
  pickupBarangay: string = '';
  pickupStreet: string = '';

  
  barangaysInSison: any[] = ["Amagbagan", "Artacho", "Asan Norte", "Asan Sur", "Bantay Insik", "Bila", "Binmeckeg", "Bulaoen East", "Bulaoen West", "Cabaritan", "Calunetan", "Camangaan", "Cauringan", "Dungon", "Esperanza", "Inmalog", "Killo", "Labayug", "Paldit", "Pindangan", "Pinmilapil", "Poblacion Central", "Poblacion Norte"]

  barangaysInRosario = ["Agutaya", "Alipangpang", "Anonang", "Banaybanay", "Banug Norte", "Catubig", "Cato", "Dalumpinas", "Dicaloyungan", "Labney", "Salasa"];
  
  barangaysInPugo = ["Maoasoas Norte", "Maoasoas Sur", "Tavora East", "Tavora Proper"];

  barangaysInPoz = ["Batakil", "Poblacion I"];



  copyToClipboard(trackNum: string): void {
    navigator.clipboard.writeText(trackNum).then(() => {
      alert('Tracking number copied to clipboard!');
    }).catch(err => {
      alert('Failed to copy tracking number!');
    });
  }

  ngAfterViewInit() {
    // Initialize all tooltips on the page
    var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
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
      this.service = data.Addservice_name
      if(this.trans && this.trans.length > 0){
        const pendingTransactions = this.trans.filter((transs: any) => 
          transs.trans_stat.trim().toLowerCase() !== 'cancel' &&  // Normalize case and trim whitespace
          (transs.trans_stat.trim().toLowerCase() === 'pending' || 
           transs.trans_stat.trim().toLowerCase() === 'received' || 
           transs.trans_stat.trim().toLowerCase() === 'washing' || 
           transs.trans_stat.trim().toLowerCase() === 'folding' || 
           transs.trans_stat === 'forRelease' || 
           transs.trans_stat.trim().toLowerCase() === 'released' || 
           transs.trans_stat.trim().toLowerCase() === 'paid')
        );
        // 'Pending','Recieved','Washing','Folding','For Release','Released'
        if(pendingTransactions.length > 0){
          console.log('Pending Trans', pendingTransactions);
          this.trans = pendingTransactions;
        } else {
          console.log( "no pending")
          this.trans = [];
        }
      }
      console.log(this.trans);
      this.calculateTotalQuantity();
    })
  }
  ngOnInit(): void{
    // this.fetchtransactions();
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
      console.log(data)
      this.trans = data.transaction; 
    })
    this.fetchtransactions();

    this.getShippingAddress();
  }

  gentrack() {
    this.post.getTrackingNo().subscribe((data:any)=>{
      this.Tracking_Number = data;

      this.route.navigate(['/main/cusmainhome/homemain/newcurtrans']);
      console.log(this.Tracking_Number);
    })
  }

  // updateTransaction() {
  //   if (this.selectedTransaction && this.selectedTransaction.details) {
  //     const updates: any[] = [];
  //     const newEntries: any[] = [];
  //     const addservices: any[] = [];
  //     const removedServicess: string[] = [];

  //     // if(this.selectedservices.rush === true){
  //     //   this.servicesUpd.push('')
  //     // }
  //     console.log(this.removedServices);
      

  //     const transacStatus = this.selectedTransaction.Transac_status || 'Pending';
      
  //     console.log(this.servicesUpd)
  //     // Prepare data for updates, new additions, and deletions
  //     this.selectedTransaction.details.forEach((detail: any) => {
  //       if (detail.TransacDet_ID) {
  //         updates.push({
  //           TransacDet_ID: detail.TransacDet_ID,
  //           Categ_ID: detail.Categ_ID,
  //           Qty: detail.Qty,
  //           Transac_status: transacStatus,
  //           Transac_ID: this.selectedTransaction.trans_ID,
  //         });
        
  //         this.servicesUpd.forEach((services: any) => {
  //           addservices.push({
  //             Transac_ID: this.selectedTransaction.trans_ID,
  //             Addservices_name: services
  //           });
  //         });
        
  //       } else {
  //         newEntries.push({
  //           Categ_ID: detail.Categ_ID,
  //           Qty: detail.Qty,
  //           Tracking_Number: this.selectedTransaction.track_num
  //         });

  //       }


  //       console.log(addservices);
        
  //       // Send updates to the server
  //       if (updates.length > 0) {
  //         this.post.updatetransac({ updates }).subscribe((result: any) => {
  //           console.log('Update result:', result);
  //           this.fetchtransactions();
  //           this.closeModal();
  //         });
  //       }

  //       if (addservices.length > 0) {
  //         this.post.updatetransac({ addservices }).subscribe((result: any) => {
  //           console.log('Services result:', result);
  //           this.fetchtransactions();
  //           this.closeModal();
  //         });
  //       }
        
  //       // Send new entries to the server
  //       if (newEntries.length > 0) {
  //         this.post.insertNewDetails(newEntries).subscribe((result: any) => {
  //           console.log('Insert result:', result);
  //           this.fetchtransactions();
  //           this.closeModal();
  //         });
  //       }

  //       if(this.removedServices.length > 0) {
  //         this.post.removeServices(this.selectedTransaction.trans_ID, this.removedServices).subscribe((result: any) => {
  //           console.log('Deleted result:', result);
  //           this.fetchtransactions();
  //           this.closeModal();
  //         });
  //       }
        
  //       // Send deleted entries to the server
  //       if (this.deletedDetails.length > 0) {
  //         this.post.deleteDetails(this.deletedDetails).subscribe((result: any) => {
  //           console.log('Deleted result:', result);
  //           this.fetchtransactions();
  //           this.closeModal();
  //         });
  //       }
        
  //       // Update the transaction status in the transactions table
  //       if (this.selectedTransaction.Tracking_number) {
  //         this.post.updateTransactionStatus(this.selectedTransaction.Tracking_number, transacStatus).subscribe((result: any) => {
  //           console.log('Transaction status updated:', result);
  //         });
  //       }
        
  //       this.fetchtransactions();  // Refresh transactions after all operations
  //     }       
  //   )}
  // }


  updateTransaction() {
    if (this.selectedTransaction && this.selectedTransaction.details) {
      let hasErrorOccurred = false;
      let pendingRequests = 0;  // To track the number of pending requests
  
      const updates: any[] = [];
      const newEntries: any[] = [];
      const addservices: any[] = [];
      const removedServicess: string[] = [];
      const transacStatus = this.selectedTransaction.Transac_status || 'Pending';
  
      // Use a Set to ensure unique services
      const uniqueServices = new Set();
  
      // Prepare data for updates, new additions, and deletions
      this.selectedTransaction.details.forEach((detail: any) => {
        if (detail.TransacDet_ID) {
          // Prepare update for transaction details
          updates.push({
            TransacDet_ID: detail.TransacDet_ID,
            Categ_ID: detail.Categ_ID,
            Qty: detail.Qty,
            Transac_status: transacStatus,
            Transac_ID: this.selectedTransaction.trans_ID,
          });
  
          // Add services to the Set (to ensure uniqueness)
          this.servicesUpd.forEach((service: any) => {
            uniqueServices.add(service);
          });
        } else {
          // Handle new entries
          newEntries.push({
            Categ_ID: detail.Categ_ID,
            Qty: detail.Qty,
            Tracking_Number: this.selectedTransaction.track_num
          });
        }
      });
  
      // Convert Set to array for addservices
      uniqueServices.forEach((service: any) => {
        addservices.push({
          Transac_ID: this.selectedTransaction.trans_ID,
          Addservices_name: service
        });
      });
  
      // Function to check if all requests have completed
      const checkAllRequestsCompleted = () => {
        pendingRequests--;
        if (pendingRequests === 0) {
          if (!hasErrorOccurred) {
            this.closeModal();  // Close the modal only if no errors occurred
          }
        }
      }
  
      // Handle updates
      if (updates.length > 0) {
        pendingRequests++;  // Increment the counter for pending requests
        this.post.updatetransac({ updates }).subscribe(
          (result: any) => {
            console.log('Update result:', result);
            this.fetchtransactions();
            checkAllRequestsCompleted();
          },
          (error: any) => {
            console.error('Error in updating transaction:', error);
            if (error.status === 422) {
              this.errormessage = 'Fill the Fields';
            }
            hasErrorOccurred = true;  // Mark that an error occurred
            checkAllRequestsCompleted();
          }
        );
      }
  
      // Send addservices to the server only once
      if (addservices.length > 0) {
        pendingRequests++;  // Increment the counter for pending requests
        this.post.updatetransac({ addservices }).subscribe(
          (result: any) => {
            console.log('Services result:', result);
            this.fetchtransactions();
            checkAllRequestsCompleted();
          },
          (error: any) => {
            console.error('Error in updating services:', error);
            if (error.status === 422) {
              this.errormessage = 'Fill the Fields';
            }
            hasErrorOccurred = true;  // Mark that an error occurred
            checkAllRequestsCompleted();
          }
        );
      }
  
      // Send new entries to the server only once
      if (newEntries.length > 0) {
        pendingRequests++;  // Increment the counter for pending requests
        this.post.insertNewDetails(newEntries).subscribe(
          (result: any) => {
            console.log('Insert result:', result);
            this.fetchtransactions();
            checkAllRequestsCompleted();
          },
          (error: any) => {
            console.error('Error in inserting new details:', error);
            if (error.status === 422) {
              this.errormessage = 'Fill the Fields';
            }
            hasErrorOccurred = true;  // Mark that an error occurred
            checkAllRequestsCompleted();
          }
        );
      }
  
      // Handle removal of services
      if (this.removedServices.length > 0) {
        pendingRequests++;  // Increment the counter for pending requests
        this.post.removeServices(this.selectedTransaction.trans_ID, this.removedServices).subscribe(
          (result: any) => {
            console.log('Deleted result:', result);
            this.fetchtransactions();
            checkAllRequestsCompleted();
          },
          (error: any) => {
            console.error('Error in removing services:', error);
            hasErrorOccurred = true;  // Mark that an error occurred
            checkAllRequestsCompleted();
          }
        );
      }
  
      // Handle deleted entries
      if (this.deletedDetails.length > 0) {
        pendingRequests++;  // Increment the counter for pending requests
        this.post.deleteDetails(this.deletedDetails).subscribe(
          (result: any) => {
            console.log('Deleted result:', result);
            this.fetchtransactions();
            checkAllRequestsCompleted();
          },
          (error: any) => {
            console.error('Error in deleting details:', error);
            hasErrorOccurred = true;  // Mark that an error occurred
            checkAllRequestsCompleted();
          }
        );
      }
    }
  }
  



  // showDetails(Tracking_number: any, transaction: any, transId: any) {
  //   this.selectedservices = {
  //     rush: false,
  //     pick: false,
  //     deliver: false,
  //   };

  //   // First, set selectedTransaction based on the passed transaction
  //   this.selectedTransaction = { ...transaction }; // Create a copy of the transaction
  //   this.service = this.selectedTransaction.Addservice_name
  //   console.log('Selected transaction:', this.selectedTransaction);
  //   console.log(this.service)
  //   console.log(this.selectedTransaction)

  //   if (this.service) {
  //     this.servicesUpd = this.service.split(", ").map((service: string) => service.trim());
  //   }

  //   console.log(this.servicesUpd);

  //   // Then, fetch the details and add them to the selected transaction
  //   this.post.displayDet(Tracking_number).subscribe((res: any) => { 
  //     this.selectedTransaction.details = res; // Assign details separately
  //     console.log('Transaction details:', this.selectedTransaction.details);
  //     console.log(res)

  //     // Now open the modal
  //     const modalElement = document.getElementById('updateModal');
  //     if (modalElement) {
  //       const modal = new bootstrap.Modal(modalElement);
  //       modal.show();
  //     }
  //   });

  //   this.updateSelectedService();
  // }


  showDetails(Tracking_number: any, transaction: any, transId: any) {
    this.selectedservices = {
      rush: false,
      pick: false,
      deliver: false,
    };
  
    // First, set selectedTransaction based on the passed transaction
    this.selectedTransaction = { ...transaction }; // Create a copy of the transaction
    this.service = this.selectedTransaction.Addservice_name;
  
    console.log('Selected transaction:', this.selectedTransaction);
    console.log(this.service);
    console.log(this.selectedTransaction);
  
    if (this.service) {
      this.servicesUpd = this.service.split(", ").map((service: string) => service.trim());
    }
  
    console.log(this.servicesUpd);
  
    // Clear existing details to avoid duplication before fetching new data
    this.selectedTransaction.details = []; // Clear the details array before assigning new data
  
    // Then, fetch the details and add them to the selected transaction
    this.post.displayDet(Tracking_number).subscribe((res: any) => {
      if (res && Array.isArray(res)) {
        // Deduplicate the details before assigning
        const uniqueDetails = res.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.TransacDet_ID === value.TransacDet_ID // Ensure unique by TransacDet_ID or another unique field
          ))
        );
  
        // Assign the unique details to selectedTransaction
        this.selectedTransaction.details = uniqueDetails;
        console.log('Transaction details:', this.selectedTransaction.details);
        console.log(res);
  
        // Now open the modal
        const modalElement = document.getElementById('updateModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      } else {
        console.log('No details returned or data format invalid');
      }
    });

    this.post.showaddress(this.id.cuid).subscribe((res:any)=>{
      this.address = res;
      console.log(res)
    })
  
    this.updateSelectedService();
  }
  


 


  updateSelectedService(): void {

    // Update the selectedservices object based on servicearray content
    if (this.servicesUpd.includes('Rush Job')) {
      this.selectedservices.rush = true;
    }
    if (this.servicesUpd.includes('Pick-Up Service')) {
      this.selectedservices.pick = true;
      this.selectAddPick = true;
    }
    if (this.servicesUpd.includes('Delivery-Service')) {
      this.selectedservices.deliver = true;
      this.selectAddDel = true;
    }

    console.log(this.selectedservices)
  }

  // onCheckboxChange(service: string, event: any): void {
  //   // If the checkbox is unchecked, add the service to the removedServices array
  //   if (!event.target.checked) {
  //     if (!this.removedServices.includes(service)) {
  //       this.removedServices.push(service);  // Add service name to removedServices if it's unchecked
  //     }
  //   } else {
  //     // If the checkbox is checked again, remove the service from removedServices
  //     const index = this.removedServices.indexOf(service);
  //     if (index !== -1) {
  //       this.removedServices.splice(index, 1);  // Remove the service from the array
  //     }
  //   }

  //   if (event.target.checked) {
  //     // If the checkbox is checked, add the service to servicesUpd if it's not already there
  //     if (!this.servicesUpd.includes(service)) {
  //       this.servicesUpd.push(service);  // Add service to servicesUpd if it's checked
  //     }
  //   } else {
  //     // If the checkbox is unchecked, remove the service from servicesUpd
  //     const index = this.servicesUpd.indexOf(service);
  //     if (index !== -1) {
  //       this.servicesUpd.splice(index, 1);  // Remove the service from servicesUpd
  //     }
  //   }

    
  //   console.log('Added Services:', this.servicesUpd);
  //   console.log('Removed services:', this.removedServices);
  // }

  getShippingAddress(){
    this.post.getShippingAddress().subscribe((result: any) => {
      this.townAddresses = result.shippings;
      console.log(this.townAddresses);
    });
  }

  onCheckboxChange(service: string, event: any): void {
    const isChecked = event.target.checked;
    const selServ = service;
  
    // Update the selected services
    if (isChecked) {
      // Add the service to `servicesUpd` if it's checked
      if (!this.servicesUpd.includes(service)) {
        this.servicesUpd.push(service);
      }
  
      // Display the additional form inputs based on the service
      if (selServ === 'PickUp-Service') {
        this.selectAddPick = true;
      } else if (selServ === 'Delivery-Service') {
        this.selectAddDel = true;
      }
    } else {
      // Remove the service from `servicesUpd` if it's unchecked
      const index = this.servicesUpd.indexOf(service);
      if (index !== -1) {
        this.servicesUpd.splice(index, 1);
      }
  
      // Hide the additional form inputs if the service is unchecked
      if (selServ === 'PickUp-Service') {
        this.selectAddPick = false;
      } else if (selServ === 'Delivery-Service') {
        this.selectAddDel = false;
      }
    }
  
    // Update the removedServices array
    if (!isChecked) {
      if (!this.removedServices.includes(service)) {
        this.removedServices.push(service);
      }
    } else {
      const index = this.removedServices.indexOf(service);
      if (index !== -1) {
        this.removedServices.splice(index, 1);
      }
    }
  
    console.log('Updated Services:', this.servicesUpd);
    console.log('Removed Services:', this.removedServices);
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
        this.errormessage = null;  // Clear any error message when closing the modal
      } else {
        const newModal = new bootstrap.Modal(modalElement);
        newModal.hide();
        this.errormessage = null;  // Clear any error message when closing the modal
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
      Qty: null, // Default quantity
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

  calculateTotalQuantity() {
    // Ensure all quantities are summed correctly from the details
    let totalQty = 0;
    if (this.selectedTransaction && this.selectedTransaction.details) {
      this.selectedTransaction.details.forEach((detail: any) => {
        totalQty += detail.Qty;
        console.log(totalQty)
      });
    }
    return totalQty;
  }
  
  updateStatus(id: any){
    this.user.updateStatus(id).subscribe(
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
    const tracknum = this.Tracking_Number;
    console.log(tracknum);
  
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
  
  
}
