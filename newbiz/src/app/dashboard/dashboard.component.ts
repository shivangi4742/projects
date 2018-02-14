import { Component, OnInit } from '@angular/core';

import { LocationService, User, UserService, Transaction, Payment, TransactionService, UtilsService } from 'benowservices';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  chargeFee: boolean = false;
  transactionHistory: string = '/transactionhistory';
  user: User;
  transactions: Transaction;
  payments: Array<Payment>;
  detailsExpanded: boolean = false;
  selectedId: string;
  page: number = 1;
  numPayments: number = 0;
  totalAmount: number = 0;
  processing: boolean = false;
  selPayments: Array<Payment>;
  displayTransactions: number = 3;

  constructor(private locationService: LocationService, private userService: UserService, private utilsService: UtilsService,
              private transactionService: TransactionService) { }

  ngOnInit() {
    this.locationService.setLocation('dashboard');

    this.userService.getUser()
      .then(res => this.init(res));
  }

  init(res: User){
    this.user = res;
    this.processing = true;

    this.transactionService.getProductTransactions(this.user.merchantCode, this.utilsService.getLastYearDateString()+" 00:00:00",
      this.utilsService.getCurDateString()+" 23:59:59", this.page)
      .then(tres => this.updateTransactions(tres));
  }

  updateTransactions(res: Transaction){
    this.selPayments = null;
    if(res && res.payments){
      this.transactions = res;
      this.payments = res.payments;
      let pmnts = new Array<Payment>();

      if(this.payments && this.payments.length < this.displayTransactions){
        this.displayTransactions = this.payments.length;
      }

      for(let i:number = 0; i < this.displayTransactions; i++){
        pmnts.push(new Payment(res.payments[i].hasCashback, res.payments[i].amount, res.payments[i].status, res.payments[i].cbAmount,
          res.payments[i].id, res.payments[i].tr, res.payments[i].till, res.payments[i].mode, res.payments[i].vPA,
          res.payments[i].merchantVPA, res.payments[i].dateAndTime, res.payments[i].cbTid, res.payments[i].cbMode, res.payments[i].hasProducts,
          res.payments[i].products, res.payments[i].email, res.payments[i].phone, res.payments[i].address, res.payments[i].description));
      }
      this.selPayments = pmnts;
      this.numPayments = this.transactions.numPayments;
      this.totalAmount = this.transactions.totalAmount;
    }

    this.processing = false;
  }

  hasTransactions(): boolean {
    if(this.selPayments && this.selPayments.length > 0){
      return true;
    }

    return false;
  }

  arrowChange(id: any){
    if(this.selectedId == id){
      this.detailsExpanded = !this.detailsExpanded;
    }
    else{
      this.detailsExpanded = true;
    }
    this.selectedId = id;
  }

  isSelected(id){
    if(this.selectedId == id)
      return true;

    return false;
  }

  changeIcon(id: any){
    let a: any = document.getElementById(id);
    a.click();
    this.arrowChange(id);
  }

  checkClass(i: number, id: any):string {
    let className: string = 'collapsible-header noLeftMarginBN collapsibleHeadBN';
    if(i%2 == 0){
      className = 'collapsible-header noLeftMarginBN accordionHeaderBN collapsibleHeadBN';

      if(this.isSelected(id) && this.detailsExpanded){
        className = 'collapsible-header noLeftMarginBN accordionHeaderBN collapsibleHeadRedBN';
      }
    }
    else{
      if(this.isSelected(id) && this.detailsExpanded){
        className = 'collapsible-header noLeftMarginBN collapsibleHeadRedBN';
      }
    }

    return className;
  }

}
