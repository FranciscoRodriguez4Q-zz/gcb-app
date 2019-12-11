export namespace BuyerActions
{
    
    export class FetchBuyers {
        static readonly type = '[Buyer] FetchBuyers'
    }

    export class FetchGoldIds {
        static readonly type = '[Buyer] FetchGoldIds'
    }

    export class UpsertBuyer {
        static readonly type = '[Buyer] Upsert'
        constructor(public payload: any) { }
    }
}