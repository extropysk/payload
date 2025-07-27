import * as qs from 'qs'
import { ajax, AjaxMethod, AjaxOptions } from './ajax'
import {
  BaseParams,
  CountResponse,
  Doc,
  FindParams,
  UserResponse,
  Obj,
  PaginatedDocs,
  User,
  BaseResponse,
} from './types'

type PayloadConfig = {
  baseUrl: string
  options?: AjaxOptions
  getBearerToken?: () => string | null
}

const DEFAULT_CONFIG: PayloadConfig = {
  baseUrl: '',
}

export class Payload<T extends Record<string, unknown>> {
  readonly config: PayloadConfig

  constructor(config?: PayloadConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  find = <Key extends keyof T>(collection: Key, params?: FindParams) => {
    return this.request<PaginatedDocs<T[Key]>>(String(collection), 'GET', null, params)
  }

  findByID = <Key extends keyof T>(collection: Key, id: string, params?: BaseParams) => {
    return this.request<T[Key]>(`${String(collection)}/${id}`, 'GET', null, params)
  }

  create = <Key extends keyof T>(collection: Key, body: Partial<T[Key]>) => {
    return this.request<Doc<T[Key]>>(String(collection), 'POST', body)
  }

  update = <Key extends keyof T>(collection: Key, id: string, body: Partial<T[Key]>) => {
    return this.request<Doc<T[Key]>>(`${String(collection)}/${id}`, 'PUT', body)
  }

  delete = <Key extends keyof T>(collection: Key, id: string) => {
    return this.request<T[Key]>(`${String(collection)}/${id}`, 'DELETE')
  }

  count = <Key extends keyof T>(collection: Key, params?: FindParams) => {
    return this.request<CountResponse>(`${String(collection)}/count`, 'GET', null, params)
  }

  me = <U extends User = User>() => {
    return this.request<UserResponse<U | null>>(`users/me`, 'GET')
  }

  login = <U extends User = User>(email: string, password: string) => {
    return this.request<UserResponse<U>>(`users/login`, 'POST', { email, password })
  }

  logout = () => {
    return this.request<BaseResponse>(`users/logout`, 'POST')
  }

  request = <U>(endpoint: string, method?: AjaxMethod, body?: Obj | null, params?: Obj) => {
    const query = qs.stringify(params, { addQueryPrefix: true })
    const url = `${this.config.baseUrl}/api/${endpoint}${query}`

    const headers: Record<string, string> = { ...this.config.options?.headers }
    const token = this.config.getBearerToken?.()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    const options = { ...this.config.options, headers }

    return ajax<U>({ url, method, body, options })
  }
}
