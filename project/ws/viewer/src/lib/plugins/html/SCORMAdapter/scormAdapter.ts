/* tslint:disable */
import { Injectable } from '@angular/core'
import { Storage, IScromData } from './storage'
import { errorCodes } from './errors'
import _ from 'lodash'
import { HttpClient } from '@angular/common/http'
import { ConfigurationsService } from '../../../../../../../../library/ws-widget/utils/src/public-api'
import { NsContent } from '@ws-widget/collection'
import { ActivatedRoute } from '@angular/router'
import dayjs from 'dayjs'
const API_END_POINTS = {
  SCROM_ADD_UPDTE: '/apis/protected/v8/scrom/add',
  SCROM_FETCH: '/apis/protected/v8/scrom/get',
  SCROM_UPDTE_PROGRESS: `/apis/proxies/v8/content-progres`,
  SCROM_FETCH_PROGRESS: `/apis/proxies/v8/read/content-progres`,
}
@Injectable({
  providedIn: 'root',
})
export class SCORMAdapterService {
  id = ''
  constructor(private store: Storage,
    private http: HttpClient,
    private configSvc: ConfigurationsService,
    private activatedRoute: ActivatedRoute) { }

  set contentId(id: string) {
    this.store.key = id
    this.id = id
  }

  get contentId() {
    return this.id
  }

  LMSInitialize() {
    this.store.contentKey = this.contentId
    // this.loadDataAsync().subscribe((response) => {
    //   const data = response.result.data
    //   const loadDatas: IScromData = {
    //     "cmi.core.exit": data["cmi.core.exit"],
    //     "cmi.core.lesson_status": data["cmi.core.lesson_status"],
    //     "cmi.core.session_time": data["cmi.core.session_time"],
    //     "cmi.suspend_data": data["cmi.suspend_data"],
    //     Initialized: true,
    //   }
    //   this.store.setAll(loadDatas)
    // }, (error) => {
    //   if (error) {
    //     this._setError(101)
    //   }
    // })
    this.store.setItem('Initialized', true)
    return true
  }

  LMSFinish() {
    if (!this._isInitialized()) {
      this._setError(301)
      return false
    }
    let _return = this.LMSCommit()
    this.store.setItem('Initialized', false)
    this.store.clearAll()
    return _return
  }

  LMSGetValue(element: any) {
    if (!this._isInitialized()) {
      this._setError(301)
      return false
    }
    let value = this.store.getItem(element)
    if (!value) {
      this._setError(201)
      return ""
    }
    return value
  }

  LMSSetValue(element: any, value: any) {
    if (!this._isInitialized()) {
      this._setError(301)
      return false
    }
    this.store.setItem(element, value)
    return this.store.getItem(element)
  }

  LMSCommit() {
    let data = this.store.getAll()
    if (data) {
      delete data['errors']
      // delete data['Initialized']
      // let newData = JSON.stringify(data)
      // data = Base64.encode(newData)
      let _return = false
      this.addDataV2(data).subscribe((response) => {
        // console.log(response)
        if (response) {
          _return = true
        }
      }, (error) => {
        if (error) {
          this._setError(101)
          // console.log(error)
        }
      })
      return _return
    }
    return false
  }

  LMSGetLastError() {
    const newErrors = JSON.parse(this.store.getItem('errors') || '[]')
    if (newErrors && newErrors.length > 0) {
      return newErrors.pop()
    }
    return ""
  }

  LMSGetErrorString(errorCode: number) {
    let error = errorCodes[errorCode]
    if (!error) return ""
    return error[errorCode]["errorString"]
  }

  LMSGetDiagnostic(errorCode: number) {
    let error = errorCodes[errorCode]
    if (!error) return ""
    return error[errorCode]["diagnostic"]
  }

  _isInitialized() {
    let initialized = this.store.getItem('Initialized')
    return initialized
  }

  _setError(errorCode: number) {
    let errors = this.store.getItem('errors')
    if (!errors) errors = '[]'
    const newErrors = JSON.parse(errors)
    if (newErrors && typeof (newErrors) === 'object') {
      newErrors.push(errorCode)
    }
    this.store.setItem('errors', errors)
  }
  loadDataAsync() {
    return this.http.get<any>(API_END_POINTS.SCROM_FETCH + '/' + this.contentId)
  }

  loadDataV2() {
    let userId
    if (this.configSvc.userProfile) {
      userId = this.configSvc.userProfile.userId || ''
    }
    const req: NsContent.IContinueLearningDataReq = {
      request: {
        userId,
        batchId: this.activatedRoute.snapshot.queryParamMap.get('batchId') || '',
        courseId: this.activatedRoute.snapshot.queryParams.collectionId || '',
        contentIds: [],
        fields: ['progressdetails'],
      },
    }
    this.http.post<NsContent.IContinueLearningData>(
      `${API_END_POINTS.SCROM_FETCH_PROGRESS}/${req.request.courseId}`, req
    ).subscribe(
      data => {
        if (data && data.result && data.result.contentList.length) {
          for (const content of data.result.contentList) {
            if (content.contentId === this.contentId && content.progressdetails) {
              const data = content.progressdetails
              const loadDatas: IScromData = {
                "cmi.core.exit": data["cmi.core.exit"],
                "cmi.core.lesson_status": data["cmi.core.lesson_status"],
                "cmi.core.session_time": data["cmi.core.session_time"],
                "cmi.suspend_data": data["cmi.suspend_data"],
                Initialized: data["Initialized"],
                // errors: data["errors"]
              }
              this.store.setAll(loadDatas)
            }
          }
        }
      },
    )
  }

  loadData() {
    this.http.get<any>(API_END_POINTS.SCROM_FETCH + '/' + this.contentId).subscribe((response) => {
      // console.log(response.result.data)
      const data = response.result.data
      const loadDatas: IScromData = {
        "cmi.core.exit": data["cmi.core.exit"],
        "cmi.core.lesson_status": data["cmi.core.lesson_status"],
        "cmi.core.session_time": data["cmi.core.session_time"],
        "cmi.suspend_data": data["cmi.suspend_data"],
        Initialized: data["Initialized"],
        // errors: data["errors"]
      }
      this.store.setAll(loadDatas)
    }, (error) => {
      if (error) {
        // console.log(error)
        this._setError(101)
      }
    })
  }
  addData(postData: IScromData) {
    this.http.post(API_END_POINTS.SCROM_ADD_UPDTE + '/' + this.contentId, postData, {
      headers: {
        'content-type': 'application/json'
      }
    })
    return this.http.post(API_END_POINTS.SCROM_ADD_UPDTE + '/' + this.contentId, postData)
  }
  getStatus(postData: any): number {
    try {
      if (postData["cmi.core.lesson_status"] === 'completed') {
        return 2
      }
      return 1
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log('Error in getting completion status', e)
      return 1
    }
  }
  addDataV2(postData: IScromData) {
    let req: any
    if (this.configSvc.userProfile) {
      req = {
        request: {
          userId: this.configSvc.userProfile.userId || '',
          contents: [
            {
              contentId: this.contentId,
              batchId: this.activatedRoute.snapshot.queryParamMap.get('batchId') || '',
              courseId: this.activatedRoute.snapshot.queryParams.collectionId || '',
              status: this.getStatus(postData) || 2,
              lastAccessTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss:SSSZZ'),
              progressdetails: postData
            },
          ],
        },
      }
    } else {
      req = {}
    }
    return this.http.patch(`${API_END_POINTS.SCROM_UPDTE_PROGRESS}/${this.contentId}`, req)
  }
}