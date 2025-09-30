<script setup lang="ts">
const chartOptions = ref({
  theme: 'dark',
  autosize: true,
  // symbol: 'NASDAQ:AAPL',
	symbol: 'COINBASE:FILUSD',
	currency: 'KRW',
  timezone: 'Etc/UTC',
})
</script>

<template>
	<!-- <ClientOnly> -->
	<div class="h-[50rem] p-4">
	<TVChart :options="chartOptions" />
	<!-- <TVCryptoMarket /> -->
  <!-- <TVTopStories/> -->
  <!-- <TVScreener/> -->
	</div>
	<!-- </ClientOnly> -->
</template>
