import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Product } from './product.model';
import { ProductActions } from './product.action';
import { ProductService } from '../product.service';
import * as _ from 'lodash';
import swal from 'sweetalert2'


export class ProductStateModel {
    products: { [ productId: string ]: Product }
    fetching: boolean
}

@State<ProductStateModel>({
    name: 'products',
    defaults: {
        products: {},
        fetching: false,
    }
})
export class ProductState {

    constructor(private productService: ProductService) {}

    @Selector()
    static getProducts({ products }: ProductStateModel) {
        return _.sortBy(Object.keys(products).map( k => products[k]), ['productName'])
    }

    @Selector()
    static getProductsFetching({ fetching }: ProductStateModel) {
        return fetching
    }

    @Action(ProductActions.FetchProducts)
    fetchProducts({ getState, patchState }: StateContext<ProductStateModel>) {
        const { products } = getState()
        if (_.isEmpty(products)) {
            patchState({ fetching: true })
            this.productService.getProductDetails().toPromise().then(response =>
                patchState({
                    products: _.keyBy(response, 'productId'),
                    fetching: false
                })
            )
        }
    }

    @Action(ProductActions.UpsertProduct)
    async upsertProduct({ getState, patchState, }: StateContext<ProductStateModel>, { payload }: ProductActions.UpsertProduct) {
        try {
            const { products } = getState()
            const { statusMessage, Error: error, product = null } = await this.productService.upsertProduct(payload).toPromise()
            if (error) throw statusMessage
            patchState({ products: { ...products, [product.productId]: product } })
            await this.open({ message: statusMessage, type: 'success' })
        } catch (e) {
            console.error('error', e)
            this.open({ message: e, type: 'error' })
            throw e
        }
    }

    private open({ message, type }) {
        return swal.fire({ icon: type, text: message })
    }
}