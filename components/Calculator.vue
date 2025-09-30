<script setup>
const au = useAuStore()

const fee = 0.05/100
const buy = ref()
const win = ref()
const buyFee = computed(() => buy.value * fee)
const sellFee = computed(() => (buy.value+rawProfit.value) * fee)
const rawProfit = computed(() => (targetPrice.value-market.value.trade_price)*volume.value)
const profit = computed(() => rawProfit.value - buyFee.value - sellFee.value)

const is = ref([true, false, false])
const market = ref({})
const avgDown = reactive({price: market.value?.avg_buy_price, vol: 0})
const avgDowned = computed(() => { 
	const mabp = +market.value?.avg_buy_price // ?.toFixed()
	const mvp = market.value?.avg_buy_price * market.value?.balance
	const avp = avgDown.price * avgDown.vol
	const tv = +market.value?.balance + avgDown.vol
	const downed = (mvp + avp)/tv
	return {mabp, avp, downed}
})
const avgPrice = ref()
const targetPrice = ref(market.value.trade_price)
const volume = ref()

const onIs = (i) => is.value = is.value.map((x, j) => j == i ? true : false)
const onChange = (e, k) => {
	if (k == 'trade_price') {
		buy.value = e * volume.value
		win.value = (targetPrice.value - e) / e * 100
	}
	if (k == 'targetPrice') win.value = (e - market.value.trade_price) / market.value.trade_price * 100
	if (k == 'volume') buy.value = e * market.value.trade_price
	if (k == 'buy') volume.value = e / market.value.trade_price
	if (k == 'win') targetPrice.value = e * market.value.trade_price / 100 + market.value.trade_price
}
</script>

<template>
	<div class="flex justify-between mb-4">
		<span class="font-bold text-gray-400">Calculator</span>
		<div>
			<template v-for="(item,i) in ['수익률','물타기','흙타기']">
				<span @click="onIs(i)" :class="`cursor-pointer ${is[i] ? 'font-bold' : 'text-gray-400'}`"> {{item}} </span>
				<span v-if="i < 2" class="mx-2 text-gray-400">|</span>
			</template>
		</div>
	</div>
	<div v-if="is[0]">
		<div class="flex flex-col gap-2 text-sm">
			<div class="flex gap-2">
			<!-- 	<label class="w-[8rem]">종목</label> -->
			<!-- 	<Select v-model="market" :options="au.filteredWsData" optionLabel="market" filter size="small" fluid class="w-full"> -->
			<!-- 		<template #value="{value}"> {{value?.market || '종목'}} </template> -->
			<!-- 	</Select> -->
				<label class="w-[8rem]">평단가</label>
				<InputNumber v-model="market.trade_price" @update:modelValue="onChange($event, 'trade_price')" suffix="원" showButtons :step="getUnit(market.trade_price)" fluid size="small" />
				<label class="w-[8rem]">목표가</label>
				<InputNumber v-model="targetPrice" @update:modelValue="onChange($event, 'targetPrice')" suffix="원" showButtons :step="getUnit(market.trade_price)" fluid size="small" />
			</div>
			<div class="flex gap-2">
				<label class="w-[8rem]">수량</label>
				<InputNumber v-model="volume" @update:modelValue="onChange($event, 'volume')" showButtons :step="1" fluid size="small" />
				<label class="w-[8rem]">투자금</label>
				<InputNumber v-model="buy" @update:modelValue="onChange($event, 'buy')" suffix="원" showButtons :step="50000" fluid size="small" />
			</div>
			<div class="flex gap-2">
				<label class="w-[8rem]">수익률</label>
				<InputNumber v-model="win" @update:modelValue="onChange($event, 'win')" suffix="%" showButtons :step="0.5" fluid size="small" />
				<div class="w-[8rem]"></div>
				<div class="w-full"></div>
			</div>
		</div>
		<div class="mt-2">
			<div class="flex justify-between border-b"> 수익 <div>{{(~~rawProfit).toLocaleString()}}</div> </div>
			<div class="flex justify-between border-b"> 매수 수수료 <div>{{(~~buyFee).toLocaleString()}}</div> </div>
			<div class="flex justify-between border-b"> 매도 수수료 <div>{{(~~sellFee).toLocaleString()}}</div> </div>
			<div class="flex justify-between"> 총평가 <div>{{(~~(buy + profit)).toLocaleString()}}</div> </div>
		</div>
	</div>
	<div v-if="is[1]">
		<div class="flex gap-2">
			<div class="flex-1">
				<label>종목</label>
				<!-- <Select v-model="market" :options="au.myAsset" optionLabel="currency" fluid> -->
				<Select v-model="market" :options="au.account" optionLabel="currency" fluid>
					<template #value="{value}"> {{value?.currency || '보유종목'}} </template>
				</Select>
			</div>
			<div class="flex-1">
				<label>단가</label>
				<InputNumber v-model="avgDown.price" suffix="원" showButtons :step="market?.step" fluid class="" />
			</div>
			<div class="flex-1">
				<label>수량</label>
				<InputNumber v-model="avgDown.vol" suffix="" showButtons fluid />
			</div>
		</div>
		<div class="mt-2">
			<div class="flex justify-between border-b"> 기존평단 <div>{{(+avgDowned.mabp.toFixed()).toLocaleString()}}</div> </div>
			<div class="flex justify-between border-b"> 물타기액 <div>{{avgDowned.avp.toLocaleString()}}</div> </div>
			<div class="flex justify-between border-b"> 물탄평단 <div>{{(+avgDowned.downed.toFixed()).toLocaleString()}}</div> </div>
		</div>
	</div>
</template>
