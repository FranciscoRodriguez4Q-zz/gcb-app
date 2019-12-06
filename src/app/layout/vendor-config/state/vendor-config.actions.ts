export namespace VendorConfigActions

{
    export class FetchVendorNames {
        static readonly type = '[VendorConfig] FetchVendorNames'
    }

    export class FetchCurrency {
        static readonly type = '[VendorConfig] FetchCurrency'
    }

    export class FetchVendorDetails {
        static readonly type = '[VendorConfig] FetchVendorDetails'
    }

    export class UpsertVendorConfig {
        static readonly type = '[VendorConfig] Upsert'
        constructor(public payload: any) { }
    }
}