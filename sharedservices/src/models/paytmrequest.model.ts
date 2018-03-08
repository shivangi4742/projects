export class PaytmRequestModel {
    constructor(
        public requestType: string,
        public mid: string, // Will need from server
        public orderId: string,
        public customerId: string, // Do we have this?
        public amount: number,
        public channelId: string,
        public industryTypeId: string,
        public website: string,
        public checksum: string,
        public mobileNo: number,
        public email: string,
        public paymentModeOnly: string,
        public authMode: string,
        public paymentTypeId: string,
        public cardType: string, //
        public bankCode: string, // Check with paytm if we can pass this blank
        public promoCampId: string,
        public orderDetails: string,
        public dob: string,
        public verifiedBy: string,
        public isUserVerified: string,
        public address1: string,
        public address2: string,
        public city: string,
        public state: string,
        public pincode: string,
        public loginTheme: string,
        public callbackUrl: string,
        public theme: string
    ) { }
}