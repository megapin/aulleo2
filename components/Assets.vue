<script setup>
const au = useAuStore()
const trade = useTrade()

au.account = await $fetch('/api/account')

// const assts = computed(() => au.account.filter(x => new Set(au.wsData.map(y => y.market)).has('KRW-'+x.currency)))
const assets = computed(() => {
	const f = (x) => au.wsData.find(w => w.market == 'KRW-'+x.currency)
	const items = au.account.filter(x => f(x)).map(x => ({
		...x, ...f(x), totVol: +x.balance + +x.locked,
	}))
	const curSum = items.reduce((a,c) => a + (c.totVol*c.trade_price), 0)
	const buySum = items.reduce((a,c) => a + (c.totVol*c.avg_buy_price), 0)
	const krw = au.account.find(x => x.currency == 'KRW') || {}
	return {items, curSum, buySum, krw}
})
const menu2 = ref()
const amount = ref(1e5)
const isBlur = ref(false)
const isQuick = ref(false)
const price = ref()
const body = ref()

const adjust = computed(() => {
	const {balance, avg_buy_price} = au.market
	return (+balance*avg_buy_price + amount.value) / (+balance + amount.value / price.value)
})

const onMarketName = (item) => {
	const market = 'KRW-'+item.currency
	useApexChart(market)
	au.market = {...item, market, price: item.trade_price}
}
const onMoney = async (e) => {
	isQuick.value = false
	menu2.value.toggle(e)
}
const onWithdraw = async () => {
	const res = await $fetch('/api/withdraws', {method: 'POST', body: {amount: amount.value, two_factor_type: 'kakao'}})
}
const onConfirm = async () => {
	trade.quick({body: {...body.value, price: price.value, volume: amount.value/price.value}})
}
const onTradeQuick = (e, side, item) => {
	isQuick.value = true
	au.market = item
	price.value = item.trade_price
	body.value = { side, market: item.market, ord_type: 'limit' }
	menu2.value.toggle(e)
}
const isVisible = ref(false)
const onChart = (item) => {
	au.market = item
	isVisible.value = !isVisible.value
}
</script>

<template>
	<div class="relative">
		<div v-if="isBlur" class="absolute z-10">
			<i @click="isBlur = false" class="pi pi-times-circle text-xl cupo" />
		</div>

		<div :class="isBlur && 'blur-sm'">
			<div class="w-[6rem] text-gray-400 font-bold">
				<span @click="isBlur = true" class="cupo">My Asset</span>
			</div>
			<!-- <div class="flex flex-col md:flex-row text-sm border-b-2 border-gray-500 py-1 mb-2 font-mono"> -->
			<div class="flex flex-row text-sm border-b-2 border-gray-500 py-1 mb-2 font-mono">
				<div class="flex-1 text-start">
					<b>{{(~~(+assets.krw.balance+ +assets.krw.locked+ +assets.curSum)).toLocaleString()}}</b>원
				</div>
				<div class="flex-1 text-end">
					<div>{{(~~(+assets.krw.locked + +assets.krw.balance)).toLocaleString()}}원</div>
					<div><b @click="onMoney($event)" class="cupo text-green-700">{{(~~assets.krw.balance).toLocaleString()}}</b>원</div>
				</div>
				<div class="hidden md:block flex-1 text-end"></div>
				<div class="flex-1 text-end">
					<div> {{(~~assets.buySum).toLocaleString()}} </div>
					<div> <b>{{(~~assets.curSum).toLocaleString()}}</b> </div>
				</div>
				<div :class="`flex-1 text-end ${textColor(assets.curSum > assets.buySum)}`">
					<div> <b>{{((assets.curSum - assets.buySum)/assets.buySum*100).toFixed(2)}}</b>% </div>
					<div> {{(~~(assets.curSum - assets.buySum)).toLocaleString()}}원 </div>
				</div>
			</div>

			<div v-for="(item, i) in assets.items" :class="`flex pt-2 pb-1 text-sm ${i+1 < assets.items.length && 'border-b'} font-mono`">
				<div class="w-16 md:flex-1 flex items-center">
					<b @click="onMarketName(item)" class="cupo"> {{item.currency}} </b>
					<div class="hidden md:inline">
						<i @click="onTradeQuick($event, 'bid', item)" class="pi pi-bolt ml-2 text-red-600 cupo" />
						<i @click="onTradeQuick($event, 'ask', item)" class="pi pi-bolt text-blue-600 cupo" />
						<i @click="onChart(item)" class="pi pi-bolt text-green-600 cupo" />
					</div>
				</div>
				<div class="flex-1 flex items-center justify-end">
					{{shortVol(+item.trade_price, +item.balance + +item.locked)}}
					<span class="text-xs pl-1">{{item.currency.slice(0,3).padEnd(3,'&nbsp;')}}</span>
				</div>
				<div class="flex-1 text-end">
					<div> {{shortNo(+item.avg_buy_price)}} </div>
					<div :class="`flex-1 text-end ${textColor(item.avg_buy_price < item.trade_price)}`">
						{{shortNo(item.trade_price)}}
					</div>
				</div>
				<div class="flex-1 text-end">
					<div> {{(~~(item.totVol*item.avg_buy_price)).toLocaleString()}} </div>
					<div :class="`${textColor(item.avg_buy_price < item.trade_price)}`">
						{{(~~(item.totVol*item.trade_price)).toLocaleString()}}
					</div>
				</div>
				<div class="flex-1 text-end">
					<div :class="textColor(item.trade_price > item.avg_buy_price)">
						{{((item.trade_price-item.avg_buy_price)/item.avg_buy_price*100).toFixed(2)}}%
					</div>
					<div :class="textColor(item.trade_price > item.avg_buy_price)">
						{{(~~(item.totVol*(item.trade_price - item.avg_buy_price))).toLocaleString()}}원
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- <Menu ref="menu2" :popup="true"> -->
	<!-- 	<template #start> -->
	<!-- 		<div class="px-4 pt-4 pb-2"> -->
	<!-- 			<div v-if="isQuick"> -->
	<!-- 				<InputNumber v-model="price" mode="currency" currency="KRW" size="small" class="mb-2" /> -->
	<!-- 				<div class="flex flex-col items-center"> -->
	<!-- 					<div class="">Adjusted: {{adjust.toFixed(2)}}</div> -->
	<!-- 					<div class="">Change: {{((au.market.trade_price-adjust)/adjust*100).toFixed(2)}}%</div> -->
	<!-- 					<div>Total: {{amount}}</div> -->
	<!-- 				</div> -->
	<!-- 				<Slider v-model="amount" :min="1e4" :max="~~assets.krw.balance" :step="1e4" class="mx-2 mt-4" /> -->
	<!-- 			</div> -->
	<!-- 			<div v-else> -->
	<!-- 				<InputNumber v-model="amount" mode="currency" currency="KRW" size="small" class="mb-2" /> -->
	<!-- 				<Slider v-if="!isQuick" v-model="amount" :min="1e4" :max="~~assets.krw.balance" :step="1e4" class="mx-2 mt-4" /> -->
	<!-- 			</div> -->
	<!-- 		</div> -->
	<!-- 		<div class="px-4 pt-4 pb-2 flex justify-between"> -->
	<!-- 			<Button @click="menu2.toggle($event)" severity="secondary" label="취소" size="small" /> -->
	<!-- 			<Button @click="isQuick ? onConfirm() : onWithdraw()" label="확인" size="small" :disabled="isQuick ? false : amount < 10000" /> -->
	<!-- 		</div> -->
	<!-- 	</template> -->
	<!-- </Menu> -->

	<!-- <Dialog v-model:visible="isVisible" pt:root:class="!border-0 !bg-transparent w-[50rem]" pt:mask:class="backdrop-blur-sm"> -->
	<!-- 	<template #container="{ closeCallback }"> -->
	<!-- 		<div class="h-[33rem]"> -->
	<!-- 			<TVChart :options="{allow_symbol_change: true, locale: 'ko', interval: 'D', autosize: true,  -->
	<!-- 				symbol: `COINBASE:${au.market.currency}USD`}" /> -->
	<!-- 		</div> -->
	<!-- 	</template> -->
	<!-- </Dialog> -->
</template>
