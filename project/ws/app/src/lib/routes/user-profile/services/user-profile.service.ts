import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { IUserProfileDetails,
  ILanguagesApiData,
  INationalityApiData,
  IUserProfileDetailsFromRegistry,
  IProfileMetaApiData,
} from '../models/user-profile.model'

const API_ENDPOINTS = {
  updateProfileDetails: '/apis/protected/v8/user/profileDetails/createUserRegistry',
  getUserdetailsFromRegistry: '/apis/protected/v8/user/profileDetails/getUserRegistry',
  getUserdetails: '/apis/protected/v8/user/details/detailV1',
  getMasterNationlity: '/apis/protected/v8/user/profileDetails/getMasterNationalities',
  getMasterLanguages: '/apis/protected/v8/user/profileDetails/getMasterLanguages',
  getProfilePageMeta: '/apis/protected/v8/user/profileDetails/getProfilePageMeta',
}

@Injectable()
export class UserProfileService {
  constructor(
    private http: HttpClient,
  ) {
  }
  updateProfileDetails(data: any) {
    return this.http.post(API_ENDPOINTS.updateProfileDetails, data)
  }
  getUserdetails(email: string | undefined): Observable<[IUserProfileDetails]> {
    return this.http.post<[IUserProfileDetails]>(API_ENDPOINTS.getUserdetails, { email })
  }
  getMasterLanguages(): Observable<ILanguagesApiData> {
    return this.http.get<ILanguagesApiData>(API_ENDPOINTS.getMasterLanguages)
  }
  getMasterNationlity(): Observable<INationalityApiData> {
    return this.http.get<INationalityApiData>(API_ENDPOINTS.getMasterNationlity)
  }
  getProfilePageMeta(): Observable<IProfileMetaApiData> {
    return this.http.get<IProfileMetaApiData>(API_ENDPOINTS.getProfilePageMeta)
  }
  getUserdetailsFromRegistry(): Observable<[IUserProfileDetailsFromRegistry]> {
    return this.http.get<[IUserProfileDetailsFromRegistry]>(API_ENDPOINTS.getUserdetailsFromRegistry)
  }
}
