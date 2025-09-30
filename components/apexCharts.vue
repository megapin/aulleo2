<script setup>
import {format} from 'date-fns'
import VueApexCharts from 'vue3-apexcharts'
import {seriesDataLinear, seriesData} from '@/data/ohlc'

const au = useAuStore()
const c = useRuntimeConfig()

const init = {
	series: [{ data: seriesData }],
	options: {
		chart: { type: 'candlestick', // height: 230, id: 'candles',
			toolbar: { autoSelected: 'pan', show: false },
			zoom: { enabled: false },
		},
		plotOptions: { candlestick: { colors: { upward: '#e95824', downward: '#2466e9' } } },
		xaxis: { type: 'datetime', },
		yaxis: { labels: { formatter: val => shortChartPrice(val)}, },
	},
	// series: [{ data: Array(30).fill(Date.now()).map((x,i) => [x-(30-(i+1))*864*1e5, Array(4).fill(1000).map(y => ~~(Math.random()*y))]) }],
	// options: {
	// 	chart: { type: 'candlestick', height: 230 },
	// 	title: { text: '4시간', align: 'left' },
	// 	xaxis: { type: 'datetime' },
	// 	yaxis: { 
	// 		// tooltip: { enabled: true }, 
	// 		labels: { formatter: (val) => val > 1e7 ? val/1e6 +'M' : val > 1e5 ? val/1e3 +'K' : val > 999 ? ~~val : val > 99 ? val.toFixed(1) : val.toFixed(2) }
	// 	},
	// 	plotOptions: { candlestick: { colors: { upward: '#e95824', downward: '#2466e9' }, wick: { useFillColor: true} } }
	// },
	events: {
		click: function(event, chartContext, opts) {
			// The last parameter opts contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts
			console.log('aee',event, chartContext, opts)
		}
	}
}
const vol = {
	series: [{ name: 'volume', data: seriesDataLinear }],
	options: {
		chart: { toolbar: {show: false}, type: 'bar', },
		dataLabels: { enabled: false },
		xaxis: { type: 'datetime', labels: {show:false} },
		yaxis: { labels: { formatter: val => shortChartVol(val)} },
	},
}

au.apex = {minutes_15:init, minutes_60:init, minutes_240:init, days:init, days_volume:vol}
// au.apex = {minutes_15:init, minutes_60:init, minutes_240:init, days: {candle: init, vol:vol}}
au.market = {market: 'KRW-BTC'}
const {data, error} = useApexChart(au.market.market, {deep:true})

const isDrawer = ref(false)
const isSpan = ref(false)
const w = computed(() => isSpan.value ? '!w-[80rem]' : '!w-[40rem]')

const onClick = (e, chartContext, config) => console.log(e, chartContext, config)
</script>

<template>
	<div v-if="data">
		<b class="pl-2">{{au.market.market}}</b>
		<button @click="isDrawer = !isDrawer" class="ml-2 text-xl cupo">↖</button>

		<VueApexCharts type="candlestick" height="260" :options="au.apex.minutes_15.options" :series="au.apex['minutes_15'].series" @click="onClick" />
		<VueApexCharts type="candlestick" height="260" :options="au.apex.minutes_60.options" :series="au.apex['minutes_60'].series" @click="onClick" />
		<VueApexCharts type="candlestick" height="260" :options="au.apex.minutes_240.options" :series="au.apex['minutes_240'].series" @click="onClick" />
		<VueApexCharts type="candlestick" height="260" :options="au.apex.days.options" :series="au.apex['days'].series" @click="onClick" />
		<!-- <VueApexCharts type="candlestick" height="260" :options="au.apex['days'].candle.options" :series="au.apex['days'].candle.series" @click="onClick" /> -->
		<VueApexCharts type="bar" height="120" :options="au.apex.days_volume.options" :series="au.apex.days_volume.series" class="-mt-8" />
	</div>
	<div v-else-if="error">Eih. Error!</div>
	<div v-else>Loading..</div>


	<!-- <Drawer v-model:visible="isDrawer" :class="w"> -->
	<nav :class="`absolute w-1/4 h-screen top-0 left-0 ${isDrawer ? 'translate-x-0' : '-translate-x-full'} ease-in-out duration-500 bg-white`" >
		<div class="p-4">
			<div class="text-xl flex pb-4">
				Charts
				<button @click="isSpan = !isSpan" class="ml-2 border rounded px-2 text-base">크게</button>
				<button @click="isDrawer = false" class="ml-auto font-bold">&#9747;</button>
			</div>

			<Candles />

		</div>
	</nav>
</template>
