<template>
  <div 
    ref="containerRef"
    class="virtual-list-container overflow-auto"
    :style="{ height: containerHeight + 'px' }"
    @scroll="onScroll"
  >
    <div :style="{ height: totalHeight + 'px', position: 'relative' }">
      <div 
        :style="{ 
          transform: `translateY(${offsetY}px)`,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0
        }"
      >
        <div
          v-for="{ item, index } in visibleItems"
          :key="keyExtractor ? keyExtractor(item, index) : index"
          :style="{ height: itemHeight + 'px' }"
          class="virtual-list-item"
        >
          <slot name="item" :item="item" :index="index" />
        </div>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="flex items-center justify-center p-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="items.length === 0" class="flex items-center justify-center p-8 text-gray-500">
      <slot name="empty">
        <div class="text-center">
          <div class="text-lg font-medium">데이터가 없습니다</div>
          <div class="text-sm">새로고침하거나 조건을 변경해보세요</div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import { useVirtualScroll } from '../composables/performance'

interface Props {
  items: any[]
  itemHeight: number
  containerHeight: number
  keyExtractor?: (item: any, index: number) => string | number
  loading?: boolean
  overscan?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  overscan: 5,
  keyExtractor: undefined
})

const itemsRef = toRef(props, 'items')

const {
  containerRef,
  visibleItems,
  totalHeight,
  offsetY,
  onScroll
} = useVirtualScroll({
  itemHeight: props.itemHeight,
  containerHeight: props.containerHeight,
  items: itemsRef,
  overscan: props.overscan
})
</script>

<style scoped>
.virtual-list-container {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.virtual-list-container::-webkit-scrollbar {
  width: 8px;
}

.virtual-list-container::-webkit-scrollbar-track {
  background: #f7fafc;
}

.virtual-list-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.virtual-list-container::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>