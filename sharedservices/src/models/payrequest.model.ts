export class PayRequest {
  constructor(
    public amount: number,
    public id: string,
    public vPA: string,
    public qrURL: string,
    public dateAndTime: string) { }
}