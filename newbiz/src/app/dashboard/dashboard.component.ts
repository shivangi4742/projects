import { Component, OnInit, EventEmitter, AnimationKeyframe } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LocationService, User, UserService, ProductService, Accountpro, Businesspro, CampaignService, Transaction, Payment, TransactionService, UtilsService } from 'benowservices';
import { MaterializeAction } from 'angular2-materialize';

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
  dateRange: number = 1;
  paymnt: Payment;
  businesspro: Businesspro;
  storeurl: string;
  streurl: string;
  isCopied1: boolean = false;
  isCopied2: boolean = false;
  smsucess: boolean = false;
  emailtext: boolean = false;
  strshare: boolean = false;
  payshare: boolean = false;
  storeshare: boolean = false;
  subject: string;
  urlstore: string;
  streurlpay: string;
  email: string;
  mobileNumber: string;
  smstext: boolean = false;
  prodId: string;
  text: string;
  suceessmsg: boolean = false;
  url: string;
  formLoaded: boolean = true;
  streurlpre: string;
  streurlpaypre : string;
  urlstorepre : string;
  errorMobileNumber: boolean= false;
  errorMobMsg: string|null;
  errorEmailId: boolean = false;
  errorEmailMsg: string|null;
  seemodalActions: any = new EventEmitter<string | MaterializeAction>();
  sharemodalActions: any = new EventEmitter<string | MaterializeAction>();
  sharelinkurlmodalActions: any = new EventEmitter<string | MaterializeAction>();
  constructor(private locationService: LocationService, private productservice: ProductService, private userService: UserService, private utilsService: UtilsService,
    private transactionService: TransactionService, private router: Router, private CampaignService: CampaignService) { }

  ngOnInit() {
    this.locationService.setLocation('dashboard');
    this.userService.getUser()
      .then(res => this.init(res));
  }

  init(res: User) {
    this.user = res;
    this.processing = true;
    this.userService.checkMerchant(this.user.mobileNumber, 'b')
      .then(bres => this.initshare(bres));

    this.transactionService.getProductTransactions(this.user.merchantCode, this.utilsService.getLastYearDateString() + " 00:00:00",
      this.utilsService.getCurDateString() + " 23:59:59", this.page)
      .then(tres => this.updateTransactions(tres));
  }

  initshare(res: any) {
    this.businesspro = res;
   
    this.userService.congratulation(this.user.id)
      .then(res => this.shsh(res));
  }

  shsh(res) {
    if (res.data.responseFromAPI != true && this.businesspro.storeUrl != null) {
      this.sharemodalActions.emit({ action: "modal", params: ['open'] });
    }
    console.log(this.businesspro.storeUrl,'sdjhjks');
    if(this.businesspro.storeUrl){
    this.businesspro.storeUrl= (this.businesspro.storeUrl).toLowerCase();
    this.storeurl = "https://" + this.businesspro.storeUrl + ".benow.in";
    this.streurl = this.businesspro.storeUrl + ".benow.in";
    this.streurlpay = this.businesspro.storeUrl + ".benow.in/pay";
    this.urlstore = this.businesspro.storeUrl + ".benow.in/store";
    this.streurlpre = "https://" +this.businesspro.storeUrl + ".benow.in";
    this.streurlpaypre = "https://" + this.businesspro.storeUrl + ".benow.in/pay";
    this.urlstorepre = "https://" + this.businesspro.storeUrl + ".benow.in/store";
    this.formLoaded = false;
    }
    else {
      this.user.merchantCode = (this.user.merchantCode).toUpperCase();
      var t = this.utilsService.getBaseURL() + "buy/" + this.user.merchantCode ;
      this.storeurl = t + "/homepage";
      this.streurl = t + "/homepage";
      this.streurlpay = t +"/pay";
      this.urlstore = t + "/store";
      this.streurlpre = t+ "/homepage";
      this.streurlpaypre = t +"/pay";
      this.urlstorepre =  t + "/store";
      this.formLoaded= false;
    }
  }

  close() {
    this.sharemodalActions.emit({ action: "modal", params: ['close'] });
  }

  updateTransactions(res: Transaction) {
    this.selPayments = null;
    if (res && res.payments) {
      this.transactions = res;
      this.payments = res.payments;
      let pmnts = new Array<Payment>();

      if (this.payments && this.payments.length < this.displayTransactions) {
        this.displayTransactions = this.payments.length;
      }

      for (let i: number = 0; i < this.displayTransactions; i++) { 
        pmnts.push(new Payment(res.payments[i].hasCashback, res.payments[i].amount, res.payments[i].status, res.payments[i].cbAmount,
          res.payments[i].id, res.payments[i].tr, res.payments[i].till, res.payments[i].mode, res.payments[i].vPA,
          res.payments[i].merchantVPA, res.payments[i].dateAndTime, res.payments[i].cbTid, res.payments[i].cbMode, res.payments[i].hasProducts,
          res.payments[i].products, res.payments[i].email, res.payments[i].phone, res.payments[i].address, res.payments[i].description,
          res.payments[i].pin, res.payments[i].city, res.payments[i].state));
      }
      this.selPayments = pmnts;
      this.numPayments = this.transactions.numPayments;
      this.totalAmount = this.transactions.totalAmount;
    }

    this.processing = false;
  }

  hasTransactions(): boolean {
    if (this.selPayments && this.selPayments.length > 0) {
      return true;
    }

    return false;
  }

  arrowChange(id: any) {
    if (this.selectedId == id) {
      this.detailsExpanded = !this.detailsExpanded;
    }
    else {
      this.detailsExpanded = true;
    }
    this.selectedId = id;
  }

  isSelected(id) {
    if (this.selectedId == id)
      return true;

    return false;
  }

  changeIcon(id: any) {
    let a: any = document.getElementById(id);
    a.click();
    this.arrowChange(id);
  }

  checkClass(i: number, id: any): string {
    let className: string = 'collapsible-header noLeftMarginBN collapsibleHeadBN';
    if (i % 2 == 0) {
      className = 'collapsible-header noLeftMarginBN accordionHeaderBN collapsibleHeadBN';

      if (this.isSelected(id) && this.detailsExpanded) {
        className = 'collapsible-header noLeftMarginBN accordionHeaderBN collapsibleHeadRedBN';
      }
    }
    else {
      if (this.isSelected(id) && this.detailsExpanded) {
        className = 'collapsible-header noLeftMarginBN collapsibleHeadRedBN';
      }
    }

    return className;
  }

  dateRangeChanged(v: any) {
    this.dateRange = +v;
  }

  seedetails(res: any) {
    console.log(res);
    this.paymnt = res;
    this.productservice.getProductsForTransaction('', res.id)
      .then(res => this.selecting(this.paymnt));
  }
  selecting(res: any) {
    this.transactionService.setSelPayment(res)
      .then(res => this.selected());

  }
  selected() {
    this.seemodalActions.emit({ action: "modal", params: ['open'] });
  }

  getSelPayment(): Payment {
    return this.transactionService.getSelPayment();
  }

  share(res: any) {
    if (res == 1) {
      if(this.businesspro.storeUrl) {
        this.url = this.businesspro.storeUrl + ".benow.in";
      } else {
        this.url = this.utilsService.getBaseURL() + "buy/" + this.user.merchantCode +"/homepage" ;
      }
      this.strshare = !this.strshare;
      this.payshare = false;
      this.storeshare = false;
      this.smsucess = false;
      this.smstext = false;
      this.email = "";
      this.mobileNumber = "";
      this.emailtext = false;
      this.suceessmsg = false;
    }
    if (res == 2) {
      if(this.businesspro.storeUrl) {
      this.url = this.businesspro.storeUrl + ".benow.in/pay";
      } else{
        this.url = this.utilsService.getBaseURL() + "buy/" + this.user.merchantCode +"/pay" ;
      }
      this.payshare = !this.payshare;
      this.strshare = false;
      this.storeshare = false;
      this.smsucess = false;
      this.smstext = false;
      this.suceessmsg = false;
      this.email = "";
      this.mobileNumber = "";
      this.emailtext = false;
    }
    if (res == 3) {
      if(this.businesspro.storeUrl) {
      this.url = this.businesspro.storeUrl + ".benow.in/store";
      } else{
        this.url = this.utilsService.getBaseURL() + "buy/" + this.user.merchantCode +"/store" ;
      }
      this.storeshare = !this.storeshare;
      this.strshare = false;
      this.payshare = false;
      this.smsucess = false;
      this.smstext = false;
      this.emailtext = false;
      this.email = "";
      this.mobileNumber = "";
      this.suceessmsg = false;
    }
  }

  fbClick() {
    this.suceessmsg = false;
    this.emailtext = false;
    this.smsucess = false;
    this.smstext = false;
    window.open('https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&u=' +
      this.url + '&display=popup&ref=plugin&src=share_button', '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    return false;
  }
  twitterbutton() {
    window.open('https://twitter.com/share?url=' + this.url, '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    return false;
  }

  shareclose() {
    this.sharelinkurlmodalActions.emit({ action: "modal", params: ['close'] });
  }

  createprod() {
    this.router.navigateByUrl('/addproduct');
  }
  emaiil() {
    this.emailtext = !this.emailtext;
    this.smstext = false;
  }
  emailpost() {
    this.text = this.url;
    this.subject = "";
    this.CampaignService.sendEmail(this.email, this.text, this.subject,'')
      .then(res => this.emailposth(res));
  }
  emailposth(res: any) {
    if (res) {
      this.suceessmsg = true;
      this.smsucess = false;
    }
  }
  sms() {
    this.smstext = !this.smstext;
    this.emailtext = false;
  }
  smspost() {
    this.CampaignService.smsCampaignLink(this.url, 479, '', this.user.displayName, this.mobileNumber)
      .then(res => this.smsposth(res));
  }
  smsposth(res: any) {
    if (res) {
      this.suceessmsg = false;
      this.smsucess = true;
    }
  }
  WhatsApp() {
    window.open('whatsapp://send?text=' + this.url);
  }
  hasemail() {
    if (this.email && /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email)) {
      return false;
    }
    return true;
  }
  hasSMS() {
    if (this.mobileNumber && /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/.test(this.mobileNumber) ){
      return false;
    }
    return true;
  }

 }
