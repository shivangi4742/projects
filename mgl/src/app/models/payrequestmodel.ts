export class Payrequestmodel {
    constructor(
        public sourceId: number,
        public amount: string,

        public askadd: boolean,
        public askemail: boolean,
        public askmob: boolean,
        public askname: boolean,

        public description: string,
        public email: string,
        public failureURL: string,
        public firstName: string,
        public hash: string,
        public id: string,
        public imageURL: string,
        public invoiceNumber: string,
        public mccCode: string,
        public merchantCode: string,
        public merchantId: string,
        public merchantVpa: string,

        public mndaddress: boolean,
        public mndemail: boolean,
        public mndmob: boolean,
        public mndname: boolean,

        public mode: string,
        public phone: string,

        public readonlyaddr: boolean,
        public readonlyemail: boolean,
        public readonlymob: boolean,
        public readonlyname: boolean,

        public successURL: string,
        public title: string,
        public txnid: string,
        public udf1: string,
        public udf2: string,
        public udf3: string,
        public udf4: string,
        public udf5: string,
        public vpa: string,
        public supportedModes: string [],

       // public token :string,
    ) { }
}

