import { map, catchError } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of, BehaviorSubject } from 'rxjs'
import { ConfigurationsService } from '@ws-widget/utils'
// import { environment } from './../../../../../../../src/environments/environment'

// let instanceConfigPath: string | null = window.location.host

// if (!environment.production && Boolean(environment.sitePath)) {
//   instanceConfigPath = environment.sitePath
// }

@Injectable({
  providedIn: 'root',
})
export class OrgServiceService {
  hideHeaderFooter = new BehaviorSubject<boolean>(false)
  sitePath = `assets/configurations/`

  constructor(private http: HttpClient, private configSvc: ConfigurationsService) { }

  resolve(): Observable<any> {
    return this.getOrgMetadata().pipe(
      map((data: any) => ({ data, error: null })),
      catchError((error: any) => of({ error, data: null })),
    )
  }

  getOrgMetadata() {
    const orgMeta = this.http.get(`${this.sitePath}/orgmeta.config.json`)
    return orgMeta
  }

  getDatabyOrgId(): Promise<any>  {
    const url = `${this.configSvc.sitePath}/page/course.json`
    return this.http.get<any>(`${url}`).toPromise()
  }
}
