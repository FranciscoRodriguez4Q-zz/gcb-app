import { Product } from './product.model';
export namespace ProductActions

{
    export class FetchProducts {
        static readonly type = '[Products] Fetch'
    }

    export class UpsertProduct {
        static readonly type = '[Products] Upsert'
        constructor(public payload: Product) { }
    }
}