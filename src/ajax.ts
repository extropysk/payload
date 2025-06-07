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

export const ajax = async <T>(
  url: string,
  method: AjaxMethod,
  body?: Obj | null,
  { credentials, headers }: AjaxOptions = {},
): Promise<T> => {
  const response = await fetch(url, {
    method,
    credentials,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json()
  if (response.ok) {
    return data as T
  }

  throw new AjaxError(response.status, data.message ?? response.statusText, data.errors)
}
