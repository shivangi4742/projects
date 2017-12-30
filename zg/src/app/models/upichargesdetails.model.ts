import { PgChargesModel } from "./pgcharges.model";

export class UpiChargesDetails {
    constructor(
        public netbank: PgChargesModel
    ) { }
}