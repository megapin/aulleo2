<script setup>
import {subWeeks, addDays, subDays, format} from 'date-fns'

const au = useAuStore()
const pb = usePb()
const trade = useTrade()

au.orders = await pb.getFullList('upbit_orders')
const MM = ref(au.now.slice(5,7))
const dd = au.now.slice(8,10)
const day = ref(dd)
const intvId = ref()
const bids = computed(() => au.orders
	.filter(x => !x.status || x.status == 'done')
	.map(x => ({...x, trade_price: au.filteredWsData.find(y => y.market == x.market).trade_price}))
	.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
)
const asks = computed(() => au.orders.filter(x => format(x.updated, 'dd') == day.value && x.status == 'fin'))
const month = computed(() => au.orders.filter(x => format(x.updated, 'MM') == MM.value && x.status == 'fin'))
const tradeSum = computed(() => {
	const sum = (a, b) => a + ((b[b.status == 'fin' ? 'askPrice' : 'trade_price'] - b.price) * b.volume)
	return {
		month: month.value.reduce(sum, 0).toFixed(),
		bids: bids.value.reduce(sum, 0).toFixed(),
		asks: asks.value.reduce(sum, 0).toFixed() 
	}
})
const op = ref()
const pn = ref(0)
const dates = computed(() => Array(7).fill(subWeeks(au.now, pn.value))
	.map((x, i) => format(subDays(x, i), 'MMdd')).sort((a, b) => a - b)
)

const getBody = (side, item) => side == 'ask'
	? {id: item.id, body: {market:item.market, side:'ask', ord_type:'market', volume:item.volume}}
	: {market:item.market, side:'bid', ord_type:'price', price:2e5}

const onMarket = (item) => {
	au.market = item
	useApexChart(item.market)
}

onMounted(() => intvId.value = setInterval(() => trade.runAuto(), 2000))
onUnmounted(() => clearInterval(intvId.value))
</script>

<template>
	<div class="flex items-center">
		<span class="font-bold text-gray-400">Orders</span>
		<i @click="trade.allOut()" class="pi pi-bolt ml-2 p-1 rounded-xl text-white bg-blue-600 cupo" />
		<div class="ml-auto text-sm">
			<span @click="MM--" class="cupo"><</span>
			<Tag @click="op.toggle($event)" class="mx-1 cupo">{{MM}}월</Tag> 
			<span @click="MM++" :class="`${MM == au.now.slice(5,7) && 'pointer-events-none'} mr-1 cupo`">></span>
			<span :class="`font-bold ${textColor(tradeSum.month > 0)}`">{{(+tradeSum.month).toLocaleString()}}</span>원
		</div>
	</div>
	<Popover ref="op" class="w-[100dvw] md:w-[45rem]">
		<OrdersFinished />
	</Popover>

	<div class="md:flex gap-4">
		<div class="flex-1">
			<div class="border-b my-1 mt-2 flex text-sm">
				<div class="px-1 rounded bg-red-500 font-bold text-white">Bids</div>
				<div class="ml-auto flex">
					<span :class="textColor(tradeSum.bids > 0)">{{(+tradeSum.bids).toLocaleString()}}</span>원
				</div>
			</div>
			<div class="flex mb-1 border-b text-sm" v-for="item in bids">
				<div class="flex w-24">
					<i v-if="item.status" @click="trade.quick(getBody('ask', item))" class="pi pi-bolt mr-1 text-blue-600 cupo" />
					<i v-else @click="trade.cancel(item)" class="pi pi-undo mr-1 text-blue-600 cupo" />
					<span @click="onMarket({...item, balance: item.volume})" class="cupo">{{item.market.replace(/KRW-/,'')}}</span>
					<OrderOption v-if="item.status" :order="item" class="ml-1" />
				</div>
				<div class="flex-1 text-end">{{item.price > 1e6 ? item.volume.toFixed(5) 
					: item.price > 1e3 ? item.volume.toFixed(3) 
					: item.price > 1 ? item.volume.toFixed()
					: (item.volume/1e3).toFixed() +'k'}}</div>
				<div class="flex-1 text-end">{{shortNo(item.price)}}</div>
				<div class="flex-1 text-end">{{shortNo(item.trade_price)}}</div>
				<div class="w-16 text-end">
					<span :class="textColor(item.trade_price > item.price)">{{((item.trade_price-item.price)/item.price*100).toFixed(2)}}</span>%
				</div>
				<div class="w-20 text-end">
					<span v-if="item.status" :class="textColor(item.trade_price > item.price)">{{((item.trade_price-item.price)*item.volume).toFixed()}}</span>원
				</div>
			</div>
			<div class="text-sm flex">
				<div class="ml-auto">
					<span class="">
						{{(+au.orders.filter(x => x.status == 'done').reduce((a,b) => a+b.price*b.volume,0).toFixed()).toLocaleString()}} /
					</span>
					<span :class="textColor(tradeSum.bids > 0)">
						{{(~~bids.reduce((a,b) => a+b.trade_price*b.volume,0)).toLocaleString()}}
					</span>원
				</div>
			</div>
		</div>

		<div class="flex-1">
			<div class="border-b my-1 mt-2 flex text-sm">
				<div class="px-1 rounded bg-blue-500 font-bold text-white">Asks</div>
				<div class="ml-auto">
					<span :class="textColor(tradeSum.asks > 0)">{{(+tradeSum.asks).toLocaleString()}}</span>원
				</div>
			</div>
			<div class="flex mb-1 border-b text-sm" v-for="item in asks">
				<div class="w-[6rem]">
					<i v-if="item.status == 'fin'" @click="trade.quick(getBody('bid', item))" class="pi pi-bolt mr-1 text-red-600 cupo" />
					<i v-else @click="trade.cancel(item)" class="pi pi-undo mr-1 text-blue-600 cupo" />
					<span @click="onMarket(item)" class="cupo">{{item.market.replace(/KRW-/,'')}}</span>
				</div>
				<div class="flex-1 text-end">{{item.price > 1e6 ? item.volume.toFixed(5) 
					: item.price > 1e3 ? item.volume.toFixed(3) 
					: item.price > 1 ? item.volume.toFixed()
					: (item.volume/1e3).toFixed() +'k'}}</div>
				<div class="flex-1 text-end">{{shortNo(item.price) < 1 ? String(shortNo(item.price)).slice(1) : shortNo(item.price)}}</div>
				<div class="flex-1 text-end">{{shortNo(item.askPrice) < 1 ? String(shortNo(item.askPrice)).slice(1) : shortNo(item.askPrice)}}</div>
				<div class="w-16 text-end">
					<span :class="textColor(item.askPrice > item.price)">{{((item.askPrice-item.price)/item.price*100).toFixed(2)}}</span>%
				</div>
				<div class="w-20 text-end">
					<span :class="textColor(item.askPrice > item.price)">{{((item.askPrice-item.price)*item.volume).toFixed()}}</span>원
				</div>
			</div>

			<div class="mt-2 flex items-center justify-center text-sm">
				<!-- <i @click="" :class="`pi pi-database cupo`" /> -->
				<i @click="++pn" :class="`pi pi-chevron-circle-left cupo mr-2 ${dates.includes('1112') && 'pointer-events-none text-gray-300'}`" />
				<span @click="day = item.slice(2,4)" v-for="item in dates" :class="`px-1 cupo ${day == item.slice(2,4) && 'font-bold'}`">{{item.slice(2,4)}}</span>
				<i @click="--pn" :class="`pi pi-chevron-circle-right cupo ml-2 ${pn == 0 && 'pointer-events-none text-gray-300'}`" />
			</div>
		</div>
	</div>
</template>
