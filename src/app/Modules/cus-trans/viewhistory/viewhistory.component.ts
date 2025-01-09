import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-viewhistory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viewhistory.component.html',
  styleUrl: './viewhistory.component.css'
})
export class ViewhistoryComponent implements OnInit {
onSearch($event: Event) {
throw new Error('Method not implemented.');
}
  id = localStorage.getItem("Cust_ID");
  histf: any[] = []; // Original data
  filteredHist: any[] = []; // Filtered data for display
  paginatedHist: any[] = []; // Data for the current page
  currentPage: number = 1;
  rowsPerPage: number = 15; // Number of rows per page
  totalPages: number = 1;
  totalPagesArray: number[] = []; // Array to generate pagination buttons
  currentFilter: any;

  constructor(private post: MyServiceService, private router: Router) {}

  ngOnInit(): void {
      this.post.gethis(this.id).subscribe((data: any) => {
          this.histf = data;
          this.filteredHist = this.histf; // Initialize filtered data
          this.updatePagination();
      });
      console.log()
  }

  filterStatus(status: string): void {
    if (status === 'All') {
        this.filteredHist = this.histf;
    } else if (status === 'Pending') {
        this.filteredHist = this.histf.filter(item => item.latest_transac_status === "pending");
    } else if (status === 'received') {
        this.filteredHist = this.histf.filter(item => item.latest_transac_status === "received");
    } else if (status === 'Washing') {
        this.filteredHist = this.histf.filter(item => item.latest_transac_status === "washing");
    }else if (status === 'Folding') {
        this.filteredHist = this.histf.filter(item => item.latest_transac_status === "folding");
    }else if (status === 'for Release') {
        this.filteredHist = this.histf.filter(item => item.latest_transac_status === "forRelease");
    }else if (status === 'completed') {
        this.filteredHist = this.histf.filter(item => item.latest_transac_status === "completed");
    }
    else if (status === 'Cancelled') {
        this.filteredHist = this.histf.filter(item => item.latest_transac_status === "cancel");
    }
    else {
        this.filteredHist = this.histf.filter(h => h.Transac_status === status);
    }
    this.currentPage = 1; // Reset to the first page
    this.updatePagination();
  }

  updatePagination(): void {
      this.totalPages = Math.ceil(this.filteredHist.length / this.rowsPerPage);
      this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      const startIndex = (this.currentPage - 1) * this.rowsPerPage;
      const endIndex = startIndex + this.rowsPerPage;
      this.paginatedHist = this.filteredHist.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
      if (page < 1 || page > this.totalPages) return; // Prevent invalid page changes
      this.currentPage = page;
      this.updatePagination();
  }

//   viewItem(data: any): void {
//       this.post.getTransId(data).subscribe((result: any) => {
//           localStorage.setItem('temp_ID', data);
//           this.router.navigate(['/main/maintrans/maintrans/panel/historydetails']);
//       });
//   }
viewItem(data: any): void {
    // Implement logic to view details of the item based on tracking number
    console.log(data);
    localStorage.setItem('trans_ID', data)
    this.router.navigate(['/main/maintrans/maintrans/panel']);
  }
}
