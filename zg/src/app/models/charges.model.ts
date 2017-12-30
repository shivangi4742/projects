import { PgChargesModel } from "./pgcharges.model";

export class ChargesModel {
    constructor(
        public id: string,
        public upiCharges: PgChargesModel,
        public dcCharges: PgChargesModel,
        public ccCharges: PgChargesModel,
        public netBankingCharges: PgChargesModel,
        public sodexoCharges: PgChargesModel
    ) { }
}