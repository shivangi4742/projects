import { BenowModel } from "./benow.model";

export class PayPinResponseModel {
    constructor(
        public benow: BenowModel,
        public success: boolean
    ) { }
}