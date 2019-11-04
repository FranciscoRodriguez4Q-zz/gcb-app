import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SiteDetailsService } from './site-details.service';

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss', '../ban.component.scss']
})
export class SiteDetailsComponent {

  @Input() set countryId(value: any) {
    this.cleanInputs()
    this._countryId = value
  }
  @Output() locationId = new EventEmitter();

  get countryId() {
    return this._countryId;
  }

  private _countryId: any;

  private _detailInfo;
  @Input() set detailInfo(value: any) {
    if (value) {
      const { detailedLocationId, billedToLocationId } = value;
      if (detailedLocationId === 0) {
        this.locationType = 0;
        this.countryId = billedToLocationId;
        this.detailedLocationId = "0"
      } else {
        this.getLocations(billedToLocationId, 2).then(list => {
          this.getLocations(billedToLocationId, 1).then(list1 => {
            const citySite = list.find(({ locationId }) => locationId === Number(detailedLocationId))
            const state = list1.find(({ locationId }) => locationId === Number(detailedLocationId))
            this.countryId = billedToLocationId;
            if (citySite) {
              this.locationType = 2;
            } else if(state) {
              this.locationType = 1;
            }
            this.detailedLocationId = detailedLocationId
            this.fetchLocations()
          })
        })
      }
    } else {
      this.cleanInputs()
    }
    this._detailInfo = value;
  }
  get detailInfo() {
    return this._detailInfo;
  }


  private readonly locationTypeList = [{
    label: "UNSPECIFIED",
    value: 0
  },{
    label: "State-Province",
    value: 1
  },{
    label: "City-Site",
    value: 2
  }]

  public set locationType(value) {
    if (value === 0) {
      this.detailedLocationId = "0"
    }
    this._locationType = value
  }
  public get locationType() {
    return this._locationType
  }
  public _locationType: number = 0

  public set detailedLocationId(value) {
    this._detailedLocationId = value
    this.locationId.emit(value)
  }
  public get detailedLocationId() {
    return this._detailedLocationId;
  }
  public _detailedLocationId = ""

  public locationsByCountryList

  constructor(
    private siteDetailsService: SiteDetailsService,
    ) { }

  get isLocationType() {
    return this.locationType === 0
  }

  get isCountry() {
    return this.countryId === null
  }

  fetchLocations() {
    if (this.countryId) {
      this.siteDetailsService.getAllLocationsByCountry(this.countryId, this.locationType).subscribe(
        data => {
          console.log('[INFO] - SiteDetailsComponent - getAllLocationsByCountry')
          this.locationsByCountryList = data.map(({ locationId, locationCode, locationName }) => {
            return {
              label: `${locationCode} | ${locationName}`,
              value: locationId
            }
          });
          this.locationsByCountryList.unshift({ label: 'UNSPECIFIED', value: 0 })
        }
      );
    }
  }

  getLocations(countryId, type) {
    return this.siteDetailsService.getAllLocationsByCountry(countryId, type).toPromise()
  }

  cleanInputs() {
    this.locationsByCountryList = []
    this.locationType = 0;
    this._countryId = null;
  }

}
