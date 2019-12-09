import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as _ from 'lodash';
import swal from 'sweetalert2'
import { BuyerService } from 'src/app/layout/buyer/buyer.service';
import { BuyerActions } from 'src/app/layout/buyer/state/buyer.actions';


export class BuyerStateModel {
    buyers: { [ buyerId: string ]: any }
    fetching: boolean
    goldIds: any
}

@State<BuyerStateModel>({
    name: 'buyers',
    defaults: {
        buyers: {},
        goldIds: [],
        fetching: false,
    }
})
export class BuyerState {

    constructor(private buyerService: BuyerService) {}

    @Selector()
    static getBuyers({ buyers }: BuyerStateModel) {
        return _.sortBy(Object.keys(buyers).map( k => buyers[k]), ['buyerName'])
    }

    @Selector()
    static getFetching({ fetching }: BuyerStateModel) {
        return fetching
    }

    @Selector()
    static getGoldIds({ goldIds }: BuyerStateModel) {
        return goldIds
    }

    @Action(BuyerActions.FetchBuyers)
    fetchBuyers({ getState, patchState }: StateContext<BuyerStateModel>) {
        const { buyers } = getState()
        if (_.isEmpty(buyers)) {
            patchState({ fetching: true })
            this.buyerService.getBuyerDetails().toPromise().then(response =>
                patchState({
                    buyers: _.keyBy(response, 'buyerId'),
                    fetching: false
                })
            )
        }
    }

    @Action(BuyerActions.FetchGoldIds)
    fetchGoldIds({ getState, patchState }: StateContext<BuyerStateModel>) {
        const { goldIds } = getState()
        if (_.isEmpty(goldIds)) {
            this.buyerService.getGoldNetList().toPromise().then(response =>
                patchState({
                    goldIds: response,
                })
            )
        }
    }

    @Action(BuyerActions.UpsertBuyer)
    async upsertBuyer({ getState, patchState, }: StateContext<BuyerStateModel>, { payload }: BuyerActions.UpsertBuyer) {
        try {
            const { buyers } = getState()
            const { message, Error: error, buyer = null } = await this.buyerService.upsertBuyer(payload).toPromise()
            if (error) throw message
            patchState({ buyers: { ...buyers, [buyer.buyerId]: buyer } })
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