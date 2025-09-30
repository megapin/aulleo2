<script setup>
const c = useRuntimeConfig()
const au = useAuStore()

const socket = ref()
const by = reactive({asc: -1, key: ''})

const txtColor = {RISE: 'text-red-600', FALL: 'text-blue-700', EVEN: 'text-gray-600'}
// const res = await $fetch(c.public.upbit+'/market/all', {query: {is_details: 'true'}})
const res = await $fetch(c.public.upbit+'/market/all')
const codes = res.filter(x => x.market.startsWith('KRW-')).map(x => x.market)
au.wsData = codes.map(x => ({market: x, asset: au.account?.find(y => x.slice(4) == y.currency) ? true : false}))

const upb = computed(() => {
	const t = 'trade_price', s = 'signed_change_rate', a = 'acc_trade_price'
	const auSearch = x => au.search ? x.market.includes(au.search.toUpperCase()) : x
	const auCog = x => (x[t] >= au.cog[t][0] && x[t] <= au.cog[t][1]) &&
		(x[s] >= au.cog[s][0] && x[s] <= au.cog[s][1]) &&
		(x[a] >= au.cog[a][0] && x[a] <= au.cog[a][1])
	if (by.key) {
		const {key, asc} = by
		key == 'market'
			?	au.wsData.sort((a, b) => a[key] > b[key] ? 1*asc : a[key] < b[key] ? -1*asc : 0) 
			: au.wsData.sort((a, b) => asc == 1 ? a[key] - b[key] : b[key] - a[key])
	}
	return au.wsData.filter(auCog).filter(auSearch)
})

const onSort = (key) => { 
	by.asc = by.key == key ? by.asc * -1 : -1
	by.key = key
}

onMounted(() => {
	socket.value = new WebSocket("wss://api.upbit.com/websocket/v1")
	const payload = '[{"ticket":"test"}, {"type":"ticker", "codes":['+ codes +']}]'
	socket.value.onopen = (event) => socket.value.send(payload)
	socket.value.onmessage = async ({data}) => {
		const parsed = JSON.parse(await data.text())
		// const idx = au.wsData.findIndex(x => x.market == parsed.code)
		// au.wsData[idx] = {...au.wsData[idx], ...parsed}
		au.wsData = au.wsData.map(x => x.market == parsed.code ? {...x, ...parsed} : x)
	}
})
onUnmounted(() => socket.value.onclose = (event) => console.log('Socket closed.'))
</script>

<template>
	<ul class="text-sm">
		<li class="flex border-b font-bold text-gray-500">
			<div class="basis-1/5 cupo" @click="onSort('market')">종목⇅</div>
			<div class="basis-1/4 text-end cupo" @click="onSort('trade_price')">거래가⇅</div>
			<div class="basis-1/5 text-end cupo" @click="onSort('signed_change_rate')">등락⇅</div>
			<div class="basis-1/5 text-end cupo" @click="onSort('signed_change_rate')">% ⇅</div>
			<div class="basis-1/4 text-end cupo" @click="onSort('acc_trade_price')">거래 ⇅</div>
		</li>
		<li v-for="(item, i) in upb" :class="`flex border-b ${item.asset && 'bg-yellow-200'}`">
			<!-- <div class="pr-1 text-sm text-gray-400">{{('0'+(i+1)%100).slice(-2)}}</div> -->
			<div @click="au.market = item" class="basis-1/5 font-bold text-black cupo">{{item.market.slice(4)}}</div>
			<div :class="`basis-1/4 ${txtColor[item.change]} text-end`">{{item.trade_price}}</div>
			<div :class="`basis-1/5 ${txtColor[item.change]} text-end`">{{item.change_price}}</div>
			<div :class="`basis-1/5 ${txtColor[item.change]} text-end`">{{(item.signed_change_rate*100)?.toFixed(2)}}</div>
			<div :class="`basis-1/4 text-end`">
				{{~~(item.acc_trade_price/1e8)}}<span class="text-xs">{{(item.acc_trade_price/1e8).toFixed(2).slice(-3)}}</span>
				<span class="text-gray-400 text-xs">억</span>
			</div>
		</li>
	</ul>
</template>
