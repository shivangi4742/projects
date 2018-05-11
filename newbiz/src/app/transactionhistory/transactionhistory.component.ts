import { Component, OnInit,  EventEmitter } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

import { TranslateService } from 'ng2-translate';
import { MaterializeAction } from 'angular2-materialize';

import { User, UserService, TransactionService, Transaction,ProductService,  Product, UtilsService, Payment, LocationService,
  SDKService } from 'benowservices';

@Component({
  selector: 'app-transactionhistory',
  templateUrl: './transactionhistory.component.html',
  styleUrls: ['./transactionhistory.component.css']
})
export class TransactionhistoryComponent implements OnInit {
  paymnt:Payment;
  dashboard: string = '/dashboard';
  searchText: string;
  detailsExpanded: boolean = false;
  user: User;
  transactions: Transaction;
  payments: Array<Payment>;
  products: Array<Product>;
  selectedId: string;
  numPages: number = 0;
  numTransactions: number = 0;
  totalAmount: number;
  page: number = 1;
  processing: boolean = false;
  processingCSV: boolean = false;
  mtype: number = 1;
  encUri: string;
  successCSV: boolean = false;
  seemodalActions: any = new EventEmitter<string|MaterializeAction>();
  constructor(private locationService: LocationService, private userService: UserService, private transactionService: TransactionService,
              private utilsService: UtilsService, private sanitizer: DomSanitizer, private productservice: ProductService,
              private translate: TranslateService, private sdkService: SDKService) { }

  ngOnInit() {
    this.locationService.setLocation('transactionhistory');
    this.userService.getUser()
      .then(res => this.init(res));
  }

  init(res: any){
    this.user = res;

    if(this.utilsService.isHB(this.user.merchantCode, this.user.lob)){
      this.mtype = 3;
    }

    this.processing = true;
    this.transactionService.getProductTransactions(this.user.merchantCode, this.utilsService.getLastYearDateString()+" 00:00:00",
      this.utilsService.getCurDateString()+" 23:59:59", this.page)
      .then(tres => this.updateTransactions(tres));
  }

  hasTransactions(): boolean {
    if(this.payments && this.payments.length > 0){
      return true;
    }

    return false;
  }

  updateTransactions(res: Transaction){
    if(res) {
      this.transactions = res;
      this.numPages = res.numPages;
      this.numTransactions = res.numPayments;
      this.totalAmount = res.totalAmount;
      this.payments = res.payments;
    }
    else {
      this.payments = null
    }
    this.processing = false;

  }

  next() {
    this.payments = null;
    this.numPages = 0;
    this.processing = true;
    window.scrollTo(0, 0);
    this.transactionService.getProductTransactions(this.user.merchantCode, this.utilsService.getLastYearDateString()+" 00:00:00",
      this.utilsService.getCurDateString()+" 23:59:59", (++this.page))
      .then(res => this.updateTransactions(res));
  }

  previous() {
    this.payments = null;
    this.numPages = 0;
    this.processing = true;
    window.scrollTo(0, 0);
    this.transactionService.getProductTransactions(this.user.merchantCode, this.utilsService.getLastYearDateString()+" 00:00:00",
      this.utilsService.getCurDateString()+" 23:59:59", (--this.page))
      .then(res => this.updateTransactions(res));
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

  isSelected(id) {
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

  resetTick(){
    this.successCSV = false;
  }

  sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  downloadCSV(check: number) {
    let id: string = 'reportDownloadMobBN';
    if(check == 1){
      id = 'reportDownloadBN';
    }
    else if(check == 2){
      id = 'reportDownloadMobBN';
    }
    if (!this.processingCSV) {
      this.encUri = '';
      this.processingCSV = true;
      if (this.mtype == 3)
        this.transactionService.getAllProductTransactions(this.user.merchantCode,this.utilsService.getLastYearDateString()+" 00:00:00",
          this.utilsService.getCurDateString()+" 23:59:59", 1)
          .then(res => this.createMyBizCSV(res, id));
      else{
        console.log('Not a HB');
      }
    }
  }

  printReceipt(txn: Payment) {
    this.sdkService.getInvoice(this.user.merchantCode, txn.id);
  }

  createMyBizCSV(res: Transaction, id:string) {
    if (res && res.payments && res.payments.length > 0) {
      let data: any = [['Transaction ID', 'From', 'Amount', 'Mode', 'Payment Date', 'Phone', 'E-Mail', 'PIN Code', 'City', 'State', 'Address', 
        'Products']];

      for (var t of res.payments) {
        let prods: string = '';
        if (t && t.products && t.products.length > 0) {
          for (var p of t.products)
            prods += p.qty + '  ' + (p.uom ? p.uom : '') + '  ' + p.name + '\n';

          if (prods && prods.length > 1)
            prods = prods.substring(0, prods.length - 1);
        }

        let dt: Date = new Date(t.dateAndTime);
        data.push([t.tr, t.vPA, t.amount.toFixed(2), t.mode, this.utilsService.getDTStr(dt), '"' + t.phone + '"', t.email, t.pin, t.city, 
          t.state, t.address, '"' + prods + '"']);
      }

      let csvContent: string = "data:text/csv;charset=utf-8,";
      data.forEach(function (infoArray: string[], index: number) {
        let dataString: string = infoArray.join(",");
        csvContent += index < data.length ? dataString + "\n" : dataString;
      });

      this.encUri = encodeURI(csvContent);
      let me = this;
      setTimeout(function () { let a: any = document.getElementById(id); a.click(); me.processingCSV = false; me.successCSV = true; }, 300);
    }
    else {
      console.log('CSV generation Error');
      window.scrollTo(0, 0);
      this.processingCSV = false;
      this.successCSV = false;
    }
  }
  seedetails(res: any) {
   console.log(res);
    this.paymnt = res;
     this.productservice.getProductsForTransaction('', res.id)
       .then(res => this.selecting(this.paymnt));
  }
  selecting(res:any){
     this.transactionService.setSelPayment(res)
     .then(res => this.selected());
     
  }
  selected(){
    this.seemodalActions.emit({ action: "modal", params: ['open'] });
  }

   getSelPayment(): Payment {
    return this.transactionService.getSelPayment();
  }

}
