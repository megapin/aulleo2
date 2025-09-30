<script setup>
import {format} from 'date-fns'
import VueApexCharts from 'vue3-apexcharts'

// const props = defineProps(['term'])
const au = useAuStore()
const pb = usePb()

const init = ref({
	series: [{ data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54] }],
	options: {
		chart: { type: 'area', height: 180, sparkline: { enabled: true }, },
		stroke: { curve: 'straight' },
		fill: { opacity: 0.3 },
		// xaxis: { crosshairs: { width: 1 }, },
		yaxis: { min: 0 },
		tooltip: {
			fixed: { enabled: false },
			x: { show: false },
			y: { title: { formatter: function (seriesName) { return '' } } },
			marker: { show: false }
		},
		title: { text: '종목 등락', offsetX: -8, style: { fontSize: '14px', } },
		subtitle: { text: '평균', offsetX: -8, offsetY: 18, style: { fontSize: '12px', } }
	}
})
const intvId = ref()

const getData = async () => {
	const res = await pb.pb.collection('upbit').getFirstListItem('created ~ "'+ new Date().toISOString().slice(0,10) +'"')
	init.value.series = [{ data: res['rises'].map(x => x.dat) }]
	// chartData.labels = res.rises.map(x => x.time)
	// chartData.datasets[0].data = res.rises.map(x => x.dat)
	// chartData.datasets[1].data = res.acc_rate_all.map(x => x.dat*10)
	// chartData.datasets[2].data = res.acc_rate_all.map(x => x.dat/au.filteredWsData.length*1000)
}

onMounted(() => {
	getData()
	intvId.value = setInterval(() => getData(), 5*60*1000)
})
onUnmounted(() => clearInterval(intvId.value))
</script>

<template>
	<VueApexCharts type="area" height="180" :options="init.options" :series="init.series" />
	<!-- <div class="relative"> -->
	<!-- 	<div class="absolute top-7 left-3 text-end w-[40%] z-10"> -->
	<!-- 		<div class="flex gap-2"> -->
	<!-- 			<i @click="term = 'minutes'" :class="`${term == 'minutes' && 'bg-amber-200'} rounded-xl pi pi-clock`" /> -->
	<!-- 			<i @click="term = 'days'" :class="`${term == 'days' && 'bg-blue-200'} rounded-xl pi pi-calendar`" /> -->
	<!-- 			<i @click="term = 'weeks'" :class="`${term == 'weeks' && 'bg-green-200'} rounded-xl pi pi-wave-pulse`" /> -->
	<!-- 			<i @click="term = 'months'" :class="`${term == 'months' && 'bg-pink-200'} rounded-xl pi pi-moon`" /> -->
	<!-- 			<i @click="isDrawer = !isDrawer" class="pi pi-arrow-up-left ml-2 cursor-pointer" /> -->
	<!-- 		</div> -->
	<!-- 	</div> -->
	<!-- </div> -->
	<!-- <VueApexCharts type="candlestick" height="230" :options="au.apex[term].options" :series="au.apex[term].series" /> -->

	<!-- <Drawer v-model:visible="isDrawer" :class="w"> -->
	<!-- 	<template #header> -->
	<!-- 		<div class="text-xl"> -->
	<!-- 			Charts -->
	<!-- 			<Button @click="isSpan = !isSpan" severity="secondary" rounded icon="pi pi-arrows-h" class="ml-2" /> -->
	<!-- 		</div> -->
	<!-- 	</template> -->
	<!-- 	<Candles /> -->
	<!-- </Drawer> -->
</template>
