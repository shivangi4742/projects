export class PgChargesModel {
    constructor(
        public category: string,
        public charge: string,
        public gst_percent: number
    ) { }
}