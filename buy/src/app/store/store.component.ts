import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


import { Product, StoreService, UtilsService, ProductService, PaymentlinkService } from 'benowservices';

@Component({
  selector: 'store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  amount: number;
  numPages: number;
  purpose: string;
  retPolicy: string;
  storeName: string;
  storeLogo: string;
  storeEmail: string;
  storeEmail1: string;
  retPolicy1: string;
  retPolicy2: string;
  storeContact: string;
  storeAddress: string;
  merchantCode: string;
  storeDescription: string;
  stmerId:string;
  products: Array<Product>;
  page: number = 1;
  onclickn : boolean = false;
  isStore: boolean = true;
  amountEditable: boolean = true;
  processing: boolean = false;
  uploadbannnerURL:string;
  uploadsURL:string;
  imag:string;
  strlogo:string;
  mailStoreEmail: string;
  callStoreContact: string;  
  pp:string;
  bnerimage:string;
  //HARDCODED
 storeimage: string = 'https://boygeniusreport.files.wordpress.com/2016/12/amazon-go-store.jpg?quality=98&strip=all&w=782';

  constructor(private activatedRoute: ActivatedRoute, private storeService: StoreService, private utilsService: UtilsService,
    private productService: ProductService, private paymentlinkService: PaymentlinkService, private router: Router) { }

 

  proceed() {
    this.paymentlinkService.setPaymentlinkDetails({
      "amount": this.amount,
      "purpose": this.purpose,
      "merchantCode": this.merchantCode
    });   
    this.router.navigateByUrl('/payerinfo'); 
  }

  ngOnInit() {
    this.uploadsURL = "https://mobilepayments.benow.in/merchants/";
    this.merchantCode = this.activatedRoute.snapshot.params['code'];
    this.pp= this.utilsService.getBaseURL();
    if(this.merchantCode) {
      this.storeService.assignMerchant(this.merchantCode);
      this.fetchProducts();
      this.storeService.fetchStoreDetails(this.merchantCode)
        .then(res => this.fillStoreDetails(res));  
    }
    else
      this.newInit();
  }

    
logoourl(res:any) {
    var data = res.data;
      if (data && data.documentResponseVO) {
          var p = data.documentResponseVO.documentList;
          if (p && p.length > 0) {
              for (var i = 0; i < p.length; i++) {
                  if (p[i].documentName == 'Merchant_logo')
                      this.storeLogo = p[i].documentUrl;
              
                  if (p[i].documentName == 'Merchant_Banner')
                      this.uploadbannnerURL = p[i].documentUrl;
                           
              }
          }
      }

    if(this.storeLogo ){
    this.strlogo = this.uploadsURL + this.storeLogo;
    } else {
      this.strlogo = this.utilsService.getDefaultStoreImageURL()
    }
  
    this.setImgAndHeights();
    
    }
      setImgAndHeights() {
        let imgHeight: number = Math.round((screen.height - 100) * 0.5);
        let gap: number = imgHeight > 150 ? imgHeight - 90 : 100;
      if(this.uploadbannnerURL) {
        this.imag = this.uploadsURL + this.uploadbannnerURL;
        if(document.getElementById('storeimgdiv')) {	
          document.getElementById('storeimgdiv').style.backgroundImage = "url('" + this.imag + "')";
          document.getElementById('storeimgdiv').style.height = imgHeight.toString() + 'px';
          document.getElementById('clearingdiv').style.marginTop = "-" + imgHeight.toString() + 'px';
          document.getElementById('clearingdiv').style.height =  gap.toString() + 'px';
        }
      }
      else {
        this.bnerimage = this.utilsService.getDefaultStorebannerImageURL();
        if(document.getElementById('storeimgdiv')) {	
          document.getElementById('storeimgdiv').style.backgroundImage = "url('" + this.bnerimage+ "')";
          document.getElementById('storeimgdiv').style.height = imgHeight.toString() + 'px';  
          document.getElementById('clearingdiv').style.marginTop = "-" + imgHeight.toString() + 'px';
          document.getElementById('clearingdiv').style.height =  gap.toString() + 'px';      	
         }
      }
     }

  fillMerchantDetails(m: any) {
    if(m && m.merchantCode) {
      this.merchantCode = m.merchantCode;
      this.storeService.assignMerchant(this.merchantCode);
      let u: string = window.location.href;
      
      if(this.utilsService.getIsDevEnv())
        u = this.utilsService.getTestDomainURL();

      if(u) {
        u = u.replace('https://', '').replace('http://', '');
        if(u.startsWith('pay-')) {
         
          this.isStore = false;
          this.amount = +this.activatedRoute.snapshot.params['amount'];          
          if(this.amount > 0) {
            this.amountEditable = false;
            this.amount = Math.round(this.amount * 100) / 100;
          }
          else
            this.amount = null;
        }
        else {
         
          let fullUrl: string = window.location.href;
          if(fullUrl && fullUrl.replace('https://pay', '').toLowerCase().indexOf('/pay') > 0) {
           
            this.isStore = false;
            this.amount = +this.activatedRoute.snapshot.params['amount'];          
            if(this.amount > 0) {
              this.amountEditable = false;
              this.amount = Math.round(this.amount * 100) / 100;
            }
            else
              this.amount = null;
          }
          else {
            
           this.setImgAndHeights();
            this.fetchProducts();  
          }
         }

      }
      this.storeService.fetchStoreDetails(this.merchantCode)
        .then(res => this.fillStoreDetails(res));    
    }
  }

  newInit() {
    this.storeService.getMerchantDetailsFromURL()
      .then(res => this.fillMerchantDetails(res));
   
  }

  fetchProducts() {
    this.productService.getProductsForStore(this.merchantCode, this.page)
      .then(res => this.fillProductsInStore(res));
  }

  more() {
    this.page++;
    this.fetchProducts();
  }

  fillProductsInStore(res: any) {
   this.setImgAndHeights();
    if(res && res.numPages > 0) {
      this.numPages = res.numPages;
      if(!this.products)
        this.products = new Array<Product>();

      if(res && res.products && res.products.length > 0) {
        let me: any = this;
        res.products.forEach(function(p: Product) {
          me.products.push(p);
        });
      }
    }
  }

  fillReturnPolicy(res: any) {
    if(res) {
      if(res.contactSeller)
        this.retPolicy = 'Contact the seller';
      else if(res.noReturnExchange)
        this.retPolicy = 'No returns or echanges';
      else if(res.productExchange) {
        this.retPolicy = "Exchange only on faulty products within";
        this.retPolicy1 = res.productExchangeDay ? res.productExchangeDay.toString() : '';
        this.retPolicy2 = "days of return. (No returns)";
      }
      else if(res.productReturnOrExchange) {
        this.retPolicy = "Returns / exchange only on faulty products within";
        this.retPolicy1 = res.productReturnOrExchangeDay ? res.productReturnOrExchangeDay.toString() : '';
        this.retPolicy2 = "days.";
      }
      else if(res.returnAvailable) {
        this.retPolicy = "Returns available within";
        this.retPolicy1 = res.returnsAvailableDay ? res.returnsAvailableDay.toString() : '';
        this.retPolicy2 = "days.";
      }
      else if(res.noExchangeFlage)
        this.retPolicy = "No questions asked exchange.";
      else if(res.noReturnFlage) 
        this.retPolicy = "No questions asked return.";
    }
  }

  fillStoreDetails(res: any) {
  
    if(res && res.id) {
      this.processing = true;
      this.storeEmail1 = res.userId;
      this.stmerId = res.id;
      this.storeDescription = res.description;
      this.storeAddress = res.address;
      this.storeName = res.displayName;
      if(res.publicEmail && res.publicPhoneNumber){
      this.storeContact = res.publicPhoneNumber;
      this.storeEmail = res.publicEmail;
      }
      else {
        this.storeContact = res.mobileNumber;
        this.storeEmail = res.userId;
      }
      if(this.storeEmail)
        this.mailStoreEmail = 'mailto:' + this.storeEmail;

      if(this.storeContact)
        this.callStoreContact = 'tel:' + this.storeContact;
     
     
      this.fillReturnPolicy(res);
      this.storeService.fetchStoreimagDetais(this.storeEmail1, this.stmerId)
      .then(pres => this.logoourl(pres));
    }
  }
  abtbusiness(){
    this.onclickn = ! this.onclickn;
  }
}
