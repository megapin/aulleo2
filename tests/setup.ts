import { vi } from 'vitest'

// Mock global objects
global.window = global.window || {}
global.document = global.document || {}

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRuntimeConfig: vi.fn(() => ({
    public: {
      upbit: '/upbit',
      coinbase: '/coinbase',
      bithumb: {
        wssPublic: 'wss://ws-api.bithumb.com/websocket/v1',
        wssPrivate: 'wss://ws-api.bithumb.com/websocket/v1/private',
      }
    },
    upbit: {
      acc_key: 'test-key',
      sec_key: 'test-secret'
    }
  })),
  navigateTo: vi.fn(),
  $fetch: vi.fn(),
  defineStore: vi.fn(),
  useAuStore: vi.fn(() => ({
    currency: ref('KRW'),
    wsData: ref([]),
    market: ref({}),
    account: ref(null),
    setChart: vi.fn()
  })),
  ref: (val: any) => ({ value: val }),
  reactive: (val: any) => val,
  computed: (fn: any) => ({ value: fn() }),
  onMounted: vi.fn(),
  watchEffect: vi.fn()
}))

// Mock Pinia
vi.mock('pinia', () => ({
  defineStore: vi.fn(),
  createPinia: vi.fn(),
  setActivePinia: vi.fn()
}))

// Mock browser APIs
Object.defineProperty(window, 'Notification', {
  value: class MockNotification {
    static permission = 'granted'
    static requestPermission = vi.fn().mockResolvedValue('granted')
    constructor(title: string, options?: NotificationOptions) {
      // Mock notification
    }
  }
})

// Mock WebSocket
global.WebSocket = vi.fn().mockImplementation(() => ({
  send: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  readyState: 1
}))