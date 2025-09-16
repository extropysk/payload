import { Obj } from './types'

type ErrorMessage = {
  message: string
}

export type AjaxOptions = {
  credentials?: RequestCredentials
  headers?: Record<string, string>
}

export class AjaxError extends Error {
  statusCode: number
  errors: ErrorMessage[]

  constructor(statusCode: number, message: string, errors: ErrorMessage[] = []) {
    super(message)
    this.errors = errors
    this.statusCode = statusCode
  }
}

export type AjaxMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type AjaxArgs = {
  url: string
  method?: AjaxMethod
  body?: Obj
  options?: AjaxOptions
}

export const ajax = async <T>({
  url,
  body,
  method = 'GET',
  options: { credentials, headers } = {},
}: AjaxArgs): Promise<T> => {
  const response = await fetch(url, {
    method,
    credentials,
    headers: {
      Accept: 'application/json',
      ...headers,
    },
    body: body instanceof FormData || !body ? body : JSON.stringify(body),
  })

  const data = await response.json()
  if (response.ok) {
    return data as T
  }

  throw new AjaxError(response.status, data.message ?? response.statusText, data.errors)
}
