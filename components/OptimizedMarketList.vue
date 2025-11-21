<template>
  <div class="market-list-container">
    <!-- Search and Controls -->
    <div class="flex items-center gap-2 p-4 bg-gray-50">
      <input
        v-model="searchTerm"
        type="search"
        placeholder="종목 검색..."
        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <select
        v-model="sortBy"
        class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="market">종목명</option>
        <option value="trade_price">현재가</option>
        <option value="signed_change_rate">변동률</option>
        <option value="acc_trade_price_24h">거래량</option>
      </select>
      
      <button
        @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
        class="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        {{ sortOrder === 'asc' ? '↑' : '↓' }}
      </button>
    </div>

    <!-- Virtual List -->
    <VirtualList
      :items="filteredAndSortedData"
      :item-height="60"
      :container-height="400"
      :key-extractor="(item) => item.market"
      :loading="loading"
    >
      <template #item="{ item, index }">
        <div 
          class="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
          @click="selectMarket(item)"
          :class="{ 'bg-blue-50': selectedMarket === item.market }"
        >
          <!-- Market Info -->
          <div class="flex-1">
            <div class="font-medium text-gray-900">
              {{ formatMarketName(item.market) }}
            </div>
            <div class="text-sm text-gray-500">
              {{ item.market }}
            </div>
          </div>

          <!-- Price -->
          <div class="text-right mr-4">
            <div class="font-mono font-medium">
              {{ formatPrice(item.trade_price) }}
            </div>
            <div 
              class="text-sm font-mono"
              :class="getPriceChangeColor(item.signed_change_rate)"
            >
              {{ formatChangeRate(item.signed_change_rate) }}
            </div>
          </div>

          <!-- Volume -->
          <div class="text-right text-xs text-gray-500 w-20">
            {{ formatVolume(item.acc_trade_price_24h) }}
          </div>

          <!-- Trend Indicator -->
          <div class="w-8 flex justify-center">
            <div 
              class="w-3 h-3 rounded-full"
              :class="item.signed_change_rate > 0 ? 'bg-red-500' : item.signed_change_rate < 0 ? 'bg-blue-500' : 'bg-gray-400'"
            ></div>
          </div>
        </div>
      </template>

      <template #empty>
        <div class="text-center py-8">
          <div class="text-gray-500">검색 결과가 없습니다</div>
          <div class="text-sm text-gray-400 mt-1">
            다른 검색어를 시도해보세요
          </div>
        </div>
      </template>
    </VirtualList>

    <!-- Summary Stats -->
    <div class="p-4 bg-gray-50 border-t">
      <div class="grid grid-cols-4 gap-4 text-sm">
        <div class="text-center">
          <div class="font-semibold text-red-600">{{ upCount }}</div>
          <div class="text-gray-600">상승</div>
        </div>
        <div class="text-center">
          <div class="font-semibold text-blue-600">{{ downCount }}</div>
          <div class="text-gray-600">하락</div>
        </div>
        <div class="text-center">
          <div class="font-semibold text-gray-600">{{ totalVolume }}</div>
          <div class="text-gray-600">총 거래량</div>
        </div>
        <div class="text-center">
          <div 
            class="font-semibold"
            :class="totalChangeRate >= 0 ? 'text-red-600' : 'text-blue-600'"
          >
            {{ formatChangeRate(totalChangeRate) }}
          </div>
          <div class="text-gray-600">평균 변동률</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDebouncedSearch, useDataProcessor } from '../composables/performance'
import VirtualList from './VirtualList.vue'

interface MarketData {
  market: string
  trade_price: number
  signed_change_rate: number
  acc_trade_price_24h: number
}

interface Props {
  data: MarketData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  selectMarket: [market: string]
}>()

// Search and filtering
const { searchTerm, debouncedSearchTerm } = useDebouncedSearch(300)
const sortBy = ref<keyof MarketData>('market')
const sortOrder = ref<'asc' | 'desc'>('asc')
const selectedMarket = ref<string>('')

// Data processing
const { memoizedCalculation } = useDataProcessor()

const filteredData = computed(() => {
  if (!debouncedSearchTerm.value) return props.data
  
  const searchLower = debouncedSearchTerm.value.toLowerCase()
  return props.data.filter(item => 
    item.market.toLowerCase().includes(searchLower)
  )
})

const filteredAndSortedData = computed(() => {
  const sorted = [...filteredData.value].sort((a, b) => {
    const aVal = a[sortBy.value]
    const bVal = b[sortBy.value]
    
    if (typeof aVal === 'string') {
      return sortOrder.value === 'asc' 
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal)
    } else {
      return sortOrder.value === 'asc' 
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    }
  })
  
  return sorted
})

// Memoized calculations for performance
const upCount = computed(() => 
  memoizedCalculation((data: MarketData[]) => 
    data.filter(item => item.signed_change_rate > 0).length
  )(props.data)
)

const downCount = computed(() => 
  memoizedCalculation((data: MarketData[]) => 
    data.filter(item => item.signed_change_rate < 0).length
  )(props.data)
)

const totalVolume = computed(() => 
  memoizedCalculation((data: MarketData[]) => {
    const total = data.reduce((sum, item) => sum + item.acc_trade_price_24h, 0)
    return formatVolume(total)
  })(props.data)
)

const totalChangeRate = computed(() => 
  memoizedCalculation((data: MarketData[]) => {
    const total = data.reduce((sum, item) => sum + item.signed_change_rate, 0)
    return total / data.length
  })(props.data)
)

// Formatting functions
const formatMarketName = (market: string): string => {
  return market.split('-')[1] || market
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR').format(price)
}

const formatChangeRate = (rate: number): string => {
  const percentage = (rate * 100).toFixed(2)
  return `${rate >= 0 ? '+' : ''}${percentage}%`
}

const formatVolume = (volume: number): string => {
  if (volume >= 1e12) return `${(volume / 1e12).toFixed(1)}조`
  if (volume >= 1e8) return `${(volume / 1e8).toFixed(1)}억`
  if (volume >= 1e4) return `${(volume / 1e4).toFixed(1)}만`
  return volume.toLocaleString()
}

const getPriceChangeColor = (rate: number): string => {
  if (rate > 0) return 'text-red-600'
  if (rate < 0) return 'text-blue-600'
  return 'text-gray-600'
}

const selectMarket = (item: MarketData) => {
  selectedMarket.value = item.market
  emit('selectMarket', item.market)
}
</script>

<style scoped>
.market-list-container {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}
</style>