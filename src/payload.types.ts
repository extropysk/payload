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

export type Base = {
  id: string
}

export type User = Base & {
  email: string
  [key: string]: unknown
}

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
  locale?: string
}

export type FindParams = BaseParams & {
  where?: Where
  sort?: string
  page?: number
  limit?: number
}

export type LoginResponse<U extends User> = {
  message: string
  user: U
  token: string
  exp: number
}

export type CountResponse = { totalDocs: number }
