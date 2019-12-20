import { State, Action, StateContext, Selector } from '@ngxs/store';
import { BanDetail } from './ban.model';
import { BanActions } from './ban.actions';
import { BanService } from '../ban.service';
import * as _ from 'lodash';
import swal from 'sweetalert2'


export class BanStateModel {
	bans: { [banId: string]: BanDetail }
	fetching: boolean
	focusGroups: []
	vendorConfigDetails: {}
	buyerDetails: {}
	billingDetails: []
	billingTypes: {}
	afterBanData: {}
}

@State<BanStateModel>({
	name: 'ban',
	defaults: {
		bans: {},
		fetching: false,
		focusGroups: [],
		vendorConfigDetails: {},
		buyerDetails: {},
		billingDetails: [],
		billingTypes: {},
		afterBanData: {}
	}
})
export class BanState {

	constructor(private banService: BanService) { }

	@Selector()
	static getBansDetails({ bans }: BanStateModel) {
		return Object.keys(bans).map(k => bans[k])
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
		return Object.keys(vendorConfigDetails).map(k => vendorConfigDetails[k])
	}

	@Selector()
	static getBuyerDetails({ buyerDetails }: BanStateModel) {
		return Object.keys(buyerDetails).map(k => buyerDetails[k])
	}

	@Selector()
	static getBillingDetails({ billingDetails }: BanStateModel) {
		return billingDetails
	}

	@Selector()
	static getBillingTypes({ billingTypes }: BanStateModel) {
		return billingTypes
	}

	@Selector()
	static getAfterDataBan({ afterBanData }: BanStateModel) {
		return afterBanData
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
					vendorConfigDetails: _.keyBy(response, 'vendorConfigId')
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
					buyerDetails: _.keyBy(response, 'buyerId')
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

	@Action(BanActions.UpsertBan)
	async upsertBan({ getState, patchState, }: StateContext<BanStateModel>, { payload }: BanActions.UpsertBan) {
		try {
			const { bans } = getState()
			const { statusMessage, Error: error, banDetails = null } = await this.banService.upsertBan(payload).toPromise()
			if (error) throw statusMessage
			patchState({ bans: { ...bans, [banDetails.banId]: banDetails }, afterBanData: banDetails })
			await this.open({ message: statusMessage, type: 'success' })
		} catch (e) {
			console.error('error', e)
			this.open({ message: e, type: 'error' })
			throw e
		}
	}

	@Action(BanActions.CleanAfterBanData)
	cleanAfterBanData({ patchState }: StateContext<BanStateModel>) {
		patchState({ afterBanData: {} })
	}

	@Action(BanActions.AddVendorDetails)
	addVendorDetails({ patchState, getState }: StateContext<BanStateModel>, { payload }: BanActions.AddVendorDetails) {
		const { vendorConfigDetails } = getState()
		if (!_.isEmpty(vendorConfigDetails))
			patchState({ vendorConfigDetails: { ...vendorConfigDetails, [payload.vendorConfigId]: payload } })
	}

	@Action(BanActions.AddBuyerDetails)
	addBuyerDetails({ patchState, getState }: StateContext<BanStateModel>, { payload }: BanActions.AddBuyerDetails) {
		const { buyerDetails } = getState()
		if (!_.isEmpty(buyerDetails))
			patchState({ buyerDetails: { ...buyerDetails, [payload.buyerId]: payload } })
	}

	private open({ message, type }) {
		return swal.fire({ icon: type, text: message })
	}
}