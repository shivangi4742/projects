export class Merchant {
    constructor(
        public Address: string,
        public userId:string,
        public pinCode: string,
        public locality: string,
        public mobileNumber: string,
        public panNumber :string,
        public business:string,
        public merchantLogoUrl:string,
        public ngoCertifdate:string,
        public ngoCertifnum: string
    ) { }
}