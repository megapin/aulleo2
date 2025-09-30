<script setup>
const au = useAuStore()

const isMenu = ref(false)
const x = ref(0)
const y = ref(0)
const sumScr = computed(() => au.wsData?.reduce((a, b) => a + b.signed_change_rate, 0)*100)
const sumScrAvg = computed(() => sumScr.value/au.wsData?.length)
const sumAtp = computed(() => au.wsData?.reduce((a,b) => a+b.acc_trade_price,0)/1e12)
const sumAtp24h = computed(() => au.wsData?.reduce((a,b) => a+b.acc_trade_price_24h,0)/1e12)
// const chg = ref([])
// const scrStepUp = ref()
// const scrStepDn = ref()

// watchEffect(() => {
// 	if (!isNaN(sumScr.value) && !scrStepUp.value) {
// 		scrStepUp.value = Math.ceil(sumScr?.value/10)*10 + 5
// 		scrStepDn.value = Math.floor(sumScr?.value/10)*10 - 5
// 	}
// 	if (sumScr?.value > scrStepUp.value) {
// 		scrStepUp.value += 5
// 		scrStepDn.value += 5
// 		chg.value.push({up: true, nup: scrStepUp.value, ndn: scrStepDn.value, sumScr: sumScr.value.toFixed(2), 시간: au.now})
// 	}
// 	if (sumScr?.value < scrStepDn.value) {
// 		scrStepUp.value -= 5
// 		scrStepDn.value -= 5
// 		chg.value.push({up: false, nup: scrStepUp.value, ndn: scrStepDn.value, sumScr: sumScr.value.toFixed(2), 시간: au.now})
// 	}
// })

const onFilter = e => {
	x.value = e.clientX
	y.value = e.clientY
	isMenu.value = !isMenu.value
}
</script>

<template>
	<div class="pb-2 flex">
		<div class="flex-1 flex justify-end items-center gap-2">
			<button @click="onFilter" class="mr-1">📑</button>
			<input v-model="au.search" type="search" class="p-2 border-b" placeholder="종목 검색" />
		</div>
		<div class="flex-1 leading-none flex items-center justify-end gap-2 font-mono font-bold">
			<div class="flex-1 text-end">
				<span class="text-red-600">{{au.wsData?.filter(x => x.signed_change_rate > 0).length}} &#8710;</span><br>
				<span class="text-blue-600">{{au.wsData?.filter(x => x.signed_change_rate < 0).length}} &#8711;</span>
			</div>
			<div :class="`flex-1 text-end ${textColor(sumScr)}`">
				{{sumScr?.toFixed(2)}}<br>
				{{sumScrAvg?.toFixed(2)}}
			</div>
			<div class="flex-1 text-end">
				{{sumAtp.toFixed(2)}}<span class="text-xs text-gray-400">조</span><br>
				{{sumAtp24h.toFixed(2)}}<span class="text-xs text-gray-400">조</span>
			</div>
		</div>
	</div>

	<div v-if="isMenu" class="absolute bg-white" :style="{left: x+'px', top: y+5+'px'}">
		<div class="p-4">
			<div class="flex">
				거래가 
				<span class="ml-auto">
					{{au.cog.trade_price[0]}}원 ~ {{au.cog.trade_price[1] > 1e6 ? (au.cog.trade_price[1]/1e3).toFixed() +'K' : au.cog.trade_price[1]}}원
				</span>
			</div>
			<input v-model="au.cog.trade_price" type="range" min="0.001" max="1000000" step="500" class="w-60 mx-2 my-4" />
			<div class="flex">
				등락률 
				<span class="ml-auto">
					{{(au.cog.signed_change_rate[0]*100).toFixed(2)}}% ~ {{(au.cog.signed_change_rate[1]*100).toFixed(2)}}%
				</span>
			</div>
			<!-- <Slider v-model="au.cog.signed_change_rate" :min="-1" :max="1" :step="0.01" range class="w-60 mx-2 my-4" /> -->
			<input v-model="au.cog.signed_change_rate" type="range" :min="-1" :max="1" :step="0.01" class="w-60 mx-2 my-4" />
			<div class="flex">
				거래금액 
				<span class="ml-auto">
					{{~~(au.cog.acc_trade_price[0]/1e8)}}억 ~ {{~~(au.cog.acc_trade_price[1]/1e8)}}억
				</span>
			</div>
			<input v-model="au.cog.acc_trade_price" type="range" :min="1e8" :max="30*1e10" :step="5*1e8" class="w-60 mx-2 my-4" />
		</div>
	</div>
</template>
