import { PayBillBenow } from "./paybillbenow.model";

export class PayBillResponseModel {
    constructor(
        public benow: PayBillBenow,
        public success: boolean
    ) { }
}