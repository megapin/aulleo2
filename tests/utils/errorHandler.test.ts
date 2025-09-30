import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ErrorHandler, useErrorHandler } from '../utils/errorHandler'

// Mock console
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn()
}

// Mock window
global.window = {
  ...global.window,
  dispatchEvent: vi.fn(),
  Notification: class MockNotification {
    static permission = 'granted'
    static requestPermission = vi.fn().mockResolvedValue('granted')
    constructor(title: string, options?: NotificationOptions) {}
  }
} as any

describe('ErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('parseError', () => {
    it('should return custom message when provided', () => {
      const error = new Error('Original error')
      const customMessage = 'Custom error message'
      
      const result = ErrorHandler.parseError(error, customMessage)
      
      expect(result).toBe(customMessage)
    })

    it('should extract message from response data', () => {
      const error = {
        response: {
          data: {
            message: 'API error message'
          }
        }
      }
      
      const result = ErrorHandler.parseError(error)
      
      expect(result).toBe('API error message')
    })

    it('should extract message from error object', () => {
      const error = new Error('Direct error message')
      
      const result = ErrorHandler.parseError(error)
      
      expect(result).toBe('Direct error message')
    })

    it('should handle string errors', () => {
      const error = 'String error'
      
      const result = ErrorHandler.parseError(error)
      
      expect(result).toBe('String error')
    })

    it('should return default message for unknown errors', () => {
      const error = { unknown: 'error' }
      
      const result = ErrorHandler.parseError(error)
      
      expect(result).toBe('알 수 없는 오류가 발생했습니다.')
    })
  })

  describe('handleApiCall', () => {
    it('should return result when API call succeeds', async () => {
      const mockApiCall = vi.fn().mockResolvedValue('success')
      
      const result = await ErrorHandler.handleApiCall(mockApiCall)
      
      expect(result).toBe('success')
      expect(mockApiCall).toHaveBeenCalledOnce()
    })

    it('should return fallback value when API call fails', async () => {
      const mockApiCall = vi.fn().mockRejectedValue(new Error('API failed'))
      const fallbackValue = 'fallback'
      
      const result = await ErrorHandler.handleApiCall(mockApiCall, fallbackValue)
      
      expect(result).toBe(fallbackValue)
      expect(console.error).toHaveBeenCalledWith('API Error:', expect.any(Error))
    })

    it('should return null when no fallback provided and API fails', async () => {
      const mockApiCall = vi.fn().mockRejectedValue(new Error('API failed'))
      
      const result = await ErrorHandler.handleApiCall(mockApiCall)
      
      expect(result).toBeNull()
    })
  })

  describe('retry', () => {
    it('should succeed on first attempt', async () => {
      const mockOperation = vi.fn().mockResolvedValue('success')
      
      const result = await ErrorHandler.retry(mockOperation)
      
      expect(result).toBe('success')
      expect(mockOperation).toHaveBeenCalledOnce()
    })

    it('should retry failed operations', async () => {
      const mockOperation = vi.fn()
        .mockRejectedValueOnce(new Error('Attempt 1 failed'))
        .mockRejectedValueOnce(new Error('Attempt 2 failed'))
        .mockResolvedValue('success')
      
      const result = await ErrorHandler.retry(mockOperation)
      
      expect(result).toBe('success')
      expect(mockOperation).toHaveBeenCalledTimes(3)
    })

    it('should throw after max retries exceeded', async () => {
      const mockOperation = vi.fn().mockRejectedValue(new Error('Always fails'))
      
      await expect(ErrorHandler.retry(mockOperation, 2, 10)).rejects.toThrow('Always fails')
      expect(mockOperation).toHaveBeenCalledTimes(2)
    })
  })

  describe('showErrorNotification', () => {
    it('should log error to console', () => {
      ErrorHandler.showErrorNotification('Test error')
      
      expect(console.error).toHaveBeenCalledWith('Error:', 'Test error')
    })

    it('should dispatch custom event', () => {
      ErrorHandler.showErrorNotification('Test error')
      
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'app:error',
          detail: { message: 'Test error' }
        })
      )
    })
  })
})

describe('useErrorHandler', () => {
  it('should return error handling functions', () => {
    const { handleError, apiCall, retry } = useErrorHandler()
    
    expect(typeof handleError).toBe('function')
    expect(typeof apiCall).toBe('function')
    expect(typeof retry).toBe('function')
  })
})