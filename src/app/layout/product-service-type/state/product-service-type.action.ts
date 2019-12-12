
export namespace ProductServiceTypeActions

{
    export class FetchProductServiceTypes {
        static readonly type = '[ProductServiceType] Fetch'
    }

    export class FetchProductData {
        static readonly type = '[ProductServiceType] FetchProductData'
    }

    export class UpsertProductServiceType {
        static readonly type = '[ProductServiceType] Upsert'
        constructor(public payload: any) { }
    }

    export class AddProduct {
        static readonly type = '[ProductServiceType] AddProduct'
        constructor(public payload: any) { }
    }
}