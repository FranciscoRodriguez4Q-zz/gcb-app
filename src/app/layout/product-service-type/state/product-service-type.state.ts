import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import * as _ from 'lodash';
import swal from 'sweetalert2'
import { ProductServiceTypeService } from 'src/app/layout/product-service-type/product-service-type.service';
import { ProductServiceTypeActions } from 'src/app/layout/product-service-type/state/product-service-type.action';


export class ProductServiceTypeStateModel {
    productServiceTypes: any
    productData: any
    fetching: boolean
}

@State<ProductServiceTypeStateModel>({
    name: 'productServiceTypes',
    defaults: {
        productServiceTypes: {},
        productData: {},
        fetching: false
    }
})
export class ProductServiceTypeState {
    
    constructor(
        private productServiceTypeService: ProductServiceTypeService,
        private store: Store
    ) {}
    
    @Selector()
    static getProductServiceTypes({ productServiceTypes }: ProductServiceTypeStateModel) {
        return Object.keys(productServiceTypes).map(k => productServiceTypes[k])
    }

    @Selector()
    static getFetching({ fetching }: ProductServiceTypeStateModel) {
        return fetching
    }

    @Selector()
    static getProductData({ productData }: ProductServiceTypeStateModel) {
        return Object.keys(productData).map(k => productData[k])
    }

    @Action(ProductServiceTypeActions.FetchProductServiceTypes)
    fetchProductServiceType({ getState, patchState }: StateContext<ProductServiceTypeStateModel>) {
        const { productServiceTypes } = getState()
        if (_.isEmpty(productServiceTypes)) {
            patchState({ fetching: true })
            this.productServiceTypeService.getServicetypeData().toPromise().then(response => {
                patchState({
                    productServiceTypes: _.keyBy(response,'serviceTypeId'),
                    fetching: false
                })
            })
        }
    }
    
    @Action(ProductServiceTypeActions.FetchProductData)
    fetchProductData({ getState, patchState }: StateContext<ProductServiceTypeStateModel>) {
        const { productData } = getState()
        if (_.isEmpty(productData)) {
            this.productServiceTypeService.getProducts().toPromise().then(response => {
                patchState({
                    productData: _.keyBy(response, 'productId'),
                })
            })
        }
    }

    @Action(ProductServiceTypeActions.UpsertProductServiceType)
    async UpsertProductServiceType({ getState, patchState }: StateContext<ProductServiceTypeStateModel>, { payload }: ProductServiceTypeActions.UpsertProductServiceType) {
        try {
            const { productServiceTypes } = getState()
            const { statusMessage, status, productServiceType = null } = await this.productServiceTypeService.upsertServiceType(payload).toPromise()
            if (!status) throw statusMessage
            patchState({ productServiceTypes: { ...productServiceTypes, [productServiceType.serviceTypeId]: productServiceType } })
            await this.open({ message: statusMessage, type: 'success' })
        } catch(e) {
            this.open({ message: e, type: 'error'})
            throw e;
        }
    }

    @Action(ProductServiceTypeActions.AddProduct)
    addProduct({ getState, patchState }: StateContext<ProductServiceTypeStateModel>, { payload }: ProductServiceTypeActions.AddProduct) {
        const { productData } = getState()
        if (!_.isEmpty(productData)) 
            patchState({ productData: { ...productData, [payload.productId]: payload }})
    }

    private open({ message, type }) {
        return swal.fire({ icon: type, text: message })
    }

}