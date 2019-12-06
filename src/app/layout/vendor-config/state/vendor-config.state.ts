import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as _ from 'lodash';
import swal from 'sweetalert2'
import { VendorConfigService } from 'src/app/layout/vendor-config/vendor-config.service';
import { VendorConfigActions } from 'src/app/layout/vendor-config/state/vendor-config.actions';

export class VendorConfigStateModel {
    vendorNames: any[]
    currency: any[]
    vendorDetails: any[]
    fetching: boolean
}

@State<VendorConfigStateModel>({
    name: 'vendorConfigs',
    defaults: {
        vendorNames: [],
        currency:[],
        vendorDetails:[],
        fetching: false
    }
})
export class VendorConfigState {
    
    constructor(private vendorConfigService: VendorConfigService) {}

    @Selector()
    static getCurrency({ currency }: VendorConfigStateModel) { return currency }

    @Selector()
    static getVendorNames({ vendorNames }: VendorConfigStateModel) { return vendorNames }

    @Selector()
    static getVendorDetails({ vendorDetails }: VendorConfigStateModel){ return vendorDetails }
    
    @Selector()
    static getFetching({ fetching }: VendorConfigStateModel){ return fetching }

    @Action(VendorConfigActions.FetchCurrency)
    fetchCurrency({ getState, patchState }: StateContext<VendorConfigStateModel>) {
        const { currency } = getState()
        if (_.isEmpty(currency)) {
            this.vendorConfigService.getAllCurrency().toPromise().then(response => {
                patchState({
                    currency: response,
                })
            })
        }
    }

    @Action(VendorConfigActions.FetchVendorNames)
    fetchVendorNames({ getState, patchState }: StateContext<VendorConfigStateModel>) {
        const { vendorNames } = getState()
        if (_.isEmpty(vendorNames)) {
            this.vendorConfigService.getAllVendors().toPromise().then(response => {
                patchState({
                    vendorNames: response,
                })
            })
        }
    }

    @Action(VendorConfigActions.FetchVendorDetails)
    fetchVendorDetails({ getState, patchState }: StateContext<VendorConfigStateModel>) {
        const { vendorDetails } = getState()
        if (_.isEmpty(vendorDetails)) {
            patchState({ fetching: true })
            this.vendorConfigService.getVendorGridData().toPromise().then(response => {
                patchState({
                    vendorDetails: response,
                    fetching: false
                })
            })
        }
    }

    @Action(VendorConfigActions.UpsertVendorConfig)
    async UpsertProductServiceType({ getState, patchState }: StateContext<VendorConfigStateModel>, { payload }: VendorConfigActions.UpsertVendorConfig) {
        try {
            const { vendorConfigId = null } = payload
            const { vendorDetails } = getState()
            const { Error: error, message, vendorConfigDetail = null } = await this.vendorConfigService.upsertVendorConfig(payload).toPromise()
            if (error) throw message
            if (vendorConfigId == null || vendorConfigId == 0) {
                patchState({ vendorDetails: [...vendorDetails, vendorConfigDetail] })
            } else {
                const vendorConfigIndex = vendorDetails.findIndex(x => x.vendorConfigId === vendorConfigId)
                let _vendorDetails = [...vendorDetails]
                _vendorDetails[vendorConfigIndex] = vendorConfigDetail
                patchState({
                    vendorDetails: [..._vendorDetails],
                })
            }
            await this.open({ message: message, type: 'success' })
        } catch(e) {
            this.open({ message: e, type: 'error'})
            throw e;
        }
    }

    private open({ message, type }) {
        return swal.fire({ icon: type, text: message })
    }

}