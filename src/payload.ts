import qs from 'qs'
import { ajax, AjaxMethod, AjaxOptions } from './ajax'

const OPERATORS = [
  'equals',
  'contains',
  'not_equals',
  'in',
  'all',
  'not_in',
  'exists',
  'greater_than',
  'greater_than_equal',
  'less_than',
  'less_than_equal',
  'like',
  'within',
  'intersects',
  'near',
] as const

type Operator = (typeof OPERATORS)[number]
type WhereField = {
  // eslint-disable-next-line no-unused-vars
  [key in Operator]?: unknown
}
export type Where = {
  [key: string]: Where[] | WhereField | undefined
  and?: Where[]
  or?: Where[]
}

export type PaginatedDocs<T> = {
  docs: T[]
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage?: null | number
  page?: number
  pagingCounter: number
  prevPage?: null | number
  totalDocs: number
  totalPages: number
}

export type Doc<T> = {
  message: string
  doc: T
}

export type BaseParams = {
  depth?: number
}

export type FindParams = BaseParams & {
  where?: Where
  depth?: number
  sort?: string
  page?: number
  limit?: number
}

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

  getOptions = (): AjaxOptions => {
    const headers: Record<string, string> = { ...this.config.options?.headers }

    const token = this.config.getBearerToken?.()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return { ...this.config.options, headers }
  }

  find = <Key extends keyof T>(collection: Key, params: FindParams = {}) => {
    const query = qs.stringify(params, { addQueryPrefix: true })
    const url = `${this.config.baseUrl}/api/${String(collection)}${query}`

    return ajax<PaginatedDocs<T[Key]>>(url, 'GET', null, this.getOptions())
  }

  findByID = <Key extends keyof T>(collection: Key, id: string, params: BaseParams = {}) => {
    const query = qs.stringify(params, { addQueryPrefix: true })
    const url = `${this.config.baseUrl}/api/${String(collection)}/${id}${query}`

    return ajax<T[Key]>(url, 'GET', null, this.getOptions())
  }

  create = <Key extends keyof T>(collection: Key, body: Partial<T[Key]>) => {
    const url = `${this.config.baseUrl}/api/${String(collection)}`

    return ajax<Doc<T[Key]>>(url, 'POST', body, this.getOptions())
  }

  update = <Key extends keyof T>(collection: Key, id: string, body: Partial<T[Key]>) => {
    const url = `${this.config.baseUrl}/api/${String(collection)}/${id}`

    return ajax<Doc<T[Key]>>(url, 'PUT', body, this.getOptions())
  }

  request = <U>(
    endpoint: string,
    method: AjaxMethod,
    body?: object,
    params: Record<string, unknown> = {},
  ) => {
    const query = qs.stringify(params, { addQueryPrefix: true })
    const url = `${this.config.baseUrl}/api/${endpoint}${query}`

    return ajax<U>(url, method, body, this.getOptions())
  }
}
