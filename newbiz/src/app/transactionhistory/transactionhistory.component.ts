import { Component, OnInit } from '@angular/core';

import { User, UserService, TransactionService, Transaction, Product, UtilsService, Payment, LocationService } from 'benowservices';

@Component({
  selector: 'app-transactionhistory',
  templateUrl: './transactionhistory.component.html',
  styleUrls: ['./transactionhistory.component.css']
})
export class TransactionhistoryComponent implements OnInit {

  dashboard: string = '/dashboard';
  searchText: string;
  detailsExpanded: boolean = false;
  user: User;
  transactions: Transaction;
  payments: Array<Payment>;
  products: Array<Product>;
  selectedId: string ;

  constructor(private locationService: LocationService, private userService: UserService, private transactionService: TransactionService, private utilsService: UtilsService) { }

  ngOnInit() {
    this.locationService.setLocation('transactionhistory');
    this.userService.getUser()
      .then(res => this.init(res));
  }

  init(res: any){
    this.user = res;
    console.log(this.utilsService.getLastYearDateString(),
      this.utilsService.getCurDateString());
    this.transactionService.getProductTransactions(this.user.merchantCode, this.utilsService.getLastYearDateString()+" 00:00:00",
      this.utilsService.getCurDateString()+" 23:59:59", 1)
      .then(tres => this.updateTransactions(tres));
  }

  updateTransactions(res: Transaction){
    this.transactions = res;
    this.payments = res.payments;

    console.log(this.transactions, 'Payments', this.payments);
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

  changeIconMob(){
    let a: any = document.getElementById('advanceMob');
    a.click();
    this.arrowChange('a');
  }

}
