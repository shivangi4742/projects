import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TranslateService } from 'ng2-translate';

import { UtilsService, User, UserService, SDKService, Accountpro, Businesspro,FileService, Status, LocationService } from 'benowservices';

@Component({
    selector: 'app-kycreg',
    templateUrl: './kycreg.component.html',
    styleUrls: ['./kycreg.component.css']
})
export class KycregComponent implements OnInit {
    filename: string;
    filename1: string;
    isPanExpanded: boolean = false;
    isAcctExpanded: boolean = false;
    isBusExpanded: boolean = false;
    isNgoExpanded: boolean = false;
    isCODExpanded: boolean = false;
    isPaymentExpanded: boolean = false;
    isgstExpanded: boolean = false;
    accountProfile:Accountpro;
    businessProfile:Businesspro;
    declare:string;
    user:User;
    uploading:boolean= false;
    logoFile:string;
    bannerover:boolean;

    constructor(private translate: TranslateService, private utilsService: UtilsService,
        private userService: UserService, private router: Router, private locationService: LocationService,
        private route: ActivatedRoute, private sdkService: SDKService, private fileService:FileService ) { }

    ngOnInit() {
     this.userService.getUser()
            .then(res => this.init(res));
    }

    init(usr: User) {
        console.log(usr, 'hello', this.businessProfile, this.accountProfile);
        if (usr && usr.id) {
            this.user = usr;
            this.translate.use(this.utilsService.getLanguageCode(this.user.language));
            this.loadForm();
        }
        else
            this.router.navigateByUrl('/login/1');
    }
     loadForm() {

        this.userService.checkMerchant(this.user.mobileNumber, "a")
            .then(ares => this.accountProfile = ares);

       

        
    }
    resetStatus() {
        this.utilsService.setStatus(false, false, '');
    }

   

    accountdetail() {
        window.scrollTo(0, 0);
        this.isPanExpanded = !this.isPanExpanded;
        document.getElementById('acbn').click();
    }

    accountdetail1() {
        this.isPanExpanded = !this.isPanExpanded;
        this.isAcctExpanded = false;
    }
    bankdetail() {
        window.scrollTo(0, 0);
        this.isAcctExpanded = !this.isAcctExpanded;
        document.getElementById('bankbn').click();
    }

    bankdetail1() {
        this.isAcctExpanded = !this.isAcctExpanded;
        this.isPanExpanded = false;
    }

    thanksforaccount() {
        this.userService.enableKyc(this.user.merchantCode)
            .then(res => this.thanksforaccount1(res));

    }
    thanksforaccount1(res: any) {
        if (res.responseFromAPI == true) {
            this.user.kycverified = true
            this.router.navigateByUrl('thanksforaccount');
        }
    }

    uploadauthpan(e: any) {
        if (!this.uploading && e.target && e.target.files) {
            // console.log(e.target.files[0].name)

            this.filename = e.target.files[0].name;
            if (e.target.files && e.target.files[0]) {
                this.utilsService.setStatus(false, false, '')
                if (e.target.files[0].size > 10000000) {
                    var rr = document.getElementById('uploadauthpan');
                    (rr as any).val('');
                    window.scrollTo(0, 0);

                    this.utilsService.setStatus(true, false, 'File is bigger than 300 KB!')
                }
                else {
                    this.uploading = true;
                    this.fileService.upload1(e.target.files[0], this.user.id, "MERCHANT_REG", "Authenticate_Pan", "Authenticate_Pan_KYC", this.uploadauthticatepan, this);
                }
            }
        }
    }

    uploadauthticatepan(res: any, me: any) {

      var f=document.getElementById('uploadauthpan');
      (f as any).val('');
      
        if (res && res.success) {
            // console.log(res);
            me.uploading = false;
            me.authpanuploaded = true;
            me.imgURL = res.fileName;
            window.scrollTo(0, 0);
            me.utilsService.setStatus(false, true, 'Uploaded Authenticate Pan successfully');
        }
        else {
            window.scrollTo(0, 0);
            me.utilsService.setStatus(true, false, res.errorMsg ? res.errorMsg : 'Something went wrong. Please try again.');
        }
    }
    uploadauthbank(e: any) {
        if (!this.uploading && e.target && e.target.files) {
            if (e.target.files && e.target.files[0]) {
                this.filename1 = e.target.files[0].name;
                this.utilsService.setStatus(false, false, '')
                if (e.target.files[0].size > 10000000) {
                   var p = document.getElementById('uploadauthbank');
                   (p as any).val('');
                    // window.scrollTo(0, 0);

                    this.utilsService.setStatus(true, false, 'File is bigger than 300 KB!')
                }
                else {
                    this.uploading = true;
                    this.fileService.upload1(e.target.files[0], this.user.id, "MERCHANT_REG", "Authenticate_Bank", "Authenticate_bank_KYC", this.uploadauthticatebank, this);
                }
            }
        }
    }

    uploadauthticatebank(res: any, me: any) {
        me.uploading = false;
      var c=document.getElementById('uploadauthbank');
      (c as any).val('');
        if (res && res.success) {
            me.authbankuploaded = true;
            me.imgURL = res.fileName;
            // window.scrollTo(0, 0);
            me.utilsService.setStatus(false, true, 'Uploaded Authenticate bank Details successfully');
        }
        else {
            window.scrollTo(0, 0);
            me.utilsService.setStatus(true, false, res.errorMsg ? res.errorMsg : 'Something went wrong. Please try again.');
        }
    }

    hasAllFields() {
        if (this.filename && this.filename1) {
            if (this.declare) {
                if (this.accountProfile.filePassword) {
                    return false;
                }
                return true;
            }
            return false;
        }
        return true;
    }

    allPanFields() {
        if (this.filename) {
            return true;
        }
        return false;
    }

    allbankFields() {
        if (this.filename1) {
            return true;
        }
        return false;
    }

}
