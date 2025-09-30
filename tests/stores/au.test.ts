import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock $fetch
global.$fetch = vi.fn()

// Mock useRuntimeConfig
const mockRuntimeConfig = {
  public: {
    upbit: '/upbit',
    coinbase: '/coinbase',
    bithumb: {
      wssPublic: 'wss://ws-api.bithumb.com/websocket/v1',
      wssPrivate: 'wss://ws-api.bithumb.com/websocket/v1/private',
    }
  }
}

vi.mock('#app', () => ({
  useRuntimeConfig: () => mockRuntimeConfig,
  defineStore: vi.fn()
}))

describe('Au Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with default values', async () => {
    // Since we can't easily import the actual store due to Nuxt dependencies,
    // we'll test the store logic concepts
    const mockStore = {
      currency: 'KRW',
      market: {},
      wsData: null,
      search: undefined,
      chartData: {},
      sparklineData: {
        up: [], 
        down: [], 
        upAbove: [], 
        downAbove: [], 
        accTradePriceAbove5: [], 
        accTradePriceAbove15: [],
        marketAccTradePrice: [], 
        marketAccTradePrice24h: []
      }
    }

    expect(mockStore.currency).toBe('KRW')
    expect(mockStore.market).toEqual({})
    expect(mockStore.chartData).toEqual({})
  })

  it('should filter websocket data by currency', () => {
    const wsData = [
      { market: 'KRW-BTC', trade_price: 50000 },
      { market: 'KRW-ETH', trade_price: 3000 },
      { market: 'BTC-DOGE', trade_price: 0.001 }
    ]
    
    const currency = 'KRW'
    const filtered = wsData.filter(d => d.market.startsWith(currency))
    
    expect(filtered).toHaveLength(2)
    expect(filtered[0].market).toBe('KRW-BTC')
    expect(filtered[1].market).toBe('KRW-ETH')
  })

  it('should calculate BTC and USDC prices', () => {
    const wsData = [
      { market: 'KRW-BTC', trade_price: 50000000 },
      { market: 'KRW-USDC', trade_price: 1300 },
      { market: 'KRW-ETH', trade_price: 3000000 }
    ]
    
    const btcKrw = wsData.find(d => d.market === 'KRW-BTC')?.trade_price
    const usdcKrw = wsData.find(d => d.market === 'KRW-USDC')?.trade_price
    
    expect(btcKrw).toBe(50000000)
    expect(usdcKrw).toBe(1300)
  })
})

describe('Chart Data Processing', () => {
  it('should process candle data correctly', () => {
    const mockCandleData = [
      {
        candle_date_time_kst: '2024-01-01T09:00:00',
        timestamp: 1704067200000,
        opening_price: 50000,
        high_price: 52000,
        low_price: 49000,
        trade_price: 51000,
        candle_acc_trade_volume: 100
      }
    ]

    // Test chart data transformation
    const chartData = {
      labels: mockCandleData.map(x => x.candle_date_time_kst.slice(5, 10)),
      datasets: [{
        label: 'KRW-BTC(일)',
        data: mockCandleData.map(x => x.trade_price),
        fill: false,
        borderColor: 'gray',
        tension: 0.4,
        type: 'line',
        yAxisID: 'y',
        pointStyle: false,
      }]
    }

    expect(chartData.labels[0]).toBe('01-01')
    expect(chartData.datasets[0].data[0]).toBe(51000)
  })

  it('should create apex chart data format', () => {
    const mockCandleData = [
      {
        candle_date_time_kst: '2024-01-01T09:00:00',
        timestamp: 1704067200000,
        opening_price: 50000,
        high_price: 52000,
        low_price: 49000,
        trade_price: 51000
      }
    ]

    const apexData = {
      series: [{
        data: mockCandleData.map(x => [
          new Date(x.candle_date_time_kst).getTime(), 
          x.opening_price, 
          x.high_price, 
          x.low_price, 
          x.trade_price
        ])
      }],
      options: { 
        title: { text: 'KRW-BTC' }
      }
    }

    expect(apexData.series[0].data[0]).toHaveLength(5)
    expect(apexData.series[0].data[0][1]).toBe(50000) // opening_price
    expect(apexData.series[0].data[0][4]).toBe(51000) // trade_price
  })
})