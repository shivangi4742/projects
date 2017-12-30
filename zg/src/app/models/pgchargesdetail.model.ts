import { PgChargesModel } from "./pgcharges.model";

export class PgChargesDetails {
    constructor(
        public netbank: PgChargesModel,
        public debitcard: PgChargesModel,
        public creditcard: PgChargesModel,
    ) { }
}