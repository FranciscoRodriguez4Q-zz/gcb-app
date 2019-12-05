import { State, Action, StateContext, Selector } from '@ngxs/store';
import { BanDetail } from './ban.model';
import { BanActions } from './ban.actions';
import { BanService } from '../ban.service';
import * as _ from 'lodash';
import swal from 'sweetalert2'


export class BanStateModel {
    bans: { [ banId: string ]: BanDetail }
    fetching: boolean
    focusGroups: []
    vendorConfigDetails: []
    buyerDetails: []
    billingDetails: []
    billingTypes: {}
}

@State<BanStateModel>({
    name: 'ban',
    defaults: {
        bans: {},
        fetching: false,
        focusGroups: [],
        vendorConfigDetails: [],
        buyerDetails: [],
        billingDetails: [],
        billingTypes: {}
    }
})
export class BanState {

    constructor(private banService: BanService) {}

    @Selector()
    static getBansDetails({ bans }: BanStateModel) {
        return Object.keys(bans).map( k => bans[k])
    }

    @Selector()
    static getBansDetailsFetching({ fetching }: BanStateModel) {
        return fetching
    }

    @Selector()
    static getFocusGroups({ focusGroups }: BanStateModel) {
        return focusGroups
    }

    @Selector()
    static getVendorConfigDetails({ vendorConfigDetails }: BanStateModel) {
        return vendorConfigDetails
    }

    @Selector()
    static getBuyerDetails({ buyerDetails }: BanStateModel) {
        return buyerDetails
    }

    @Selector()
    static getBillingDetails({ billingDetails }: BanStateModel) {
        return billingDetails
    }

    @Selector()
    static getBillingTypes({ billingTypes }: BanStateModel) {
        return billingTypes
    }

    @Action(BanActions.FetchBans)
    fetchBans({ getState, patchState }: StateContext<BanStateModel>) {
        const { bans } = getState()
        if (_.isEmpty(bans)) {
            patchState({ fetching: true })
            this.banService.getBanDetails().toPromise().then(response =>
                patchState({
                    bans: _.keyBy(response, 'banId'),
                    fetching: false
                })
            )
        }
    }

    @Action(BanActions.FetchFocusGroups)
    fetchFocuesGroups({ getState, patchState }: StateContext<BanStateModel>) {
        const { focusGroups } = getState()
        if (_.isEmpty(focusGroups)) {
            this.banService.getAllFocusGroups().toPromise().then(response =>
                patchState({
                    focusGroups: response
                })
            )
        }
    }

    @Action(BanActions.FetchVendorConfigDetails)
    fetchVendorConfigDetails({ getState, patchState }: StateContext<BanStateModel>) {
        const { vendorConfigDetails } = getState()
        if (_.isEmpty(vendorConfigDetails)) {
            this.banService.getVendorConfigDetails().toPromise().then(response =>
                patchState({
                    vendorConfigDetails: response
                })
            )
        }
    }

    @Action(BanActions.FetchBuyerDetails)
    fetchBuyerDetails({ getState, patchState }: StateContext<BanStateModel>) {
        const { buyerDetails } = getState()
        if (_.isEmpty(buyerDetails)) {
            this.banService.getBuyerDetails().toPromise().then(response =>
                patchState({
                    buyerDetails: response
                })
            )
        }
    }

    @Action(BanActions.FetchBillingDetails)
    fetchBillingDetails({ getState, patchState }: StateContext<BanStateModel>) {
        const { billingDetails } = getState()
        if (_.isEmpty(billingDetails)) {
            this.banService.getBillingModelDetails().toPromise().then(response =>
                patchState({
                    billingDetails: response
                })
            )
        }
    }

    @Action(BanActions.FetchBillingTypes)
    fetchBillingTypes({ getState, patchState }: StateContext<BanStateModel>) {
        const { billingTypes } = getState()
        if (_.isEmpty(billingTypes)) {
            this.banService.getBillingModelTypes().toPromise().then(({ response }) =>
                patchState({
                    billingTypes: response
                })
            )
        }
    }

    // @Action(ProductActions.UpsertProduct)
    // async upsertProduct({ getState, patchState, }: StateContext<ProductStateModel>, { payload }: ProductActions.UpsertProduct) {
    //     try {
    //         const { products } = getState()
    //         const { statusMessage, Error: error, product = null } = await this.productService.upsertProduct(payload).toPromise()
    //         if (error) throw statusMessage
    //         patchState({ products: { ...products, [product.productId]: product } })
    //         await this.open({ message: statusMessage, type: 'success' })
    //     } catch (e) {
    //         console.error('error', e)
    //         this.open({ message: e, type: 'error' })
    //         throw e
    //     }
    // }

    private open({ message, type }) {
        return swal.fire({ icon: type, text: message })
    }
}