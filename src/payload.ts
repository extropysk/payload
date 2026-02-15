import { ajax } from './ajax'
import { PayloadBase, PayloadBaseConfig } from './payload-base'
import { BaseResponse, Doc, User, UserResponse } from './types'

export type PayloadConfig = PayloadBaseConfig & {
  setBearerToken?: (token: string | null) => void
}

export class Payload<T extends Record<string, unknown>> extends PayloadBase<T> {
  declare readonly config: PayloadConfig

  constructor(config?: PayloadConfig) {
    super(config)
  }

  me<U extends User = User>() {
    return this.request<UserResponse<U | null>>({ endpoint: `users/me` })
  }

  async login<U extends User = User>(email: string, password: string) {
    const res = await this.request<UserResponse<U>>({
      endpoint: `users/login`,
      method: 'POST',
      body: { email, password },
    })

    this.config.setBearerToken?.(res.token)
    return res
  }

  async logout() {
    const res = await this.request<BaseResponse>({ endpoint: `users/logout`, method: 'POST' })

    this.config.setBearerToken?.(null)
    return res
  }

  upload<Key extends keyof T>(collection: Key, file: Blob, body: Partial<T[Key]>) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('_payload', JSON.stringify(body))

    const url = `${this.config.baseUrl}/api/${String(collection)}`
    const token = this.config.getBearerToken?.()
    const options = {
      ...this.config.options,
      headers: {
        ...this.config.options?.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }

    return ajax<Doc<T[Key]>>({ url, method: 'POST', body: formData, options })
  }
}
