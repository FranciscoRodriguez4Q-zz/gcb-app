import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import * as _ from 'lodash';
import swal from 'sweetalert2'
import { VendorService } from 'src/app/layout/vendor/vendor.service';
import { VendorActions } from 'src/app/layout/vendor/state/vendor.actions';
import { VendorConfigActions } from 'src/app/layout/vendor-config/state/vendor-config.actions';


export class VendorStateModel {
    vendors: { [ vendorId: string ]: any }
    fetching: boolean
    vendorNames: any
}

@State<VendorStateModel>({
    name: 'vendors',
    defaults: {
        vendors: {},
        vendorNames: [],
        fetching: false,
    }
})
export class VendorState {

    constructor(private vendorService: VendorService, private store: Store) {}

    @Selector()
    static getVendors({ vendors }: VendorStateModel) {
        return Object.keys(vendors).map( k => vendors[k])
    }

    @Selector()
    static getFetching({ fetching }: VendorStateModel) {
        return fetching
    }

    @Selector()
    static getVendorNames({ vendorNames }: VendorStateModel) {
        return vendorNames
    }

    @Action(VendorActions.FetchVendors)
    fetchVendors({ getState, patchState }: StateContext<VendorStateModel>) {
        const { vendors } = getState()
        if (_.isEmpty(vendors)) {
            patchState({ fetching: true })
            this.vendorService.getVendorDetails().toPromise().then(response =>
                patchState({
                    vendors: _.keyBy(response, 'vendorEntityId'),
                    fetching: false
                })
            )
        }
    }

    @Action(VendorActions.FetchVendorNames)
    fetchGoldIds({ getState, patchState }: StateContext<VendorStateModel>) {
        const { vendorNames } = getState()
        if (_.isEmpty(vendorNames)) {
            this.vendorService.getAllHlVendorData().toPromise().then(response =>
                patchState({
                    vendorNames: response,
                })
            )
        }
    }

    @Action(VendorActions.UpsertVendor)
    async upsertVendor({ getState, patchState, }: StateContext<VendorStateModel>, { payload }: VendorActions.UpsertVendor) {
        try {
            const { vendors } = getState()
            const { message, Error: error, vendor = null } = await this.vendorService.saveOrUpdateVendor(payload).toPromise()
            if (error) throw message
            patchState({ vendors: { ...vendors, [vendor.vendorEntityId]: vendor } })
            this.store.dispatch(new VendorConfigActions.AddModifyVendorName(vendor))
            await this.open({ message: message, type: 'success' })
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