import * as qs from 'qs'
import { ajax, AjaxMethod, AjaxOptions } from './ajax'
import { BaseParams, CountResponse, Doc, FindParams, Obj, PaginatedDocs } from './types'

export type PayloadBaseConfig = {
  baseUrl: string
  options?: AjaxOptions
  getBearerToken?: () => string | null
}

export const DEFAULT_CONFIG: PayloadBaseConfig = {
  baseUrl: '',
}

export type RequestArgs = {
  endpoint: string
  method?: AjaxMethod
  body?: Obj
  params?: Obj
  headers?: Record<string, string>
}

export class PayloadBase<T extends Record<string, unknown>> {
  readonly config: PayloadBaseConfig

  constructor(config?: PayloadBaseConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  find<Key extends keyof T>(collection: Key, params?: FindParams) {
    return this.request<PaginatedDocs<T[Key]>>({
      endpoint: String(collection),
      method: 'GET',
      params,
    })
  }

  findByID<Key extends keyof T>(collection: Key, id: string, params?: BaseParams) {
    return this.request<T[Key]>({ endpoint: `${String(collection)}/${id}`, method: 'GET', params })
  }

  create<Key extends keyof T>(collection: Key, body: Partial<T[Key]>, params?: BaseParams) {
    return this.request<Doc<T[Key]>>({ endpoint: String(collection), method: 'POST', body, params })
  }

  update<Key extends keyof T>(
    collection: Key,
    id: string,
    body: Partial<T[Key]>,
    params?: BaseParams,
  ) {
    return this.request<Doc<T[Key]>>({
      endpoint: `${String(collection)}/${id}`,
      method: 'PUT',
      body,
      params,
    })
  }

  delete<Key extends keyof T>(collection: Key, id: string) {
    return this.request<T[Key]>({ endpoint: `${String(collection)}/${id}`, method: 'DELETE' })
  }

  count<Key extends keyof T>(collection: Key, params?: FindParams) {
    return this.request<CountResponse>({ endpoint: `${String(collection)}/count`, params })
  }

  protected buildOptions(extraHeaders?: Record<string, string>): AjaxOptions {
    const token = this.config.getBearerToken?.()
    return {
      ...this.config.options,
      headers: {
        ...this.config.options?.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extraHeaders,
      },
    }
  }

  request<U>({ endpoint, method = 'GET', body, params, headers }: RequestArgs) {
    const query = qs.stringify(params, { addQueryPrefix: true })
    const url = `${this.config.baseUrl}/api/${endpoint}${query}`
    const options = this.buildOptions({ 'Content-Type': 'application/json', ...headers })

    return ajax<U>({ url, method, body, options })
  }
}
