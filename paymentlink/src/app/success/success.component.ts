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
  id: string;
  txnid: string;
  products: Array<Product>;
  pay: any;
  loaded: boolean = false;
  mtype: number = 1;
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
              private utilsService: UtilsService, private fileService: FileService) { }

  ngOnInit() {

    this.id = this.route.snapshot.params['id'];
    this.txnid = this.route.snapshot.params['txnid'];
    this.pay = this.sdkService.getPaySuccess();
    this.sdkService.getPaymentLinkDetails(this.id)
      .then(res => this.init(res));


    if(this.pay && this.pay.amount > 0) {
      this.products = this.pay.products;
      this.loaded = true;
      this.mtype = this.pay.mtype;
    }
    else
      this.productService.getProductsForTransaction(this.id, this.txnid)
        .then(res => this.fillProducts(res));
  }

  init(res: any) {
    this.sdk = res;
     if((window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {value: '0.00', currency: 'USD'});
     }
   this.mtype = this.sdk.mtype;

    this.campaignService.fetchMerchantDetails(this.sdk.email, this.sdk.merchantId)
      .then(tres => this.merchantmodel = tres);

    this.campaignService.getAllNGOTransactions(this.txnid)
      .then(cres => this.checkDetails(cres));
  }

  prepareMail(res: any) {
    let dets: PrintPayment = res;

    if(this.mtype == 2) {
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
        '<img src="http://trak.in/wp-content/uploads/2011/07/image5.png" width="13px" height="15px"/>'+dets.amount+' successfully donated. ' +
        '    </div> ' +
        '    <div class="heading"> ' +
        '      Donation Details ' +
        '    </div> ' +
        '    <div class="table"> ' +
        '      <table> ' +
        '        <tr> ' +
        '          <td class="columnnames">Merchant Name</td> ' +
        '          <td>'+this.merchantmodel.business+'</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Merchant Number</td> ' +
        '          <td>'+this.merchantmodel.mobileNumber+'</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Merchant Email</td> ' +
        '          <td>'+this.merchantmodel.userId+'</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Payment ID</td> ' +
        '          <td>'+dets.transactionid+'</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Amount</td> ' +
        '          <td class="data"><img src="http://trak.in/wp-content/uploads/2011/07/image5.png" width="10px" height="12px"/>'+dets.amount+'</td> ' +
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
    else{
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
        '<img src="http://trak.in/wp-content/uploads/2011/07/image5.png" width="13px" height="15px"/>'+dets.amount+' successfully paid. ' +
        '    </div> ' +
        '    <div class="heading"> ' +
        '      Payment Details ' +
        '    </div> ' +
        '    <div class="table"> ' +
        '      <table> ' +
        '        <tr> ' +
        '          <td class="columnnames">Merchant Name</td> ' +
        '          <td>'+this.merchantmodel.business+'</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Merchant Number</td> ' +
        '          <td>'+this.merchantmodel.mobileNumber+'</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Merchant Email</td> ' +
        '          <td>'+this.merchantmodel.userId+'</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Payment ID</td> ' +
        '          <td>'+dets.transactionid+'</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Amount</td> ' +
        '          <td class="data"><img src="http://trak.in/wp-content/uploads/2011/07/image5.png" width="10px" height="12px"/>'+dets.amount+'</td> ' +
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
        '      <img src="http://trak.in/wp-content/uploads/2011/07/image5.png" width="13px" height="15px"/>'+dets.amount+' successfully received. ' +
        '    </div> ' +
        '    <div class="heading"> ' +
        '      Payment Details ' +
        '    </div> ' +
        '    <div class="table"> ' +
        '      <table> ' +
        '        <tr> ' +
        '          <td class="columnnames">Amount</td> ' +
        '          <td><img src="http://trak.in/wp-content/uploads/2011/07/image5.png" width="10px" height="12px"/>'+dets.amount+'</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Payment ID</td> ' +
        '          <td>'+dets.transactionid+'</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Name</td> ' +
        '          <td>'+dets.name+'</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Mobile Number</td> ' +
        '          <td>'+dets.phone+'</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Email</td> ' +
        '          <td class="data">'+dets.email+'</td> ' +
        '        </tr> ' +
        '        <tr> ' +
        '          <td class="columnnames">Address</td> ' +
        '          <td class="data">'+dets.address+'</td> ' +
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
    if(dets.email == null){
      this.isEmailAvailable = false;
    }
    else{
      this.isEmailAvailable = true;
      this.prepareMail(dets);

      if(this.mtype == 2){
        this.toMail = true;
        //this.createcertificatePDF(res);
        //this.fileService.sendEmailNotify(this.data, dets.email, 'Donation Details', this.buyerMailContent,this.success,this);
        this.campaignService.sendEmail(dets.email, this.buyerMailContent, 'Donated Successfully', '')
          .then(nres => console.log(nres));
      }
      else{
        this.campaignService.sendEmail(dets.email, this.buyerMailContent, 'Paid Successfully', '')
          .then(mres => console.log(mres));
        this.campaignService.sendEmail(this.sdk.email, this.sellerMailContent, 'Payment Received on Benow', '')
          .then(gres => console.log(gres));
      }
    }
  }

  success(res: any, me: any){

    console.log('80G Sent!', res);
  }

  assignSDKDetails(res: SDK) {
    if(res && res.id) {
      this.mtype = res.merchantType;
      this.pay.title = res.businessName;
      if(res.chargeConvenienceFee) {
        let total = 0;
        for (let i: number = 0; i < this.products.length; i++) {
          this.products[i].price = Math.round(this.products[i].price * 1.0236 * 100)/100;
          total += this.products[i].price * this.products[i].qty;
        }

        this.pay.amount = total;
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
    if(res && res.length > 0 && res[0].paymentStatus && res[0].paymentStatus.trim().toUpperCase() == 'PAID')
      this.pay.amount = res[0].amount;

    this.loaded = true;
  }

  downloadCertificate(txnId: any) {
    if (!this.certificatePDF) {
      this.toMail = false;
      this.certificatePDF = true;
      let me = this;

      if (this.merchantmodel.merchantLogoUrl && !this.imgData) {
        this.utilsService.convertImgToBase64URL(this.utilsService.getBaseURL() + this.merchantmodel.merchantLogoUrl,
          'image/png', function (data: any) {
            me.imgData = data;
            me.campaignService.getAllNGOTransactions(txnId)
              .then(res => me.createcertificatePDF(res));
          });
      }
      else {
        me.campaignService.getAllNGOTransactions(txnId)
          .then(res => me.createcertificatePDF(res));
      }
    }
  }

  createcertificatePDF(res: any) {
    if (!res || res.success == false) {
      this.utilsService.setStatus(true, false, "Something went wrong. Please try again.");
      window.scrollTo(0, 0);
      this.certificatePDF = false;
    }
    else {
      let t: PrintPayment = res.printTxns;
        var doc = jsPDF();
        if (t.name == null) {
          t.name = ' ';
        }
        if (t.phone == null) {
          t.phone = ' ';
        }
        if (t.email == null) {
          t.email = ' ';
        }
        if (t.address == null) {
          t.address = ' ';
        }
        if (t.pan == null) {
          t.pan = ' ';
        }
        if (t.phone == null) {
          t.phone = ' ';
        }

        if (this.merchantmodel.ngoCertifdate == null) {
          this.merchantmodel.ngoCertifdate = ' ';
        }

        if (this.merchantmodel.ngoCertifnum == null) {
          this.merchantmodel.ngoCertifnum = ' ';
        }

        doc.setTextColor(40);
        doc.rect(5, 5, 200, 280);
        doc.setFontType('bold');


        if (this.imgData) {
          var imagedata = this.imgData;
          doc.addImage(imagedata, 80, 6);
        }
        doc.setFontSize(14);
        doc.text(this.merchantmodel.business, (doc.internal.pageSize.width / 2), 47, null, null, 'center');
        doc.setFontStyle('normal');
        doc.setFontSize(12);
        doc.setFontType('normal');

        doc.text(this.merchantmodel.Address, (doc.internal.pageSize.width / 2), 55, null, null, 'center');
        // doc.text(this.merchantmodel.locality, (doc.internal.pageSize.width / 2), 60, null, null, 'center');
        // doc.text(this.merchantmodel.pinCode, (doc.internal.pageSize.width / 2), 65, null, null, 'center');

        doc.setFontType('bold');
        doc.text(10, 74, 'Tel.No:');
        doc.setFontSize(12);
        doc.setFontType('normal');
        doc.text(25, 74, this.merchantmodel.mobileNumber);
        doc.text(this.merchantmodel.userId, (doc.internal.pageSize.width / 2), 74, null, null, 'center');
        doc.setFontType('bold');
        doc.text(145, 74, 'PAN #:');


        if (this.merchantmodel.panNumber == null) {
          this.merchantmodel.panNumber = ' ';
        }
        doc.setFontType('normal');
        doc.text(160, 74, this.merchantmodel.panNumber);
        doc.setFontSize(12);
        doc.setFontType('bold');
        doc.text('DONATION RECEIPT', (doc.internal.pageSize.width / 2), 90, null, null, 'center');
        doc.line(84, 91, 126, 91);
        doc.text(10, 100, 'Receipt No:');
        doc.setFontType('normal');
        doc.text(35, 100, t.transactionid);
        doc.setFontType('bold');
        doc.text(133, 100, 'Receipt Date:');

        doc.setFontType('normal');
        doc.text(162, 100, t.dateAndTime);

        doc.text(10, 110, 'Received with thanks from:');
        doc.setFontType('normal');

        doc.text(68, 110, t.name);
        var str = t.address;
        var add1 = str.split(" ");
        if (add1.length > 8) {
          var add2 = add1.length / 2;
          var add3 = add1.length / 4;
        }

        var ts = doc.splitTextToSize(t.address, 100);
        doc.text(68, 115, ts);
        doc.setFontSize(11);
        // doc.text(10, 135, 'The Sum of Rs. ');

        var p = this.utilsService.inWords(t.amount);

        var pp = '';
        var newArr = p.split(' ');

        for (var i = 0; i < newArr.length; i++) {
          newArr[i] = newArr[i].charAt(0).toUpperCase() + newArr[i].substring(1);
        }
        var pp = newArr.join(' ');


        var modes = '';

        if (t.mode) {
          if ((t.mode == 'UPI_OTHER_APP' || t.mode == 'UPI') ){
            modes = 'UPI';

          }
          else if ((t.mode == 'CREDIT_CARD' || t.mode == 'CC') ){
            modes = 'Credit Card';
          }
          else if ((t.mode == 'DEBIT_CARD' || t.mode == 'DC') ){
            modes = 'Debit Card';
          }
          else if ((t.mode == 'NET_BANKING' ||t.mode== 'NB')){
            modes = 'Net Banking';
          }
          else if ((t.mode == 'MEAL_COUPON' || t.mode == 'SODEXO')){
            modes = 'Sodexo';
          }
        }


        var amount = 'The Sum of Rs. ' + t.amount.toString() + " (" + pp + ") " + ' donated via ' + modes;
        var tgo = doc.splitTextToSize(amount, 190);
        doc.text(10, 135, tgo);
        //doc.text(10, 140, 'donated via ');
        doc.setFontSize(10);
        doc.setFontType("italic");
        doc.text(10, 154, 'Through GivNow for the following:');
        doc.setFontType("normal");
        var col = ['Donation Purpose', 'Cost(Rs.)', 'Qty', 'Amount'];

        if (t.description == null)
          t.description = 'General Fund';//hard code
        var rows = [
          [t.description, t.amount, "", t.amount],
          ["", "", "TOTAL", t.amount],
        ];
        doc.autoTable(col, rows, {
            startY: 165,
            startX: 10,

          },
        );
        doc.setFontSize(8);

        var tt = 'This receipt is exempt from revenue stamp vide Exemption b Article 53, Schedule I of the Indian Stamp Act,1899.Donation to ' + this.merchantmodel.business + ' qualify for deduction u/s 80G(5) of the  Income Tax Act,  1961 vide certificate of exemption no. ' + this.merchantmodel.ngoCertifnum + ' issued'
          + ' on ' + this.utilsService.getDateOnlyString(new Date(this.merchantmodel.ngoCertifdate)) + ' .All approvals existing on or after Oct 1, 2009 are deemed to have been extended in perpetuity unless specifically withdrawn.'
          + ' The Government order can be seen here.This receipt is invalid in case of non-realization of the money instrument or reversal of the credit card '
          + ' charge or reversal of donation amount for any reason.';

        var ts = doc.splitTextToSize(tt, 190);

        doc.text(ts, 10, 210);
        doc.setFontSize(10);
        doc.text(10, 245 ,'This is a system generated receipt hence signature is not required.');
        doc.setFontType('bold');
        doc.setFontSize(11);


        doc.text(165, 245, 'powered by');
        var imgdata = 'data:image/png;base64,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';
        // it will generate a image

        doc.addImage(imgdata, 'JPEG', 162, 250);
        var nam = t.name + '_' + t.phone + '_' + t.dateAndTime;

        doc.save(nam);

        this.certificatePDF = false;
    }
  }

  fillProducts(res: Array<Product>) {
    if(res && res.length > 0) {
      let total: number = 0;
      this.products = res;
      this.hasProducts = true;
      for(let i: number = 0; i < this.products.length; i++)
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
