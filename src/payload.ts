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

type RequestArgs = {
  endpoint: string
  method?: AjaxMethod
  body?: Obj
  params?: Obj
  headers?: Record<string, string>
}

export class Payload<T extends Record<string, unknown>> {
  readonly config: PayloadConfig

  constructor(config?: PayloadConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  find = <Key extends keyof T>(collection: Key, params?: FindParams) => {
    return this.request<PaginatedDocs<T[Key]>>({
      endpoint: String(collection),
      method: 'GET',
      params,
    })
  }

  findByID = <Key extends keyof T>(collection: Key, id: string, params?: BaseParams) => {
    return this.request<T[Key]>({ endpoint: `${String(collection)}/${id}`, method: 'GET', params })
  }

  create = <Key extends keyof T>(collection: Key, body: Partial<T[Key]>, params?: BaseParams) => {
    return this.request<Doc<T[Key]>>({ endpoint: String(collection), method: 'POST', body, params })
  }

  update = <Key extends keyof T>(
    collection: Key,
    id: string,
    body: Partial<T[Key]>,
    params?: BaseParams,
  ) => {
    return this.request<Doc<T[Key]>>({
      endpoint: `${String(collection)}/${id}`,
      method: 'PUT',
      body,
      params,
    })
  }

  delete = <Key extends keyof T>(collection: Key, id: string) => {
    return this.request<T[Key]>({ endpoint: `${String(collection)}/${id}`, method: 'DELETE' })
  }

  count = <Key extends keyof T>(collection: Key, params?: FindParams) => {
    return this.request<CountResponse>({ endpoint: `${String(collection)}/count`, params })
  }

  me = <U extends User = User>() => {
    return this.request<UserResponse<U | null>>({ endpoint: `users/me` })
  }

  login = <U extends User = User>(email: string, password: string) => {
    return this.request<UserResponse<U>>({
      endpoint: `users/login`,
      method: 'POST',
      body: { email, password },
    })
  }

  logout = () => {
    return this.request<BaseResponse>({ endpoint: `users/logout`, method: 'POST' })
  }

  upload = <Key extends keyof T>(collection: Key, file: Blob, body: Partial<T[Key]>) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('_payload', JSON.stringify(body))

    const url = `${this.config.baseUrl}/api/${String(collection)}`

    return ajax<Doc<T[Key]>>({ url, method: 'POST', body: formData, options: this.config.options })
  }

  request = <U>({ endpoint, method = 'GET', body, params, headers }: RequestArgs) => {
    const query = qs.stringify(params, { addQueryPrefix: true })
    const url = `${this.config.baseUrl}/api/${endpoint}${query}`

    const token = this.config.getBearerToken?.()
    const options = {
      ...this.config.options,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.options?.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    }

    return ajax<U>({ url, method, body, options })
  }
}
