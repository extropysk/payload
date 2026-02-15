import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PayloadBase } from './payload-base'
import * as ajaxModule from './ajax'

vi.mock('./ajax', () => ({
  ajax: vi.fn(),
}))

const mockAjax = vi.mocked(ajaxModule.ajax)

type Collections = {
  posts: { id: string; title: string; content: string }
  users: { id: string; email: string }
}

describe('PayloadBase', () => {
  let payload: PayloadBase<Collections>

  beforeEach(() => {
    vi.clearAllMocks()
    payload = new PayloadBase<Collections>({ baseUrl: 'https://api.example.com' })
  })

  describe('constructor', () => {
    it('should use default config when no config provided', () => {
      const p = new PayloadBase()
      expect(p.config.baseUrl).toBe('')
    })

    it('should merge provided config with defaults', () => {
      const p = new PayloadBase({ baseUrl: 'https://test.com' })
      expect(p.config.baseUrl).toBe('https://test.com')
    })

    it('should accept options in config', () => {
      const p = new PayloadBase({
        baseUrl: 'https://test.com',
        options: { credentials: 'include' },
      })
      expect(p.config.options?.credentials).toBe('include')
    })
  })

  describe('find', () => {
    it('should call ajax with correct URL for collection', async () => {
      mockAjax.mockResolvedValue({ docs: [], totalDocs: 0 })

      await payload.find('posts')

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.example.com/api/posts',
          method: 'GET',
        }),
      )
    })

    it('should include query params in URL', async () => {
      mockAjax.mockResolvedValue({ docs: [], totalDocs: 0 })

      await payload.find('posts', { limit: 10, page: 2 })

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('limit=10'),
        }),
      )
      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('page=2'),
        }),
      )
    })

    it('should include where clause in params', async () => {
      mockAjax.mockResolvedValue({ docs: [], totalDocs: 0 })

      await payload.find('posts', { where: { title: { equals: 'test' } } })

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('where'),
        }),
      )
    })
  })

  describe('findByID', () => {
    it('should call ajax with ID in URL', async () => {
      mockAjax.mockResolvedValue({ id: '123', title: 'Test' })

      await payload.findByID('posts', '123')

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.example.com/api/posts/123',
          method: 'GET',
        }),
      )
    })

    it('should include params in URL', async () => {
      mockAjax.mockResolvedValue({ id: '123', title: 'Test' })

      await payload.findByID('posts', '123', { depth: 2 })

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('depth=2'),
        }),
      )
    })
  })

  describe('create', () => {
    it('should call ajax with POST method and body', async () => {
      mockAjax.mockResolvedValue({ doc: { id: '1', title: 'New Post' } })

      await payload.create('posts', { title: 'New Post', content: 'Content' })

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.example.com/api/posts',
          method: 'POST',
          body: { title: 'New Post', content: 'Content' },
        }),
      )
    })

    it('should include params in URL', async () => {
      mockAjax.mockResolvedValue({ doc: { id: '1', title: 'New Post' } })

      await payload.create('posts', { title: 'New Post' }, { depth: 1 })

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('depth=1'),
        }),
      )
    })
  })

  describe('update', () => {
    it('should call ajax with PUT method and ID in URL', async () => {
      mockAjax.mockResolvedValue({ doc: { id: '123', title: 'Updated' } })

      await payload.update('posts', '123', { title: 'Updated' })

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.example.com/api/posts/123',
          method: 'PUT',
          body: { title: 'Updated' },
        }),
      )
    })

    it('should include params in URL', async () => {
      mockAjax.mockResolvedValue({ doc: { id: '123', title: 'Updated' } })

      await payload.update('posts', '123', { title: 'Updated' }, { locale: 'en' })

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('locale=en'),
        }),
      )
    })
  })

  describe('delete', () => {
    it('should call ajax with DELETE method', async () => {
      mockAjax.mockResolvedValue({ id: '123', title: 'Deleted' })

      await payload.delete('posts', '123')

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.example.com/api/posts/123',
          method: 'DELETE',
        }),
      )
    })
  })

  describe('count', () => {
    it('should call ajax with /count endpoint', async () => {
      mockAjax.mockResolvedValue({ totalDocs: 42 })

      await payload.count('posts')

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.example.com/api/posts/count',
        }),
      )
    })

    it('should include where params', async () => {
      mockAjax.mockResolvedValue({ totalDocs: 5 })

      await payload.count('posts', { where: { title: { equals: 'test' } } })

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('where'),
        }),
      )
    })
  })

  describe('request', () => {
    it('should include Content-Type header', async () => {
      mockAjax.mockResolvedValue({})

      await payload.request({ endpoint: 'test' })

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
          }),
        }),
      )
    })

    it('should include bearer token when getBearerToken returns value', async () => {
      const payloadWithToken = new PayloadBase<Collections>({
        baseUrl: 'https://api.example.com',
        getBearerToken: () => 'my-token',
      })
      mockAjax.mockResolvedValue({})

      await payloadWithToken.request({ endpoint: 'test' })

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: 'Bearer my-token',
            }),
          }),
        }),
      )
    })

    it('should not include Authorization header when getBearerToken returns null', async () => {
      const payloadWithNullToken = new PayloadBase<Collections>({
        baseUrl: 'https://api.example.com',
        getBearerToken: () => null,
      })
      mockAjax.mockResolvedValue({})

      await payloadWithNullToken.request({ endpoint: 'test' })

      const call = mockAjax.mock.calls[0][0]
      expect(call.options?.headers).not.toHaveProperty('Authorization')
    })

    it('should merge custom headers', async () => {
      mockAjax.mockResolvedValue({})

      await payload.request({ endpoint: 'test', headers: { 'X-Custom': 'value' } })

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            headers: expect.objectContaining({
              'X-Custom': 'value',
            }),
          }),
        }),
      )
    })

    it('should pass options from config', async () => {
      const payloadWithOptions = new PayloadBase<Collections>({
        baseUrl: 'https://api.example.com',
        options: { credentials: 'include' },
      })
      mockAjax.mockResolvedValue({})

      await payloadWithOptions.request({ endpoint: 'test' })

      expect(mockAjax).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            credentials: 'include',
          }),
        }),
      )
    })
  })
})
