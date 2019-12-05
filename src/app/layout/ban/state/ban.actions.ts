export namespace BanActions

{
    export class FetchBans {
        static readonly type = '[Ban] FetchBanDetails'
    }

    export class FetchFocusGroups {
        static readonly type = '[Ban] FetchFocusGroups'
    }

    export class FetchVendorConfigDetails {
        static readonly type = '[Ban] FetchVendorConfigDetails'
    }

    export class FetchBuyerDetails {
        static readonly type = '[Ban] FetchBuyerDetails'
    }

    export class FetchBillingDetails {
        static readonly type = '[Ban] FetchBillingDetails'
    }

    export class FetchBillingTypes {
        static readonly type = '[Ban] FetchBillingTypes'
    }

    // export class UpsertProduct {
    //     static readonly type = '[Products] Upsert'
    //     constructor(public payload: Product) { }
    // }
}