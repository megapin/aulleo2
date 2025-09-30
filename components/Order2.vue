<script setup>
const au = useAuStore()
const trade = useTrade()

const myKrw = computed(() => au.account?.find(x => x.currency == 'KRW') || {})
const mkt = reactive({side: 'bid', ord_type: 'limit'})

const getBody = () => ({
	id: mkt.side == 'bid' ? '' : au.market.id,
	body: mkt.side == 'bid' 
		? {market: au.market.market, side: mkt.side, price: au.bidPrice, ord_type: 'price'} 
		: {market: au.market.market, side: mkt.side, volume: au.market.balance, ord_type: 'market'}
})
</script>

<template>
	<div class="flex flex-col gap-2">
		<div class="flex items-center">
			<div class="font-bold">
				{{au.market?.market || '종목선택'}}
				<span v-if="au.market.market" @click="trade.quick(getBody())" class="cupo">⚡</span>
			</div>
			<div class="ml-auto">
				<button @click="mkt.side = 'bid'" :class="`text-white mr-1 p-1 px-2 rounded ${mkt.side == 'bid' ? 'bg-red-600' : 'bg-gray-200'}`">매수</button> 
				<button @click="mkt.side = 'ask'" :class="`text-white p-1 px-2 rounded ${mkt.side == 'ask' ? 'bg-blue-600' : 'bg-gray-200'}`" :disabled="!au.market?.balance">매도</button> 
			</div>
		</div>
		<div class="text-sm flex">
		</div>
		<div :class="`flex flex-col gap-2 ${!au.market.market && 'pointer-events-none'}`">
			<!-- <Bid v-if="mkt.side == 'bid'" v-model:mkt="mkt" /> -->
			<!-- <Ask v-else v-model:mkt="mkt" /> -->
			<Bid v-if="mkt.side == 'bid'" />
			<Ask v-else />
		</div>
	</div>
</template>
