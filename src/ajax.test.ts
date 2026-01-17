import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ajax, AjaxError } from './ajax'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('ajax', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('successful requests', () => {
    it('should return JSON data on success', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      })

      const result = await ajax({ url: 'https://api.example.com/test' })

      expect(result).toEqual({ data: 'test' })
    })

    it('should use GET method by default', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      })

      await ajax({ url: 'https://api.example.com/test' })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({ method: 'GET' }),
      )
    })

    it('should set Accept header to application/json', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      })

      await ajax({ url: 'https://api.example.com/test' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ Accept: 'application/json' }),
        }),
      )
    })
  })

  describe('HTTP methods', () => {
    it.each(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const)(
      'should support %s method',
      async method => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({}),
        })

        await ajax({ url: 'https://api.example.com/test', method })

        expect(mockFetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ method }),
        )
      },
    )
  })

  describe('request body', () => {
    it('should stringify JSON body', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      })

      await ajax({
        url: 'https://api.example.com/test',
        method: 'POST',
        body: { name: 'test', value: 123 },
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ name: 'test', value: 123 }),
        }),
      )
    })

    it('should pass FormData body directly without stringify', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      })

      const formData = new FormData()
      formData.append('file', new Blob(['test']))

      await ajax({
        url: 'https://api.example.com/test',
        method: 'POST',
        body: formData,
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ body: formData }),
      )
    })

    it('should not include body when undefined', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      })

      await ajax({ url: 'https://api.example.com/test' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ body: undefined }),
      )
    })
  })

  describe('options', () => {
    it('should pass credentials option', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      })

      await ajax({
        url: 'https://api.example.com/test',
        options: { credentials: 'include' },
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ credentials: 'include' }),
      )
    })

    it('should merge custom headers with Accept header', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      })

      await ajax({
        url: 'https://api.example.com/test',
        options: { headers: { 'X-Custom': 'value', Authorization: 'Bearer token' } },
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            Accept: 'application/json',
            'X-Custom': 'value',
            Authorization: 'Bearer token',
          },
        }),
      )
    })
  })

  describe('error handling', () => {
    it('should throw AjaxError on non-ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ message: 'Resource not found' }),
      })

      await expect(ajax({ url: 'https://api.example.com/test' })).rejects.toThrow(AjaxError)
    })

    it('should include status code in AjaxError', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ message: 'Invalid input' }),
      })

      try {
        await ajax({ url: 'https://api.example.com/test' })
      } catch (error) {
        expect(error).toBeInstanceOf(AjaxError)
        expect((error as AjaxError).statusCode).toBe(400)
      }
    })

    it('should include message from response in AjaxError', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ message: 'Server error occurred' }),
      })

      try {
        await ajax({ url: 'https://api.example.com/test' })
      } catch (error) {
        expect((error as AjaxError).message).toBe('Server error occurred')
      }
    })

    it('should use statusText when message is not provided', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({}),
      })

      try {
        await ajax({ url: 'https://api.example.com/test' })
      } catch (error) {
        expect((error as AjaxError).message).toBe('Internal Server Error')
      }
    })

    it('should include errors array in AjaxError', async () => {
      const errors = [{ message: 'Field is required' }, { message: 'Invalid format' }]
      mockFetch.mockResolvedValue({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        json: () => Promise.resolve({ message: 'Validation failed', errors }),
      })

      try {
        await ajax({ url: 'https://api.example.com/test' })
      } catch (error) {
        expect((error as AjaxError).errors).toEqual(errors)
      }
    })

    it('should default errors to empty array when not provided', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ message: 'Not found' }),
      })

      try {
        await ajax({ url: 'https://api.example.com/test' })
      } catch (error) {
        expect((error as AjaxError).errors).toEqual([])
      }
    })
  })
})

describe('AjaxError', () => {
  it('should create error with statusCode, message, and errors', () => {
    const error = new AjaxError(404, 'Not found', [{ message: 'Resource missing' }])

    expect(error.statusCode).toBe(404)
    expect(error.message).toBe('Not found')
    expect(error.errors).toEqual([{ message: 'Resource missing' }])
  })

  it('should default errors to empty array', () => {
    const error = new AjaxError(500, 'Server error')

    expect(error.errors).toEqual([])
  })

  it('should be instance of Error', () => {
    const error = new AjaxError(400, 'Bad request')

    expect(error).toBeInstanceOf(Error)
  })
})
