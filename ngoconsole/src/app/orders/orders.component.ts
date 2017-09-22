import { Component, OnInit } from '@angular/core';

import { UtilsService, User, UserService, Product, Transaction, TransactionService, Status, ProductService } from 'benowservices';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  lastTxnId: string;
  user: User;
  products: Array<Product>;
  transactions: Array<Transaction>;
  mtype: number = 2;

  constructor(private utilsService: UtilsService, private userService: UserService, private transactionService: TransactionService,
    private productService: ProductService) { }

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
      this.fillTransProductImages();
    }    

    let me: any = this;
    setTimeout(function() { me.poll(); }, 2000);
  }

  fillTransProductImages() {
    for(let i: number = 0; i < this.transactions.length; i++) {
      for(let j: number = 0; j < this.transactions[i].products.length; j++) {
        if(this.products && this.products.length > 0 && !this.transactions[i].products[j].imageURL 
          || this.transactions[i].products[j].imageURL.length <= 0) {
          for(let k: number = 0; k < this.products.length; k++) {
            if(this.products[k].name == this.transactions[i].products[j].name && this.products[k].price == this.transactions[i].products[j].price
              && this.products[k].uom == this.transactions[i].products[j].uom)
              this.transactions[i].products[j].imageURL = this.products[k].imageURL;
          }
        }
      }
    }
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
      this.fillTransProductImages();
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

      this.productService.getProducts(this.user.merchantCode)
        .then(pres => this.products = pres);
      this.transactionService.getProductTransactions(this.user.merchantCode, this.utilsService.getLastYearDateString() + ' 00:00:00',
        this.utilsService.getNextYearDateString() + ' 23:59:59', 1)
        .then(tres => this.initTrans(tres));
    }
  }

}
