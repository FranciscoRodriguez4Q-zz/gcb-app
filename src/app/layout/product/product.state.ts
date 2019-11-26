import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Product } from './product.model';
import { ProductActions } from './product.action';
import { ProductService } from './product.service';
import * as _ from 'lodash';


export class ProductStateModel {
    products: Product[]
    fetching: boolean
    errorMessage: string
    statusMessage: string
}

@State<ProductStateModel>({
    name: 'products',
    defaults: {
        products: [],
        fetching: false,
        errorMessage: "",
        statusMessage: null
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

    @Selector()
    static getStatusMessage({ statusMessage }: ProductStateModel) {
        return statusMessage
    }

    @Action(ProductActions.FetchProducts)
    fetchProducts({ getState, setState }: StateContext<ProductStateModel>) {
        const state = getState()
        if (state.products.length === 0) {
            setState({
                ...state,
                fetching: true
            })
            this.productService.getProductDetails().toPromise().then(response => {
                setState({
                    ...state,
                    products: response,
                    fetching: false
                })
            })
        }
    }

    @Action(ProductActions.UpsertProduct)
    addProduct({ getState, patchState, setState }: StateContext<ProductStateModel>, { payload }: ProductActions.UpsertProduct) {
        const { products } = getState()
        this.productService.upsertProduct(payload).toPromise().then(response => {
            const { productId } = payload
            const { statusMessage } = response
            console.log('statusMessage', statusMessage)
            if (_.isEmpty(`${productId}`)) {
                console.log('[INFO] - New product case')
                patchState({
                    products: [...products, payload]
                })
            } else {
                console.log('[INFO] - Update product case')
                const productIndex = products.findIndex(x => x.productId === productId)
                // const newProducts = [...products]
                products[productIndex] = payload
                patchState({
                    products: [...products]
                })
            }
            setState({
                ...getState(),
                statusMessage: `${statusMessage}`
            })
        }).catch(e => {
            patchState({
                errorMessage: e
            })
        })
    }
}