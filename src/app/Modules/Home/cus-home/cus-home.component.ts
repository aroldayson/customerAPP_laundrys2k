import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MyServiceService } from '../../../my-service.service';

@Component({
  selector: 'app-cus-home',
  standalone: true,
  imports: [RouterLink,RouterModule],
  templateUrl: './cus-home.component.html',
  styleUrl: './cus-home.component.css'
})


export class CusHomeComponent {
  // constructor(
  //   private user: MyServiceService){}
  // post = inject(MyServiceService);

  // gentrack() {
  //   this.post.getTrackingNo().subscribe((data:any)=>{
  //     this.Tracking_Number = data;

  //     this.route.navigate(['/main/cusmainhome/homemain/newcurtrans']);
  //     console.log(this.Tracking_Number);
  //   })
  // }
}
