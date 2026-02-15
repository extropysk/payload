import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Payload } from './payload'
import * as ajaxModule from './ajax'

vi.mock('./ajax', () => ({
  ajax: vi.fn(),
}))

const mockAjax = vi.mocked(ajaxModule.ajax)

type Collections = {
  posts: { id: string; title: string; content: string }
  users: { id: string; email: string }
}

describe('Payload', () => {
  let payload: Payload<Collections>

  beforeEach(() => {
    vi.clearAllMocks()
    payload = new Payload<Collections>({ baseUrl: 'https://api.example.com' })
  })

  describe('me', () => {
    it('should call ajax with users/me endpoint', async () => {
      mockAjax.mockResolvedValue({ user: { id: '1', email: 'test@test.com' } })

      await payload.me()

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.example.com/api/users/me',
        }),
      )
    })
  })

  describe('login', () => {
    it('should call ajax with POST to users/login', async () => {
      mockAjax.mockResolvedValue({ user: { id: '1' }, token: 'abc' })

      await payload.login('test@test.com', 'password123')

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.example.com/api/users/login',
          method: 'POST',
          body: { email: 'test@test.com', password: 'password123' },
        }),
      )
    })
  })

  describe('logout', () => {
    it('should call ajax with POST to users/logout', async () => {
      mockAjax.mockResolvedValue({ message: 'Logged out' })

      await payload.logout()

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.example.com/api/users/logout',
          method: 'POST',
        }),
      )
    })
  })

  describe('upload', () => {
    it('should call ajax with FormData', async () => {
      mockAjax.mockResolvedValue({ doc: { id: '1' } })
      const file = new Blob(['test'], { type: 'text/plain' })

      await payload.upload('posts', file, { title: 'Upload' })

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.example.com/api/posts',
          method: 'POST',
          body: expect.any(FormData),
        }),
      )
    })
  })
})
