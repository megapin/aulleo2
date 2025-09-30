<script setup>
const au = useAuStore()
const confirm = useConfirm()
const trade = useTrade()

const cog = reactive({signed_change_rate: [0.8, 1.7], acc_trade_price: [50*1e8, 3000*1e8]})
const recommends = computed(() => au.recommends?.sort((a,b) => 
	(found(b).signed_change_rate-b.signed_change_rate) 
	- (found(a).signed_change_rate-a.signed_change_rate) 
))
const intvId = ref()

const getF = () => au.filteredWsData.filter(s => 
	!s.market.includes('KRW-USD') && 
	!s.market.includes('KRW-GST') && 
	!s.market.includes('KRW-FIL') &&
	(s.signed_change_rate*100 >= cog.signed_change_rate[0] && 
	s.signed_change_rate*100 <= cog.signed_change_rate[1]) &&
	(s.acc_trade_price >= cog.acc_trade_price[0] && 
	s.acc_trade_price <= cog.acc_trade_price[1])
)
const getPick = () => ({market: recommends.value[0].market, side: 'bid', price: 2e5, ord_type: 'price'})
const onRefresh = () => {
	// au.recommends = [...new Set([...au.recommends.push(shuffle(getF()).slice(0,9))])]
	// au.recommends.push(shuffle(getF()).slice(0,9))
	const picks = shuffle(getF()).slice(0,9)
	picks.forEach(x => x.picked = au.now.slice(5,16))
	au.recommends = picks
}
const found = ({market}) => au.filteredWsData.find(x => x.market == market)
const showConfirm = (e, key, msg) => {
	confirm.require({
		target: e.currentTarget, group: 'headless', msg, key,
		accept: () => console.log('ok', e.currentTarget, e.target.outerText),
		reject: () => console.log('canceled'),
	})
}
const onOrder = async (item) => {
	// await au.setChart(item.market)
	useApexChart(item.market)
	au.market = {...item, price: item.trade_price}
	// au.isOrder = !au.isOrder
	// trade.quick({market: item.market, side: 'bid', price: 2e5, ord_type: 'price',})
}
onMounted(() => {
	onRefresh()
	intvId.value = setInterval(() => onRefresh(), 10*60*1000)
})
onUnmounted(() => clearInterval(intvId.value))
</script>

<template>
	<div class="flex justify-between pb-2">
		<div class="font-bold text-gray-400">
			Picks & Roll
			<i @click="onRefresh" class="pi pi-refresh ml-1 cupo" />
			<i @click="trade.quick(getPick())" class="pi pi-bolt ml-1 p-1 rounded-xl text-white bg-red-600 cupo" />
		</div>
		<div class="flex items-center gap-1">
			<Tag :value="cog.signed_change_rate[0]+'%↑'" />
			<Tag :value="cog.signed_change_rate[1]+'%↓'" />
			<Tag :value="cog.acc_trade_price[0]/1e8+'억↑'" />
			<i @click="showConfirm($event)" class="pi pi-cog cupo" />
		</div>
	</div>
	<DataTable :value="recommends" size="small" removableSort scrollable scrollHeight="13rem" tableStyle="min-width:100%" class="text-xs">
		<Column field="market" header="종목" sortable style="text-align:start">
			<template #body="{data}">
				<b @click="onOrder(data)" class="cupo">{{data.market.replace(/KRW-/,'')}}</b>
				<div>{{data.picked}}</div>
			</template>
		</Column>
		<Column field="signed_change_rate" header="등락" sortable style="text-align:end">
			<template #body="{data}">
				<div class="pr-2">
					{{(data.signed_change_rate*100).toFixed(2)}}%
					<div :class="textColor(data.signed_change_rate < found(data).signed_change_rate)">{{(found(data).signed_change_rate*100).toFixed(2)}}%</div>
				</div>
			</template>
		</Column>
		<Column field="trade_price" header="단가" sortable style="text-align:end">
			<template #body="{data}">
				<div class="pr-2">
					{{data.trade_price}}
					<div>{{found(data).trade_price}}</div>
				</div>
			</template>
		</Column>
		<Column field="acc_trade_price" header="거래액" sortable style="text-align:end">
			<template #body="{data}">	
				<div class="pr-2">
					{{~~(data.acc_trade_price/1e8)}}억
					<div>{{~~(found(data).acc_trade_price/1e8)}}억</div>
				</div>
			</template>
		</Column>
		<Column header="거래" style="text-align:start">
			<template #body="{data}">	
				<div class="">
					<i @click="trade.quick({market: data.market, side: 'bid', price: 2e5, ord_type: 'price'})" class="pi pi-bolt cupo" />
					<i @click="onOrder(data)" class="pi pi-shopping-cart cupo ml-1" />
				</div>
			</template>
		</Column>
	</DataTable>
	<!-- <div class="h-[9rem] mt-4"> -->
	<!-- 	<div class="font-bold text-gray-400"> -->
	<!-- 		& Roll -->
	<!-- 		<i @click="trade.quick(getPick())" class="pi pi-bolt ml-1 p-1 rounded-xl text-white bg-red-600 cupo" /> -->
	<!-- 	</div> -->
	<!-- 	<ul class="text-xs mt-2 px-1"> -->
	<!-- 		<li class="grid grid-cols-5 gap-1 justify-items-stretch items-center"> -->
	<!-- 			<template v-for="item in recommends.slice(0,3)"> -->
	<!-- 				<div @click="onOrder(item)" class="p-1 font-bold border-r border-b cupo">{{item['market'].slice(4)}}</div> -->
	<!-- 				<div class="p-1 text-end border-r border-b">{{(item['signed_change_rate']*100).toFixed(2)}}%</div> -->
	<!-- 				<div class="p-1 text-end border-r border-b">{{item['trade_price'] > 1e3 ? item['trade_price'].toFixed() : item['trade_price'].toFixed(2)}}원</div> -->
	<!-- 				<div class="p-1 text-end border-r border-b">{{(item['acc_trade_price']/1e8).toFixed()}}억</div> -->
	<!-- 				<div class="p-1 flex justify-center items-center border-r border-b"> -->
	<!-- 					<i class="pi pi-bitcoin mr-1" /> -->
	<!-- 				</div> -->
	<!-- 			</template> -->
	<!-- 		</li> -->
	<!-- 	</ul> -->
	<!-- </div> -->

	<ConfirmPopup group="headless">
		<template #container="{ message, acceptCallback, rejectCallback }">
			<div class="p-4">
				<div class="flex">등락률 <span class="ml-auto">{{cog.signed_change_rate[0]}}% ~ {{cog.signed_change_rate[1]}}%</span></div>
				<Slider v-model="cog.signed_change_rate" :min="-8" :max="15" :step="0.1" range class="w-60 mx-2 my-4" />
				<div class="flex">거래금액 <span class="ml-auto">{{~~(cog.acc_trade_price[0]/1e8)}}억 ~ {{~~(cog.acc_trade_price[1]/1e8)}}억</span></div>
				<Slider v-model="cog.acc_trade_price" :min="20*1e8" :max="3000*1e8" :step="5*1e8" range class="w-60 mx-2 my-4" />
				<div class="flex items-center justify-end gap-2 mt-4">
					<Button label="취소" outlined @click="rejectCallback" size="small"></Button>
					<Button label="확인" @click="acceptCallback" size="small"></Button>
				</div>
			</div>
		</template>
	</ConfirmPopup>
</template>
