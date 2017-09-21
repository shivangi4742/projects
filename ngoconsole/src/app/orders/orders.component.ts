import { Component, OnInit } from '@angular/core';

import { UtilsService, User, UserService, Product, Transaction, TransactionService, Status } from 'benowservices';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  lastTxnId: string;
  user: User;
  transactions: Array<Transaction>;
  mtype: number = 2;

  constructor(private utilsService: UtilsService, private userService: UserService, private transactionService: TransactionService) { }

  ngOnInit() {
    this.utilsService.setStatus(false, false, '');
    this.userService.getUser()
      .then(res => this.initUser(res));
  }

  newOrders(res: Array<Transaction>) {
    if(res && res.length > 0) {
      for(let i: number = res.length - 1; i >= 0; i--)
        this.transactions.splice(0, 0, res[i]);

      this.lastTxnId = this.transactions[0].id;
    }    

    let me: any = this;
    setTimeout(function() { me.poll(); }, 2000);
  }

  poll() {
    this.transactionService.getNewProductTransactions(this.user.merchantCode, this.utilsService.getLastYearDateString() + ' 00:00:00',
        this.utilsService.getNextYearDateString() + ' 23:59:59', 1, this.lastTxnId)
        .then(res => this.newOrders(res));
  }

  initTrans(res: Array<Transaction>) {
    if(res && res.length > 0) {
      this.transactions = res;
      this.lastTxnId = this.transactions[0].id;
    }

    let me: any = this;
    setTimeout(function() { me.poll(); }, 2000);
  }

  getStatus(): Status {
    return this.utilsService.getStatus();
  }

  initUser(res: User) {
    if(res && res.id) {
      this.user = res;
      if(this.utilsService.isHB(this.user.merchantCode))
        this.mtype = 3;

      this.transactionService.getProductTransactions(this.user.merchantCode, this.utilsService.getLastYearDateString() + ' 00:00:00',
        this.utilsService.getNextYearDateString() + ' 23:59:59', 1)
        .then(tres => this.initTrans(tres));
    }
  }

}
