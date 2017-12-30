import { PgChargesDetails } from "./pgchargesdetail.model";

export class PgChargesList {
    constructor(
        public pgChargesDetails: PgChargesDetails[]
    ) { }
}