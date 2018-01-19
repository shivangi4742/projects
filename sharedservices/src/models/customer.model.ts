export class Customer{
    constructor(
        public customerName: string,
        public customerEmail: string,
        public customerMobileNumber: string,
        public numDonations: number,
        public totalDonationAmount: number,
        public lastDonationDate: number
    ){ }
}