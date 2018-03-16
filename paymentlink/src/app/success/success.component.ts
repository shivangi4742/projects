import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import * as jsPDF from 'jspdf';

import { Product, SDKService, ProductService, SDK, TransactionService, CampaignService, UtilsService, PrintPayment, Merchant, User, UserService, FileService } from 'benowservices';

@Component({
  selector: 'success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  convFee: number;
  purchaseAmount: number;
  id: string;
  txnid: string;
  products: Array<Product>;
  pay: any;
  loaded: boolean = false;
  mtype: number = 1;
  break: boolean = false;
  certificatePDF = false;
  merchantmodel: Merchant;
  imgData: string;
  user: User;
  isEmailAvailable: boolean = false;
  buyerMailContent: string;
  sellerMailContent: string;
  toMail: boolean = false;
  hasProducts: boolean = false;
  data: File;
  sdk: SDK;

  constructor(private route: ActivatedRoute, private sdkService: SDKService, private productService: ProductService, private userService: UserService, private transactionService: TransactionService, private campaignService: CampaignService,
    private utilsService: UtilsService, private fileService: FileService, private router: Router) { }

  ngOnInit() {

    this.id = this.route.snapshot.params['id'];
    this.txnid = this.route.snapshot.params['txnid'];
    this.pay = this.sdkService.getPaySuccess();
    this.sdkService.getPaymentLinkDetails(this.id)
      .then(res => this.init(res));


    if (this.pay && this.pay.amount > 0) {
      this.products = this.pay.products;
      this.loaded = true;
      this.mtype = this.pay.mtype;
    }
    else
      this.productService.getProductsForTransaction(this.id, this.txnid)
        .then(res => this.fillProducts(res));
  }

  breakdown() {
    this.break = !this.break;
  }

  getArrowDrop(): string {
    if (this.break)
      return 'arrow_drop_up';

    return 'arrow_drop_down';
  }

  init(res: any) {
    this.sdk = res;
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Purchase', { value: '0.00', currency: 'USD' });
    }
    this.mtype = this.sdk.mtype;

    this.sdkService.getTransactionStatus(this.sdk.merchantCode, this.txnid)
      .then(res => this.checkTransactionStatus(res));

  }

  checkTransactionStatus(rest: any) {

    var me = this;

    if (rest && rest.length > 0) {
      let res: any = rest[0];
      if (res && res.txnId == this.txnid && res.paymentStatus) {
        if (res.paymentStatus.trim().toUpperCase() == 'PAID') {
          me.fetchMerchantDetails();
        }
        else {
          this.router.navigateByUrl('/paymentfailure/' + this.id + '/' + this.txnid);
        }
      }
      else {
        this.router.navigateByUrl('/paymentfailure/' + this.id + '/' + this.txnid);
      }
    }
    else {
      this.router.navigateByUrl('/paymentfailure/' + this.id + '/' + this.txnid);
    }

  }

  fetchMerchantDetails(): void {
    this.userService.getMerchantDetails(this.sdk.merchantCode)
      .then(tres => this.callMerchant(tres));
  }

  callMerchant(res: any){
    this.campaignService.fetchMerchantDetails(res.userId, res.id)
      .then(mres => this.fillMerchant(mres));
  }

  fillMerchant(res: Merchant){
    this.merchantmodel = res;
    this.userService.getMerchantDetails(this.sdk.merchantCode)
      .then(res2 => this.merchantmodel.auto80GEnabled = res2.auto80gEnabled);

    this.campaignService.getAllNGOTransactions(this.txnid)
      .then(cres => this.checkDetails(cres));
  }

  prepareMail(res: any) {
    let dets: PrintPayment = res;

    if (this.mtype == 2) {
      this.buyerMailContent = '<html> ' +
        '<head> ' +
        '  <style> ' +
        '  table { ' +
        '      font-family: \'Open Sans\', sans-serif; ' +
        '      font-size: 1.75vw; ' +
        '      border-collapse: collapse; ' +
        '      width: 100%; ' +
        '  } ' +
        '  td, th { ' +
        '      border-bottom: 1px solid #dddddd; ' +
        '      text-align: left; ' +
        '      padding: 12px; ' +
        '  } ' +
        '  .mainContent{ ' +
        '    margin-left: 15%; ' +
        '    margin-right: 15%; ' +
        '    padding: 10px; ' +
        '    font-family: \'Open Sans\', sans-serif; ' +
        '    font-size: 1.5vw; ' +
        '  } ' +
        '  .logoImage{ ' +
        '    text-align: center; ' +
        '    margin-bottom: 10px; ' +
        '  } ' +
        '  .title{ ' +
        '    text-align: center; ' +
        '    padding: 12px; ' +
        '    font-size: 1.8vw; ' +
        '  } ' +
        '  .heading{ ' +
        '    font-size: 1.5vw; ' +
        '    font-weight: bold; ' +
        '    margin-bottom: 5px; ' +
        '  } ' +
        '  .table{ ' +
        '    margin-bottom: 20px; ' +
        '  } ' +
        '  .columnnames{ ' +
        '    background-color: #f5f4f4; ' +
        '    color: #e53935; ' +
        '    width: 40%; ' +
        '  } ' +
        '  .data{ ' +
        ' ' +
        '  } ' +
        '  .helpdesk{ ' +
        '    margin-bottom: 30px; ' +
        '  } ' +
        '  a{ ' +
        '    color: royalblue; ' +
        '    text-decoration:  none; ' +
        '  } ' +
        '  a:hover{ ' +
        '    cursor: pointer; ' +
        '  } ' +
        '  .footer{ ' +
        '    border-color: #cccccc; ' +
        '    text-align: center; ' +
        '  } ' +
        ' ' +
        '  </style> ' +
        '</head> ' +
        '<body> ' +
        '  <div class="mainContent"> ' +
        '    <div class="logoImage"> ' +
        '      <img src="https://pbs.twimg.com/profile_images/915212352873578498/qa3oS9PZ_400x400.jpg"  width="108px" height="77"> ' +
        '    </div> ' +
        '    <div class="title"> ' +
        '      Your donation is successful.<br> ' +
        '<img src="http://trak.in/wp-content/uploads/2011/07/image5.png" width="13px" height="15px"/>' + dets.amount + ' successfully donated. ' +
        '    </div> ' +
        '    <div class="heading"> ' +
        '      Donation Details ' +
        '    </div> ' +
        '    <div class="table"> ' +
        '      <table> ' +
        '        <tr> ' +
        '          <td class="columnnames">Merchant Name</td> ' +
        '          <td>' + this.merchantmodel.business + '</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Merchant Number</td> ' +
        '          <td>' + this.merchantmodel.mobileNumber + '</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Merchant Email</td> ' +
        '          <td>' + this.merchantmodel.userId + '</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Payment ID</td> ' +
        '          <td>' + dets.transactionid + '</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Amount</td> ' +
        '          <td class="data">₹'+dets.amount+'</td> ' +
        '        </tr> ' +
        '      </table> ' +
        '    </div> ' +
        '    <div class="helpdesk"> ' +
        '      <a href="mailto:helpdesk@benow.in" target="_top">Raise an issue</a>, if there is a problem with this ' +
        '    </div> ' +
        '    <div class="footer"> ' +
        '      © 2018 Benow. All Rights Reserved.<br><br> ' +
        'Hiranandani Lighthall, Tower A, 507 Above Maruti Suzuki Showroom Saki Vihar Road, Andheri East Mumbai 400072 ' +
        '    </div> ' +
        '  </div> ' +
        '</body> ' +
        '</html> ';
    }
    else {
      this.buyerMailContent = '<html> ' +
        '<head> ' +
        '  <style> ' +
        '  table { ' +
        '      font-family: \'Open Sans\', sans-serif; ' +
        '      font-size: 1.75vw; ' +
        '      border-collapse: collapse; ' +
        '      width: 100%; ' +
        '  } ' +
        '  td, th { ' +
        '      border-bottom: 1px solid #dddddd; ' +
        '      text-align: left; ' +
        '      padding: 12px; ' +
        '  } ' +
        '  .mainContent{ ' +
        '    margin-left: 15%; ' +
        '    margin-right: 15%; ' +
        '    padding: 10px; ' +
        '    font-family: \'Open Sans\', sans-serif; ' +
        '    font-size: 1.5vw; ' +
        '  } ' +
        '  .logoImage{ ' +
        '    text-align: center; ' +
        '    margin-bottom: 10px; ' +
        '  } ' +
        '  .title{ ' +
        '    text-align: center; ' +
        '    padding: 12px; ' +
        '    font-size: 1.8vw; ' +
        '  } ' +
        '  .heading{ ' +
        '    font-size: 1.5vw; ' +
        '    font-weight: bold; ' +
        '    margin-bottom: 5px; ' +
        '  } ' +
        '  .table{ ' +
        '    margin-bottom: 20px; ' +
        '  } ' +
        '  .columnnames{ ' +
        '    background-color: #f5f4f4; ' +
        '    color: #e53935; ' +
        '    width: 40%; ' +
        '  } ' +
        '  .data{ ' +
        ' ' +
        '  } ' +
        '  .helpdesk{ ' +
        '    margin-bottom: 30px; ' +
        '  } ' +
        '  a{ ' +
        '    color: royalblue; ' +
        '    text-decoration:  none; ' +
        '  } ' +
        '  a:hover{ ' +
        '    cursor: pointer; ' +
        '  } ' +
        '  .footer{ ' +
        '    border-color: #cccccc; ' +
        '    text-align: center; ' +
        '  } ' +
        ' ' +
        '  </style> ' +
        '</head> ' +
        '<body> ' +
        '  <div class="mainContent"> ' +
        '    <div class="logoImage"> ' +
        '      <img src="http://www.benow.in/wp-content/uploads/2017/11/logo@2x.png"  width="108px" height="77"> ' +
        '    </div> ' +
        '    <div class="title"> ' +
        '      Your payment is successful.<br> ' +
        '<img src="http://trak.in/wp-content/uploads/2011/07/image5.png" width="13px" height="15px"/>' + dets.amount + ' successfully paid. ' +
        '    </div> ' +
        '    <div class="heading"> ' +
        '      Payment Details ' +
        '    </div> ' +
        '    <div class="table"> ' +
        '      <table> ' +
        '        <tr> ' +
        '          <td class="columnnames">Merchant Name</td> ' +
        '          <td>' + this.merchantmodel.business + '</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Merchant Number</td> ' +
        '          <td>' + this.merchantmodel.mobileNumber + '</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Merchant Email</td> ' +
        '          <td>' + this.merchantmodel.userId + '</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Payment ID</td> ' +
        '          <td>' + dets.transactionid + '</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Amount</td> ' +
        '          <td class="data"><img src="http://trak.in/wp-content/uploads/2011/07/image5.png" width="10px" height="12px"/>' + dets.amount + '</td> ' +
        '        </tr> ' +
        '      </table> ' +
        '    </div> ' +
        '    <div class="helpdesk"> ' +
        '      <a href="mailto:helpdesk@benow.in" target="_top">Raise an issue</a>, if there is a problem with this ' +
        '    </div> ' +
        '    <div class="footer"> ' +
        '      © 2018 Benow. All Rights Reserved.<br><br> ' +
        'Hiranandani Lighthall, Tower A, 507 Above Maruti Suzuki Showroom Saki Vihar Road, Andheri East Mumbai 400072 ' +
        '    </div> ' +
        '  </div> ' +
        '</body> ' +
        '</html> ';

      this.sellerMailContent = '<html> ' +
        '<head> ' +
        '  <style> ' +
        '  table { ' +
        '      font-family: \'Open Sans\', sans-serif; ' +
        '      font-size: 1.75vw; ' +
        '      border-collapse: collapse; ' +
        '      width: 100%; ' +
        '  } ' +
        '  td, th { ' +
        '      border-bottom: 1px solid #dddddd; ' +
        '      text-align: left; ' +
        '      padding: 12px; ' +
        '  } ' +
        '  .mainContent{ ' +
        '    margin-left: 15%; ' +
        '    margin-right: 15%; ' +
        '    padding: 10px; ' +
        '    font-family: \'Open Sans\', sans-serif; ' +
        '    font-size: 1.5vw; ' +
        '  } ' +
        '  .logoImage{ ' +
        '    text-align: center; ' +
        '    margin-bottom: 10px; ' +
        '  } ' +
        '  .title{ ' +
        '    text-align: center; ' +
        '    padding: 12px; ' +
        '    font-size: 1.8vw; ' +
        '  } ' +
        '  .heading{ ' +
        '    font-size: 1.5vw; ' +
        '    font-weight: bold; ' +
        '    margin-bottom: 5px; ' +
        '  } ' +
        '  .table{ ' +
        '    margin-bottom: 20px; ' +
        '  } ' +
        '  .columnnames{ ' +
        '    background-color: #f5f4f4; ' +
        '    color: #e53935; ' +
        '    width: 40%; ' +
        '  } ' +
        '  .data{ ' +
        ' ' +
        '  } ' +
        '  .helpdesk{ ' +
        '    margin-bottom: 30px; ' +
        '  } ' +
        '  a{ ' +
        '    color: royalblue; ' +
        '    text-decoration:  none; ' +
        '  } ' +
        '  a:hover{ ' +
        '    cursor: pointer; ' +
        '  } ' +
        '  .footer{ ' +
        '    border-color: #cccccc; ' +
        '    text-align: center; ' +
        '  } ' +
        ' ' +
        '  </style> ' +
        '</head> ' +
        '<body> ' +
        '  <div class="mainContent"> ' +
        '    <div class="logoImage"> ' +
        '      <img src="http://www.benow.in/wp-content/uploads/2017/11/logo@2x.png" width="108px" height="77"> ' +
        '    </div> ' +
        '    <div class="title"> ' +
        '      Payment Received.<br> ' +
        '      ₹'+dets.amount+' successfully received. ' +
        '    </div> ' +
        '    <div class="heading"> ' +
        '      Payment Details ' +
        '    </div> ' +
        '    <div class="table"> ' +
        '      <table> ' +
        '        <tr> ' +
        '          <td class="columnnames">Amount</td> ' +
        '          <td>₹'+dets.amount+'</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Payment ID</td> ' +
        '          <td>' + dets.transactionid + '</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Name</td> ' +
        '          <td>' + dets.name + '</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Mobile Number</td> ' +
        '          <td>' + dets.phone + '</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Email</td> ' +
        '          <td class="data">' + dets.email + '</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Address</td> ' +
        '          <td class="data">' + dets.address + '</td> ' +
        '        </tr> ' +
        '      </table> ' +
        '    </div> ' +
        '    <div class="helpdesk"> ' +
        '      <a href="mailto:helpdesk@benow.in" target="_top">Raise an issue</a>, if there is a problem with this ' +
        '    </div> ' +
        '    <div class="footer"> ' +
        '      © 2018 Benow. All Rights Reserved.<br><br> ' +
        'Hiranandani Lighthall, Tower A, 507 Above Maruti Suzuki Showroom Saki Vihar Road, Andheri East Mumbai 400072 ' +
        '    </div> ' +
        '  </div> ' +
        '</body> ' +
        '</html> ';
    }
  }

  checkDetails(res: any) {
    let dets = res.printTxns;
    if (dets.email == null) {
      this.isEmailAvailable = false;
    }
    else {
      this.isEmailAvailable = true;
      this.prepareMail(dets);

      if (this.mtype == 2) {
      }
      else {
        this.campaignService.sendEmail(dets.email, this.buyerMailContent, 'Paid Successfully', '')
          .then(mres => console.log(mres));
        this.campaignService.sendEmail(this.sdk.email, this.sellerMailContent, 'Payment Received on Benow', '')
          .then(gres => console.log(gres));
      }
    }
  }

  success(res: any, me: any) {
  }

  assignSDKDetails(res: SDK) {
    if (res && res.id) {
      this.mtype = res.merchantType;
      this.pay.title = res.businessName;
      if (res.chargeConvenienceFee) {
        this.purchaseAmount = Math.round(this.pay.amount * 100) / 100;
        this.pay.amount = Math.round(this.pay.amount * 1.0236 * 100) / 100;
        this.convFee = this.pay.amount - this.purchaseAmount;
      }

      this.loaded = true;
    }
  }

  getSDKDetailsForNonProduct(sres: SDK) {
    this.mtype = sres.merchantType;
    this.pay = {
      title: sres.businessName,
      txnid: this.txnid,
      amount: 0
    };

    this.transactionService.getTransactionDetails(sres.merchantCode, this.txnid)
      .then(res => this.fillMerchantTransaction(res));
  }

  fillMerchantTransaction(res: any) {
    if (res && res.length > 0 && res[0].paymentStatus && res[0].paymentStatus.trim().toUpperCase() == 'PAID')
      this.pay.amount = res[0].amount;

    this.loaded = true;
  }

  downloadCertificate() {
    this.sdkService.get80G(this.id, this.txnid);
  }

  fillProducts(res: Array<Product>) {
    if (res && res.length > 0) {
      let total: number = 0;
      this.products = res;
      this.hasProducts = true;
      for (let i: number = 0; i < this.products.length; i++)
        total += this.products[i].qty * this.products[i].price;

      this.pay = {
        amount: total,
        title: '',
        txnid: this.txnid
      };

      this.sdkService.getPaymentLinkDetails(this.id)
        .then(sres => this.assignSDKDetails(sres));
    }
    else
      this.sdkService.getPaymentLinkDetails(this.id)
        .then(sres => this.getSDKDetailsForNonProduct(sres));
  }
}
