export interface ApiError {
  message: string
  code?: string | number
  details?: any
}

export class ErrorHandler {
  static async handleApiCall<T>(
    apiCall: () => Promise<T>,
    fallbackValue?: T,
    customErrorMessage?: string
  ): Promise<T | null> {
    try {
      return await apiCall()
    } catch (error) {
      const errorMessage = this.parseError(error, customErrorMessage)
      this.showErrorNotification(errorMessage)
      console.error('API Error:', error)
      
      if (fallbackValue !== undefined) {
        return fallbackValue
      }
      return null
    }
  }

  static parseError(error: any, customMessage?: string): string {
    if (customMessage) return customMessage
    
    if (error?.response?.data?.message) {
      return error.response.data.message
    }
    
    if (error?.message) {
      return error.message
    }
    
    if (typeof error === 'string') {
      return error
    }
    
    return '알 수 없는 오류가 발생했습니다.'
  }

  static showErrorNotification(message: string) {
    // Use browser notification or console as fallback
    console.error('Error:', message)
    
    // Try to show browser notification if available (client-side only)
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('오류', { body: message })
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('오류', { body: message })
          }
        })
      }
    }
    
    // Also dispatch a custom event for UI components to catch
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app:error', { 
        detail: { message } 
      }))
    }
  }

  static async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        if (attempt === maxRetries) {
          throw error
        }
        
        console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        delay *= 2 // Exponential backoff
      }
    }
    
    throw new Error('Max retries exceeded')
  }
}

// Composable for error handling
export const useErrorHandler = () => {
  const handleError = (error: any, customMessage?: string) => {
    return ErrorHandler.parseError(error, customMessage)
  }

  const apiCall = async <T>(
    call: () => Promise<T>,
    fallback?: T,
    customMessage?: string
  ) => {
    return ErrorHandler.handleApiCall(call, fallback, customMessage)
  }

  const retry = async <T>(
    operation: () => Promise<T>,
    maxRetries?: number,
    delay?: number
  ) => {
    return ErrorHandler.retry(operation, maxRetries, delay)
  }

  return {
    handleError,
    apiCall,
    retry
  }
}