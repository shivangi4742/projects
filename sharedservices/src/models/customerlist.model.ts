import { Customer } from "./customer.model";

export class CustomerList{
    constructor(
        public numCustomers: number,
        public numPages: number,
        public customer: Customer[]
    ){ }
}