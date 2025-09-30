<script setup>
import {format, formatDistanceToNow} from 'date-fns'

const au = useAuStore()
const pb = usePb()
// const trade = useTrade()
const {checkPast, checkBids} = useTransaction()

const bids = await checkBids()
// const _past = await checkPast()
// const past = ref(_past)

// const MM = au.now.slice(5,7)
// const dd = au.now.slice(8,10)
const day = ref(au.now)
const menu = ref()
// const date = computed(() => format(day.value, 'dd'))
// const prev = async () => {
// 	const end_time = `${au.now.slice(0,8)}${dd-7*1}T00:00:00+09:00`
// 	console.log(end_time)
// 	past.value = await checkPast(null, end_time)
// 	console.log(past.value)
// }
</script>

<template>
	<div class="flex items-center">
		<span class="font-bold text-gray-400">거래내역</span>
		<i @click="menu.toggle($event)" class="ml-auto pi pi-calendar cupo" />
	</div>
	<div>
		<div v-for="item in bids" class="flex border-b py-1 text-sm font-bold">
			<div class="w-14">{{item.market.slice(4)}}</div>
			<div class="flex-1 text-end">{{~~item.executed_funds}}</div>
			<div class="flex-1 text-end">{{shortVol(item.executed_funds/item.executed_volume, +item.executed_volume)}}</div>
			<div class="flex-1 text-end">{{item.executed_funds/item.executed_volume}}</div>
			<div class="flex-1 text-end text-xs">{{formatDate(item.created_at)}}</div>
		</div>
	</div>
	<!-- <div class="flex items-center mt-4"> -->
	<!-- 	<span class="font-bold text-gray-400">지난거래내역</span> -->
	<!-- 	<div class="ml-auto flex gap-1 items-center"> -->
	<!-- 		<span @click="prev" class="cupo"><</span> -->
	<!-- 		<span @click="day = dd-7+n" v-for="n in 7" :class="`cupo text-sm ${day == dd-7+n && 'font-bold'}`"> -->
	<!-- 			{{dd-7+n}}</span> -->
	<!-- 		<span class="cupo">></span> -->
	<!-- 	</div> -->
	<!-- </div> -->
	<!-- <div> -->
	<!-- 	<div v-for="item in past.filter(x => x.executed_funds > 0 && x.created_at.slice(8,10) == day)" class="flex border-b py-1 text-sm font-bold"> -->
	<!-- 		<div class="flex-1">{{item.market.slice(4)}}</div> -->
	<!-- 		<div class="flex-1 text-end">{{~~item.executed_funds}}</div> -->
	<!-- 		<div class="flex-1 text-end">{{item.executed_volume > 1e3 ? ~~(item.executed_volume/1e3)+'K' : ~~item.executed_volume}}</div> -->
	<!-- 		<div class="flex-1 text-end">{{item.side}}</div> -->
	<!-- 		<div class="flex-1 text-end">{{formatDate(item.created_at)}}</div> -->
	<!-- 	</div> -->
	<!-- </div> -->

	<Menu ref="menu" :popup="true">
		<template #start>
			<!-- <DatePicker v-model="day" view="month" dateFormat="mm/yy" inline class="w-[15rem]" /> -->
			<DatePicker v-model="day" dateFormat="mm/dd" inline class="" />
		</template>
	</Menu>
</template>
