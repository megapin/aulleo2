<script setup>
const au = useAuStore()
const pb = usePb()
const c = useRuntimeConfig()
const trade = useTrade()

const isMenu = ref(false)
const orderbook = reactive({})
const isOrderbook = ref(false)
const intvId = ref()
const myKrw = computed(() => au.account?.find(x => x.currency == 'KRW') || {})
const x = ref(0)
const y = ref(0)

const onOrder = async () => {
	let {market, price: avg_buy_price} = au.market
	let {side, volume, price, ord_type} = au.market
	const body = ord_type == 'price' 
		? {market, side, price, ord_type}
		: {market, side, volume, price, ord_type}
	if (ord_type == 'limit' && volume*price < 5000) return alert('최소 주문금액: 5000원')
	const res = await $fetch('/api/order', {method: 'POST', body})
	await pb.create('upbit_orders', {uuid: res.uuid, enough: au.enough, go: au.go, stop: au.stop, ...body})
	// au.nextLv[market] = null
}

const getOrderbook = async () => {
	const url = `${c.public.upbit}/orderbook?markets=${au.market.market}&level=0`
	const res = await $fetch(url)
	orderbook.ask = res[0].orderbook_units.map(({ask_price, ask_size}) => ({ask_price, ask_size})).sort((a, b) => b.ask_price - a.ask_price)
	orderbook.bid = res[0].orderbook_units.map(({bid_price, bid_size}) => ({bid_price, bid_size})).sort((a, b) => b.bid_price - a.bid_price)
}
const onOrderbook = async (e) => {
	isMenu.value = !isMenu.value
	isOrderbook.value = true
	x.value = e.clientX
	y.value = e.clientY
	if (isMenu.value) {
		getOrderbook()
		intvId.value = setInterval(() => getOrderbook(), 1000)
	}
	else clearInterval(intvId.value)
}
const onVol = (e) => {
	au.market.total = e.target.value * au.market.price
	au.market.pct = ~~(au.market.total/myKrw.value.balance * 100)
}
const onPct = (e) => {
	au.market.total = myKrw.value.balance * e.target.value/100
	au.market.volume = au.market.total / au.market.price
	if (au.market.ord_type == 'price') au.market.price = au.market.total
}
const onTot = (e) => {
	au.market.volume = e.target.value/au.market.price
	au.market.pct = ~~(e.target.value/myKrw.value.balance * 100)
}
const onRadio = (e) => {
	// if (e.target.value == 'price') mkt.volume = 0 
	// if (e.target.value == 'market') mkt.price = 0
}
const onCalc = (e) => {
	isMenu.value = !isMenu.value
	isOrderbook.value = false
	x.value = e.clientX
	y.value = e.clientY
}
</script>

<template>
	<div class="mx-auto relative">
		<div class="flex justify-center">
			<div class="flex flex-wrap gap-2">
				<input v-model="au.market.ord_type" type="radio" value="limit" @input="" />
				<label>지정가</label>
				<input v-model="au.market.ord_type" type="radio" value="price" @input="au.market.volume = 0" />
				<label>시장가</label>
				<input v-model="au.market.ord_type" type="radio" value="best" @input="onRadio" />
				<label>최유리</label>
			</div>
		</div>
		<div class="flex items-center gap-2 mt-2">
			<label class="w-[6rem] leading-none">
				매수가격
				<span v-if="au.market.market && au.market.ord_type == 'limit'" @click="onOrderbook" class="cupo">📓</span>
			</label>
			<input v-model="au.market.price" @input="" type="number" :step="getUnit(au.market?.trade_price)" 
				:disabled="au.market.side == 'ask' && au.market.ord_type == 'market'" :maxFractionDigits="5" class="w-[15rem]" /> 
		</div>
		<div class="flex items-center gap-2 mt-2">
			<label class="w-[6rem]">주문수량</label>
			<input v-model="au.market.volume" @input="onVol" type="number" :min="0" :max="myKrw.balance/au.market.price" :step="getVolStep(au.market.trade_price)" 
				:disabled="au.market.ord_type == 'price'" class="w-[15rem]" />
			<input v-model="au.market.pct" @input="onPct" type="number" :min="0" :max="100" :step="1" class="w-[7rem]" />%
		</div>
		<div class="flex items-center gap-2 mt-2">
			<label class="w-[6rem]">주문총액</label>
			<input v-model="au.market.total" @input="onTot" type="number" class="w-[15rem]" :min="10000" :max="+myKrw.balance" :step="10000"
				:disabled="['market','price'].includes(au.market.ord_type)" />
		</div>
		<div class="flex items-center gap-2 mt-4">
			<span @click="onCalc" class="w-[6rem] cupo">🎛</span>
			<button @click="onOrder" :disabled="!au.market.market" class="w-[24rem] p-1 px-2 rounded text-white bg-red-500">매수</button>
		</div>
	</div>

	<div v-if="isMenu" class="absolute z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none" 
		:style="{left: x +'px', top: y+5 +'px'}"
		role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
		<div v-if="isOrderbook" class="flex p-1 font-mono text-sm w-[19rem]">
			<div class="flex-1">
				<div v-for="item in orderbook['ask']" class="flex-1 flex pt-1 px-2 bg-blue-50 border-b">
					<div @click="au.market.price = item.ask_price" class="flex-1 cupo">{{item.ask_price}}</div> 
					<div class="flex-1 text-end text-xs">{{item.ask_size.toFixed(3)}}</div>
				</div>
			</div>
			<div class="flex-1">
				<div v-for="item in orderbook['bid']" class="flex-1 flex pt-1 px-2 bg-red-50 border-b">
					<div @click="au.market.price = item.bid_price" class="flex-1 cupo">{{item.bid_price}}</div>
					<div class="flex-1 text-end text-xs">{{item.bid_size.toFixed(3)}}</div>
				</div>
			</div>
		</div>
		<div v-else class="w-[30rem] p-4">
			<Calculator />
		</div>
  </div>
</template>

<style scoped lang="scss">
input {
	padding: 2px 0;
	border-bottom: 2px solid gray;
}
</style>
