import { ref, computed, nextTick, onMounted, onUnmounted, readonly, type Ref } from 'vue'
import { refDebounced, useThrottleFn } from '@vueuse/core'

// Virtual scrolling composable for large datasets
export const useVirtualScroll = (options: {
  itemHeight: number
  containerHeight: number
  items: Ref<any[]>
  overscan?: number
}) => {
  const { itemHeight, containerHeight, items, overscan = 5 } = options
  
  const scrollTop = ref(0)
  const containerRef = ref<HTMLElement>()
  
  const visibleRange = computed(() => {
    const startIndex = Math.floor(scrollTop.value / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.value.length
    )
    
    return {
      start: Math.max(0, startIndex - overscan),
      end: endIndex
    }
  })
  
  const visibleItems = computed(() => {
    const { start, end } = visibleRange.value
    return items.value.slice(start, end).map((item, index) => ({
      item,
      index: start + index
    }))
  })
  
  const totalHeight = computed(() => items.value.length * itemHeight)
  
  const offsetY = computed(() => visibleRange.value.start * itemHeight)
  
  const onScroll = (event: Event) => {
    const target = event.target as HTMLElement
    scrollTop.value = target.scrollTop
  }
  
  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    onScroll
  }
}

// Debounced search for performance
export const useDebouncedSearch = (delay: number = 300) => {
  const searchTerm = ref('')
  const debouncedSearchTerm = refDebounced(searchTerm, delay)
  
  return {
    searchTerm,
    debouncedSearchTerm
  }
}

// Throttled updates for real-time data
export const useThrottledUpdate = (callback: (...args: any[]) => void, delay: number = 100) => {
  const throttledCallback = useThrottleFn(callback, delay)
  
  return {
    update: throttledCallback
  }
}

// Memory-efficient data processing
export const useDataProcessor = () => {
  const processChunks = async <T, R>(
    data: T[],
    processor: (chunk: T[]) => R[],
    chunkSize: number = 1000
  ): Promise<R[]> => {
    const results: R[] = []
    
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize)
      const processed = processor(chunk)
      results.push(...processed)
      
      // Allow other tasks to run
      await nextTick()
    }
    
    return results
  }
  
  const memoizedCalculation = <T, R>(
    fn: (input: T) => R,
    keyFn?: (input: T) => string
  ) => {
    const cache = new Map<string, R>()
    
    return (input: T): R => {
      const key = keyFn ? keyFn(input) : JSON.stringify(input)
      
      if (cache.has(key)) {
        return cache.get(key)!
      }
      
      const result = fn(input)
      cache.set(key, result)
      
      // Limit cache size
      if (cache.size > 1000) {
        const firstKey = cache.keys().next().value
        cache.delete(firstKey)
      }
      
      return result
    }
  }
  
  return {
    processChunks,
    memoizedCalculation
  }
}

// Efficient WebSocket connection management
export const useOptimizedWebSocket = (url: string, options?: {
  reconnectAttempts?: number
  reconnectDelay?: number
  heartbeatInterval?: number
}) => {
  const {
    reconnectAttempts = 5,
    reconnectDelay = 1000,
    heartbeatInterval = 30000
  } = options || {}
  
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const lastMessage = ref<any>(null)
  const messageQueue = ref<string[]>([])
  
  let reconnectCount = 0
  let heartbeatTimer: number | null = null
  
  const connect = () => {
    try {
      ws.value = new WebSocket(url)
      
      ws.value.onopen = () => {
        isConnected.value = true
        reconnectCount = 0
        
        // Send queued messages
        while (messageQueue.value.length > 0) {
          const message = messageQueue.value.shift()
          if (message) send(message)
        }
        
        // Start heartbeat
        startHeartbeat()
      }
      
      ws.value.onmessage = (event) => {
        try {
          lastMessage.value = JSON.parse(event.data)
        } catch (error) {
          console.warn('Failed to parse WebSocket message:', error)
        }
      }
      
      ws.value.onclose = () => {
        isConnected.value = false
        stopHeartbeat()
        
        // Attempt reconnection
        if (reconnectCount < reconnectAttempts) {
          reconnectCount++
          setTimeout(connect, reconnectDelay * reconnectCount)
        }
      }
      
      ws.value.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
      
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
    }
  }
  
  const send = (message: string) => {
    if (isConnected.value && ws.value) {
      ws.value.send(message)
    } else {
      messageQueue.value.push(message)
    }
  }
  
  const disconnect = () => {
    stopHeartbeat()
    if (ws.value) {
      ws.value.close()
      ws.value = null
    }
    isConnected.value = false
  }
  
  const startHeartbeat = () => {
    heartbeatTimer = window.setInterval(() => {
      if (isConnected.value) {
        send(JSON.stringify({ type: 'ping' }))
      }
    }, heartbeatInterval)
  }
  
  const stopHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }
  
  onMounted(connect)
  onUnmounted(disconnect)
  
  return {
    isConnected: readonly(isConnected),
    lastMessage: readonly(lastMessage),
    send,
    disconnect,
    reconnect: connect
  }
}