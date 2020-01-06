import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SharedActions } from './shared.actions';
import { SharedService } from './shared.service';
import * as _ from 'lodash';
import swal from 'sweetalert2'


class SharedStateModel {
    billProcesses: []
    userDetails: {}
    countries: []
}

const userDefault = {
    sso: '999999999',
    firstName: 'Test',
    lastName: 'User'
}

@State<SharedStateModel>({
    name: 'shared',
    defaults: {
        billProcesses: [],
        userDetails: userDefault,
        countries: []
    }
})
export class SharedState {

    constructor(
        private sharedService: SharedService
    ) { }

    @Selector()
    static getBillProcesses({ billProcesses }: SharedStateModel) {
        return billProcesses
    }

    @Selector()
    static getUserDetails({ userDetails }: SharedStateModel) {
        return userDetails
    }

    @Selector()
    static getCountries({ countries }: SharedStateModel) {
        return countries
    }

    @Action(SharedActions.FetchBillProcesses)
    fetchBillProcesses({ getState, patchState }: StateContext<SharedStateModel>) {
        const { billProcesses } = getState()
        if (_.isEmpty(billProcesses)) {
            this.sharedService.getBillProcessList().toPromise().then(response => {
                patchState({
                    billProcesses: response
                })
            })
        }
    }

    @Action(SharedActions.FetchUserDetails)
    fetchUserDetails({ getState, patchState }: StateContext<SharedStateModel>) {
        const { userDetails } = getState()
        if (_.isEmpty(userDetails) || _.isEqual(userDetails, userDefault)) {
            this.sharedService.getUserData().toPromise().then(({ User }) => {
                const { sso, firstName, lastName, role, roleName } = User
                patchState({
                    userDetails: {
                        sso,
                        firstName,
                        lastName,
                        role,
                        roleNM: roleName
                    }
                })
            })
        }
    }

    @Action(SharedActions.FetchCountry)
    fetchCountries({ getState, patchState }: StateContext<SharedStateModel>) {
        const { countries } = getState()
        if (_.isEmpty(countries)) {
            this.sharedService.getCountryData().toPromise().then(response => {
                patchState({
                    countries: response
                })
            })
        }
    }

    private open({ message, type }) {
        swal.fire({ icon: type, text: message })
    }
}