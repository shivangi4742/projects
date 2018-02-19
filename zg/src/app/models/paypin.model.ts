import { PgChargesDetails } from "./pgchargesdetail.model";
import { UpiChargesDetails } from "./upichargesdetails.model";
import { SubLedgerModel } from "./subledger.model";

export class PayPinModel {
    constructor(
        public allsubledger_list: SubLedgerModel[],
        public bill_amount: number,
        public community_name: string,
        public contact_number: string,
        public due_date: string,
        public email_id: string,
        public flat: string,
        public payable_amount: number,
        public payee_first_name: string,
        public payee_last_name: string,
        public pay_pin: string,
        public pg_details: PgChargesDetails[],
        public remark: string,
        public subledger_list: SubLedgerModel[],
        public upi_details: UpiChargesDetails[],
        public ledger_id: string,
        public society_id: string
    ) { }
}