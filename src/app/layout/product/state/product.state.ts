import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Product } from './product.model';
import { ProductActions } from './product.action';
import { ProductService } from '../product.service';
import * as _ from 'lodash';
import swal from 'sweetalert2'


export class ProductStateModel {
    products: Product[]
    fetching: boolean
}

@State<ProductStateModel>({
    name: 'products',
    defaults: {
        products: [],
        fetching: false,
    }
})
export class ProductState {

    constructor(private productService: ProductService) {}

    @Selector()
    static getProducts({ products }: ProductStateModel) {
        return products
    }

    @Selector()
    static getProductsFetching({ fetching }: ProductStateModel) {
        return fetching
    }

    @Action(ProductActions.FetchProducts)
    fetchProducts({ getState, patchState }: StateContext<ProductStateModel>) {
        const { products } = getState()
        if (_.isEmpty(products)) {
            patchState({
                fetching: true
            })
            this.productService.getProductDetails().toPromise().then(response => {
                patchState({
                    products: response,
                    fetching: false
                })
            })
        }
    }

    @Action(ProductActions.UpsertProduct)
    async addProduct({ getState, patchState }: StateContext<ProductStateModel>, { payload }: ProductActions.UpsertProduct) {
        try {
            const { productId } = payload
            const { products } = getState()
            const { statusMessage, Error: error, product = null } = await this.productService.upsertProduct(payload).toPromise()
            if (error) throw statusMessage
            if (_.isEmpty(`${productId}`)) {
                patchState({ products: [...products, product] })
            } else {
                const productIndex = products.findIndex(x => x.productId === productId)
                products[productIndex] = product
                patchState({
                    products: [...products],
                })
            }
            this.open({ message: statusMessage, type: 'success' })
        } catch(e) {
            this.open({ message: e, type: 'error'})
        }
    }

    private open({ message, type }) {
        swal.fire({ icon: type, text: message })
    }
}