export namespace VendorActions{

    export class FetchVendors{
        static readonly type = '[Vendor] FetchVendors'
    }

    export class FetchVendorNames{
        static readonly type = '[Vendor] FetchVendorNames'
    }
    
    export class UpsertVendor{
        static readonly type = '[Vendor] Upsert'
        constructor(public payload: any) { }
    }

}