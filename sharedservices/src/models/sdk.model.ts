import { Product } from './product.model';

export class SDK {
  constructor(
    public askmob: boolean,
    public askadd: boolean,
    public mndmob: boolean,
    public mndpan: boolean,
    public askpan: boolean,
    public mndname: boolean,
    public askname: boolean,
    public askemail: boolean,
    public mndemail: boolean,
    public mndaddress: boolean,
    public readonlymob: boolean,
    public readonlypan: boolean,
    public readonlyname: boolean,
    public askresidence: boolean,
    public readonlyaddr: boolean,
    public readonlyemail: boolean,
    public allowMultiSelect: boolean,
    public readonlyresidence: boolean,
    public mtype: number,
    public amount: number,
    public language: number,
    public sourceId: number,
    public minpanamnt: number,
    public merchantType: number,
    public campaignTarget: number,
    public id: string,
    public surl: string,
    public furl: string,
    public email: string,
    public phone: string,
    public title: string,
    public mccCode: string,
    public imageURL: string,
    public lastName: string,
    public firstName: string,
    public merchantId: string,
    public expiryDate: string,
    public merchantVpa: string,
    public description: string,
    public merchantCode: string,
    public businessName: string,
    public invoiceNumber: string,
    public til: string|null,
    public vpa: string|null,
    public url: string|null,
    public mode: string|null,
    public products: Array<Product>|null) { }
}