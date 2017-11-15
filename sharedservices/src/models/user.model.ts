export class User {
  constructor(
    public hasTils: boolean,
    public isTilManager: boolean,
    public isSuperAdmin: boolean,
    public isSuperMerchant: boolean,
    public language: number,
    public tilLogin: string|null,
    public id: string|null,
    public email: string|null,
    public token: string|null,
    public mccCode: string|null,
    public merchantCode: string|null,
    public privateId: string|null,
    public displayName: string|null,
    public mobileNumber: string|null,
    public allTils: string[]|null,
    public tilNumber: string|null,
    public lob: string|null) { }
}