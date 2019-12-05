import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as _ from 'lodash';
import swal from 'sweetalert2'
import { ProductServiceType } from 'src/app/layout/product-service-type/state/product-service-type.model';
import { ProductServiceTypeService } from 'src/app/layout/product-service-type/product-service-type.service';
import { ProductServiceTypeActions } from 'src/app/layout/product-service-type/state/product-service-type.action';


export class ProductServiceTypeStateModel {
    productServiceTypes: ProductServiceType[]
    productData: any[]
    fetching: boolean
}

@State<ProductServiceTypeStateModel>({
    name: 'productServiceTypes',
    defaults: {
        productServiceTypes: [],
        productData:[],
        fetching: false
    }
})
export class ProductServiceTypeState {
    
    constructor(private productServiceTypeService: ProductServiceTypeService) {}
    
    @Selector()
    static getProductServiceTypes({ productServiceTypes }: ProductServiceTypeStateModel) {
        return productServiceTypes
    }

    @Selector()
    static getFetching({ fetching }: ProductServiceTypeStateModel) {
        return fetching
    }

    @Selector()
    static getProductData({ productData }: ProductServiceTypeStateModel) {
        return productData
    }

    @Action(ProductServiceTypeActions.FetchProductServiceTypes)
    fetchProductServiceType({ getState, patchState }: StateContext<ProductServiceTypeStateModel>) {
        const { productServiceTypes } = getState()
        if (_.isEmpty(productServiceTypes)) {
            patchState({
                fetching: true
            })
            this.productServiceTypeService.getServicetypeData().toPromise().then(response => {
                patchState({
                    productServiceTypes: response,
                    fetching: false
                })
            })
        }
    }
    
    @Action(ProductServiceTypeActions.FetchProductServiceTypes)
    fetchProductData({ getState, patchState }: StateContext<ProductServiceTypeStateModel>) {
        const { productServiceTypes } = getState()
        if (_.isEmpty(productServiceTypes)) {
            this.productServiceTypeService.getProducts().toPromise().then(response => {
                patchState({
                    productData: response,
                })
            })
        }
    }

    @Action(ProductServiceTypeActions.UpsertProductServiceType)
    async UpsertProductServiceType({ getState, patchState }: StateContext<ProductServiceTypeStateModel>, { payload }: ProductServiceTypeActions.UpsertProductServiceType) {
        try {
            const { serviceTypeId = null } = payload
            const { productServiceTypes } = getState()
            const { statusMessage, status, productServiceType = null } = await this.productServiceTypeService.upsertServiceType(payload).toPromise()
            if (!status) throw statusMessage
            if (serviceTypeId == null) {
                patchState({ productServiceTypes: [...productServiceTypes, productServiceType] })
            } else {
                const productIndex = productServiceTypes.findIndex(x => x.serviceTypeId === serviceTypeId)
                let _productServiceTypes = [...productServiceTypes]
                _productServiceTypes[productIndex] = productServiceType
                patchState({
                    productServiceTypes: [..._productServiceTypes],
                })
            }
            await this.open({ message: statusMessage, type: 'success' })
        } catch(e) {
            this.open({ message: e, type: 'error'})
            throw e;
        }
    }

    private open({ message, type }) {
        return swal.fire({ icon: type, text: message })
    }

}