<script setup>
const c = useRuntimeConfig()
const au = useAuStore()
const pb = usePb()

const resFavs = await pb.getFullList('upbit_favs', {sort: "-created"})
const intvId = ref()
const txtColor = {RISE: 'text-red-600', FALL: 'text-blue-600', EVEN: 'text-gray-600'}
const visible = ref(false)
const sortBy = reactive({key: '', asc: -1})
const favs = ref(resFavs)
const isDrawer = ref(false)

const upb = computed(() => {
	const t = 'trade_price', s = 'signed_change_rate', a = 'acc_trade_price'
	const auSearch = x => au.search ? x.market.includes(au.search.toUpperCase()) : x
	const auCog = x => (x[t] >= au.cog[t][0] && x[t] <= au.cog[t][1]) &&
		(x[s] >= au.cog[s][0] && x[s] <= au.cog[s][1]) &&
		(x[a] >= au.cog[a][0] && x[a] <= au.cog[a][1])

	const filted = au.wsData
		.map(x => ({...x, asset: au.account?.find(y => x.market.slice(4) == y.currency)})) 
		.filter(auCog).filter(auSearch)

	if (sortBy.key) {
		const {key, asc} = sortBy
		key == 'market'
			?	filted.sort((a, b) => a[key] > b[key] ? 1*asc : a[key] < b[key] ? -1*asc : 0) 
			: filted.sort((a, b) => asc == 1 ? a[key] - b[key] : b[key] - a[key])
	}
	return filted
})

// const getFieldData = (item) => au.currency == 'BTC' ? +(item*au.btcKrw).toFixed() : item
const curPrice = (item) => upb.value.find(x => x.market == item.market).trade_price

const onSort = (key) => { 
	sortBy.asc = sortBy.key == key ? sortBy.asc * -1 : -1
	sortBy.key = key
}
const onMarketName = (item) => {
	au.market = {...item, price: item.trade_price}
	useApexChart(item.market)
}
const onFavs = async (item) => {
	const idx = favs.value.findIndex(x => x.market == item.market)
	if (~idx) favs.value.splice(idx, 1) // : favs.value.push(item)
	const res = await pb.create('upbit_favs', item)
	favs.value.push(res)
}
const onOrder = (item) => {
	// au.market = {...item, price: item.trade_price}
	// visible.value = !visible.value
}

const getData = async () => {
	// const gst = await $fetch(c.public.coinbase +'/GST-USD/ticker')
	// const fil = au.wsData.find(x => x.market == 'BTC-FIL')
	au.wsData = await $fetch(c.public.upbit + "/ticker/all", {query: {quote_currencies: 'KRW'}})
	au.account = await $fetch('/api/account')
	// useApexChart(au.market.market)
}
onMounted(() => {
	getData()
	intvId.value = setInterval(() => getData(), 3*1000)
})
onUnmounted(() => clearInterval(intvId.value))
</script>

<template>
	<ul class="text-xs text-gray-500 h-[88dvh] overflow-auto scrollbar">
		<li class="flex items-center justify-between border-b text-sm font-bold text-gray-500">
			<div @click="isDrawer = !isDrawer" class="pr-7 pl-1 cupo">&#128591;</div>
			<div class="basis-1/5 cupo" @click="onSort('market')">종목 ⇅</div>
			<div class="flex-1 text-end cupo" @click="onSort('trade_price')">거래가 ⇅</div>
			<div class="flex-1 text-end cupo" @click="onSort('signed_change_price')">등락 ⇅</div>
			<div class="basis-1/6 text-end cupo" @click="onSort('signed_change_rate')">% ⇅</div>
			<div class="w-[4.5rem] text-end cupo" @click="onSort('acc_trade_price')">거래 ⇅</div>
		</li>
		<li v-for="(item,i) in upb" :class="`flex items-center border-b ${item.asset && 'bg-yellow-100'}`">
			<div @click="onFavs(item)" :class="`px-1 cupo ${favs.find(x => x.market == item.market) && 'text-amber-500'} text-base`">
				{{favs.find(x => x.market == item.market) ? '&#9733;' : '&#9734;'}}
			</div>
			<i @click="onOrder(item)" class="pi pi-shopping-cart cupo mr-1" />
			<div @click="onMarketName(item)" class="basis-1/5 font-bold text-black cupo">
				<span class="text-[9px] text-gray-400">{{(i+1)%100}}</span> 
				{{item.market.replace(/(KRW|BTC|USDT)-/,'')}}
			</div>
			<!-- <div @click="onOrder(item)" :class="`flex-1 text-end ${txtColor[item.change]}`">{{getFieldData(item.trade_price).toLocaleString()}}</div> -->
			<!-- <div :class="`flex-1 text-end ${txtColor[item.change]}`">{{getFieldData(item.change_price).toLocaleString()}}</div> -->
			<div @click="onOrder(item)" :class="`flex-1 text-end ${txtColor[item.change]}`">{{item.trade_price.toLocaleString()}}</div>
			<div :class="`flex-1 text-end ${txtColor[item.change]}`">{{item.change_price.toLocaleString()}}</div>
			<div :class="`basis-1/6 text-end`"><span :class="`${txtColor[item.change]}`">{{(item.signed_change_rate*100).toFixed(2)}}</span>%</div>
			<div :class="`w-[4.5rem] text-end`">{{(item.acc_trade_price/1e8)?.toFixed(2)}}억</div>
		</li>
	</ul>

	<!-- <Drawer v-model:visible="isDrawer" header="Favs" class="!w-[30rem]"> -->
	<!-- 	<div v-for="item in favs" class="flex font-mono border-b mt-1"> -->
	<!-- 		<div @click="useApexChart(item.market)"class="w-20 cupo">{{item.market.slice(4)}}</div> -->
	<!-- 		<div :class="`${textColor(item.trade_price < curPrice(item))} w-20 text-end`"> -->
	<!-- 			{{((curPrice(item)-item.trade_price)/curPrice(item)*100).toFixed(2)}}% -->
	<!-- 		</div> -->
	<!-- 		<div class="flex-1 text-end">{{item.trade_price}}</div> -->
	<!-- 		<div class="flex-1 text-end">{{curPrice(item)}}</div> -->
	<!-- 		<div class="pl-4 text-end">{{item.created.slice(5,10)}}<span class="text-xs">{{item.created.slice(11,16)}}</span></div> -->
	<!-- 	</div> -->
	<!-- </Drawer> -->

	<!-- <Dialog v-model:visible="visible" modal style="width:25rem"> -->
	<!-- 	<template #container="{closeCallback}"> -->
	<!-- 		<Order2 class="p-4" /> -->
	<!-- 	</template> -->
	<!-- </Dialog> -->
</template>
