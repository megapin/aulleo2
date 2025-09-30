<script setup>
import {format} from 'date-fns'
import VueApexCharts from 'vue3-apexcharts'

const au = useAuStore()
const c = useRuntimeConfig()

const init = {
	series: [{ data: [ [1731963400449, 6593.34, 6600, 6582.63, 6600], [1731964739581, 6595.16, 6604.76, 6590.73, 6593.86] ] }],
	options: {
		chart: { type: 'candlestick', height: 270 },
		title: { text: '4시간', align: 'left' },
		xaxis: { type: 'datetime' },
		yaxis: { 
			tooltip: { enabled: true }, 
			labels: { formatter: (val) => val > 1e6 ? val/1e3 +'k' : val > 999 ? ~~val : val > 99 ? val.toFixed(1) : val.toFixed(2) }
		},
		plotOptions: { candlestick: { colors: { upward: '#e95824', downward: '#2466e9' }, wick: { useFillColor: true} } }
	}
}
const terms = ['minutes','days','weeks','months']

const apex = reactive({
	minutes: {series: init.series, options: init.options}, 
	days: {series: init.series, options: init.options}, 
	weeks: {series: init.series, options: init.options}, 
	months: {series: init.series, options: init.options}
})
const market = ref(au.market.market)
const term = ref('days') // '2024-01-01%2000%3A00%3A00'
const to = ref()
const count = ref(100)
const mins = ref(240)

const onSetChart = async () => {
	if (!to.value) return
	to.value = new Date(to.value).toISOString()
	// const query = {market, count: 100, to: to.value}
	// const res = await $fetch(url, {query})
	const base = `https://api.upbit.com/v1/candles`
	for (let t of terms) {
		const trm = t == 'minutes' ? `${t}/${mins.value}` : t
		const url = `${base}/${trm}?market=${market.value}&count=${count.value}&to=${to.value}`
		const res = await $fetch(url)
		res.sort((a,b) => a.timestamp - b.timestamp)
		apex[t].series = [{data: res.map(x => [new Date(x.candle_date_time_kst).getTime(), x.opening_price, x.high_price, x.low_price, x.trade_price])}],
		apex[t].options = {
			title: { text: `${market.value} (${t})` },
			xaxis: { type: 'category', labels: { formatter: (val) => format(new Date(val), '`yy-MM-dd') } },
		}
	}
}
onSetChart()
</script>

<template>
	<div class="h-[90dvh]">
		<div class="grid md:grid-cols-2 md:grid-cols-[5rem_1fr_5rem_1fr] gap-2 pb-4">
			<label class="text-end pr-2">종목</label>
			<select v-model="market" @input="(val) => (market = market.toUpperCase())" class="w-full border-b">
				<option v-for="item in au.filteredWsData" :value="item.market">{{item.market}}</option>
			</select>
			<label class="text-end pr-2">~ 까지</label>
			<input type="date" v-model="to" dateFormat="yy-mm-dd" class="w-full border-b" />
			<label class="text-end pr-2">캔들 종류</label>
			<select v-model="term" class="w-full border-b">
				<option v-for="item in terms" :value="item">{{item}}</option>
			</select>
			<label class="text-end pr-2">갯수</label>
			<input v-model="count" type="number" :min="50" :max="200" :step="10" class="border-b" />

			<button @click="" class="border col-start-2">분봉</button>
			<button @click="onSetChart" class="border col-start-4">불러오기</button>
		</div>

		<ClientOnly>
			<VueApexCharts type="candlestick" height="27%" :options="apex.days.options" :series="apex.days.series" />
			<VueApexCharts type="candlestick" height="27%" :options="apex.weeks.options" :series="apex.weeks.series" class="mt-3" />
			<VueApexCharts type="candlestick" height="27%" :options="apex.months.options" :series="apex.months.series" class="mt-3" />
		</ClientOnly>
	</div>
</template>
