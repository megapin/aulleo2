<script setup>
const pb = usePb()
const au = useAuStore()

const acc = await $fetch('/api/account')
// const upbit_assets_manual = await pb.getFullList('upbit_assets_manual')
// const manuals = ref(upbit_assets_manual)
const autokeys = ['market','balance','locked','volume','avg_buy_price','trade_price','earn','auto']

const account = computed(() => acc.map(x => {
	const f = au.filteredWsData.find(y => y.market.slice(4) == x.currency)
	// const manual = manuals.value.find(y => y.market == 'KRW-'+x.currency)
	if (f) return {
		...x, 
		volume: x.balance,
		market: f.market, 
		avg_buy_price: shortNo(+x.avg_buy_price),
		trade_price: f.trade_price, 
		earn: (f.trade_price - x.avg_buy_price) / x.avg_buy_price * 100, 
		auto: 'A or M' // manual?.id
	}
}).filter(x => x))

const visible = ref(false)
const intvId = ref()

const askMarket = (order) => {
	if (!order) return
	let {id, market, volume} = order
	const body = {market, side: 'ask', volume, ord_type: 'market'}
	console.log(body)
	// await $fetch('/api/order', {method: 'POST', body})
	// await pb.update('upbit_orders', id, {status: 'completed'})
	// au.nextLv[market] = null
}
const enough = async (order) => {
	const {market, earn} = order
	if (earn > au.enough && !au.nextLv[market]) {
		// au.nextLv[market] = {go: au.enough + au.go, stop: au.enough - au.stop}
		await pb.create('upbit_log', {data: au.now +', '+ market +', '+ au.nextLv[market].go})
	}
	if (earn > au.nextLv[market]?.go) {
		// au.nextLv[market] = {go: au.nextLv[market].go + au.go, stop: au.nextLv[market].go - au.stop}
		await pb.create('upbit_log', {data: au.now +', '+ market +', '+ au.nextLv[market].stop})
	}
	if (au.nextLv[market]?.stop > earn) return order
}
// const enough = async (orders) => {
// 	const itr = orders[Symbol.iterator]()
// 	const order = itr.next().value
// 	const {market, earn} = order
// 	if (earn > au.enough && !au.nextLv[market]) {
// 		await pb.create('upbit_log', {data: au.now +', '+ market +', '+ au.nextLv[market].go})
// 	}
// 	if (earn > au.nextLv[market]?.go) {
// 		await pb.create('upbit_log', {data: au.now +', '+ market +', '+ au.nextLv[market].stop})
// 	}
// 	if (au.nextLv[market]?.stop > earn) yield order
// }
const runAuto = async () => {
	const autos = account.value.filter(x => x.auto)
	for (let order of autos) { askMarket(await enough(order)) }
	// askMarket(await enough(autos))
}

// onMounted(() => intvId.value = setInterval(() => runAuto(), 3000))
// onUnmounted(() => clearInterval(intvId.value))

const onAuto = async (item) => {
	// item.auto
	// 	? await pb.detach('upbit_assets_manual', item.auto)
	// 	: await pb.create('upbit_assets_manual', {market: 'KRW-'+item.currency})
	// manuals.value = await pb.getFullList('upbit_assets_manual')
}
</script>

<template>
	<!-- <button @click="onClick">btn</button> -->
	<Avatar @click="visible = !visible" icon="pi pi-sliders-h" shape="circle" class="cupo bg-sky-200" />
	<Dialog v-model:visible="visible" modal header="Account assets" class="w-[74rem]">
		<!-- <table class="text-end w-full"> -->
		<!-- 	<th v-for="k in Object.keys(acc[0])" class="border-b-2 border-gray-400">{{k}}</th> -->
		<!-- 	<tr v-for="item in acc"> -->
		<!-- 		<td v-for="k in Object.keys(acc[0])" class="border-b">{{item[k]}}</td> -->
		<!-- 	</tr> -->
		<!-- </table> -->
		<table class="text-end w-full mt-4">
			<th v-for="k in autokeys" class="border-b-2 border-gray-400">{{k}}</th>
			<tr v-for="item in account">
				<td v-for="k in autokeys" class="border-b">
					<span v-if="k=='auto'" @click="onAuto(item)" class="cupo">{{item[k] ? 'M' : 'A'}}</span>
					<span v-else>{{item[k]}}</span>
				</td>
			</tr>
		</table>
		<!-- <table class="text-end w-full mt-4"> -->
		<!-- 	<th v-for="k in autokeys" class="border-b-2 border-gray-400">{{k}}</th> -->
		<!-- 	<tr v-for="item in account.filter(x => x.auto)"> -->
		<!-- 		<td v-for="k in autokeys" class="border-b">{{item[k]}}</td> -->
		<!-- 	</tr> -->
		<!-- </table> -->
	</Dialog>
</template>

