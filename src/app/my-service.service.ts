import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {
  url = "http://localhost/CustomerS2K/";
  // Apiurl="http://localhost:8000/api/";
  Apiurl="http://192.168.3.85:8000/api/";
  // Apiurl="http://10.0.118.64:8000/api/";


  public post: any[] = [];
  trans: any;

  constructor(
    private http: HttpClient
  ) { }

  displaycategory(){
    return this.http.get(this.Apiurl + 'getlist');
  }

  display(id: any){
    // return this.http.get(this.Apiurl + 'display', id);
    return this.http.get(`${this.Apiurl}display/${id}`)
  }

  addtrans(data: any){
    console.log(data);
    return this.http.post(this.Apiurl + 'addtrans', data);
  }
  updatetrans(data: any){
    return this.http.get(`${this.Apiurl}cancelTrans/${data}`)
  }
  updateStatus(data: any){
    return this.http.get(`${this.Apiurl}updateStatus/${data}`)
  }

  // insertorder(idata:any,Tracking_number:any,qty:any){
  //   const data = {
  //     laundry: this.post,
  //     id:idata,
  //     qty: qty,
  //     Tracking_number:Tracking_number
  //   }
  //   console.log(data);
  //   return this.http.post(this.url + 'insertorder.php', JSON.stringify(data));
  // }

  // checklogin(log: any){
  //   return this.http.post(this.url + 's2klogin.php',JSON.stringify(log));
  // }
  login(data: any){
    return this.http.post(this.Apiurl + 'login',data);
  }

  logout(headers: any){
    localStorage.removeItem('token');
    // const headers = new HttpHeaders().set('Authorization',`Bearer $(token)`);
    return this.http.post(this.Apiurl + 'logout', {}, {headers});
  }

  displaycateg(){
    return this.http.get(this.url + 's2kdisplaycategory.php');
  }
  getTrackingNumber() {
    return this.http.get(this.url + 'generate_tracking.php');
  }
  // showhis(gdata:any){
  //   return this.http.get(this.url + 'get_history.php?cust_id='+ gdata);
  // }
  // displaytransaction() {
  //   return this.http.get(this.Apiurl + 'display');
  // }
  showdetail(tid:any){
    return this.http.get(this.url + 'showdet.php?transac_id=' + tid);
  }

  // getcustomerdata(data:any){
  //   return this.http.get(this.url + 'getcustomer.php?id=' + data);
  // }

  updatecus(udata:any){
    return this.http.post(`${this.Apiurl}updateCus`,udata);
  }

  // gentracknum(){
  //   return this.http.get(this.url + 'tracknum.php');
  // }

  insertNewDetails(newEntries: { Categ_ID: number, Qty: number, Tracking_number: string }[]): Observable<any> {
    return this.http.post(`${this.Apiurl}insertDetails`, newEntries);
  }


  deleteDetails(deletedEntries: number[]): Observable<any> {
    return this.http.delete(`${this.Apiurl}deleteDetails`,{body: { deletedEntries } });
  }


  updateTransactionStatus(trackingNumber: string, transacStatus: string): Observable<any> {
    return this.http.post(`${this.Apiurl}insertDetails`,{ Tracking_number: trackingNumber, Transac_status: transacStatus });
  }

  displayDet(data:any):Observable<any>{
    return this.http.get(`${this.Apiurl}displayDet/${data}`);
  }

  updatetransac(data: any){
    return this.http.post(`${this.Apiurl}updatetrans/`, data);
  }

  displayTransac(data:any):Observable<any>{
    return this.http.get(`${this.Apiurl}getDetails/${data}`);
  }

  addcustomer(data: any){
    return this.http.post(this.Apiurl + 'addcustomer',data)
  }

  getcustomer(data:any){
    return this.http.get(`${this.Apiurl}getcustomer/${data}`);
  }
  getTransId(id:any):Observable<any>{
    return this.http.get(`${this.Apiurl}getTransId/${id}`);
  }

  getDetails(id:any){
    return this.http.get(`${this.Apiurl}getDetails/${id}`);
  }
  gethis(id:any):Observable<any>{
    return this.http.get(`${this.Apiurl}gethis/${id}`)
  }

  getTrackingNo(){
    return this.http.get(this.Apiurl + 'getTrackingNo');
  }

  checkPaymentExists(transactionId: any): Observable<any> {
    return this.http.get(`${this.Apiurl}checkPaymentExists/${transactionId}`);
  }

  checkPriceExists(transactionId:any):Observable<any>{
    return this.http.get(`${this.Apiurl}checkPriceExists/${transactionId}`);
  }

  getShippingAddress():Observable<any>{
    return this.http.get(`${this.Apiurl}getShippingAddress`);
  }

  getshippingprice(id:any):Observable<any>{
    return this.http.get(`${this.Apiurl}getshippingprice/${id}`);
  }

  removeServices(Transac_ID: number, removedServices: string[]): Observable<any> {
    const data = {
      Transac_ID: Transac_ID,
      removed_services: removedServices,
    };

    // Make the HTTP POST request to the Laravel API
    return this.http.post(this.Apiurl + 'removeServices', data);
  }

  insertaddress(data:any):Observable<any>{
    console.log(data);
    return this.http.post(this.Apiurl + 'insertaddress',data);
  }

  showaddress(id:any):Observable<any>{
    return this.http.get(`${this.Apiurl}showaddress/${id}`);
  }

  deleteaddress(id:any):Observable<any>{
    return this.http.delete(`${this.Apiurl}deleteaddress/${id}`);
  }

  addAddress(data: any): Observable<any> {
    console.log(data);
    return this.http.post(this.Apiurl + 'addddress', data);  // Fixed method name
  }

  displayCustomer(id:any):Observable<any>{
    return this.http.get(`${this.Apiurl}displayCustomer/${id}`);
  }

}
