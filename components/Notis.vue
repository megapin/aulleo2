<script setup>
const c = useRuntimeConfig()
const au = useAuStore()
const pb = usePb()

const accRateAll = () => au.filteredWsData.reduce((acc,cur) => acc + cur.signed_change_rate, 0)*100
const accRateAllAvg = () => accRateAll()/au.filteredWsData.length
// const accRateAllAvg = () => accRateAll()/au.filteredWsData.length*100
const fwd = (tf) => au.filteredWsData.filter(x => tf ? x.signed_change_rate > 0 : x.signed_change_rate < 0)
const accRate = (tf) => fwd(tf).reduce((acc,cur) => acc + cur.signed_change_rate, 0) * 100
const accTrade = (tf) => fwd(tf).reduce((acc,cur) => acc + cur.acc_trade_price, 0)
const accRateAvg = (tf) => accRate(tf)/fwd(tf).length

// const intvId = ref()
// const chartData = reactive({ 
// 	labels: ['00:00','00:10','00:20'], 
// 	datasets: [
// 		{label: '상승종목', data: [0], fill: false, borderColor: 'tomato', tension: 0.3, type: 'line', pointStyle: false, backgroundColor: 'rgba(107, 114, 128, 0.2)'},
// 		{label: '등락률합', data: [0], fill: false, borderColor: 'dimgray', tension: 0.3, type: 'line', pointStyle: false},
// 		{label: '등락평균', data: [0], fill: true, borderColor: 'royalblue', tension: 0.3, type: 'line', pointStyle: false},
// 	]
// })
//
// const getData = async () => {
// 	// au.setChart(market) 
// 	const res = await pb.pb.collection('upbit').getFirstListItem('created ~ "'+ new Date().toISOString().slice(0,10) +'"')
// 	chartData.labels = res.rises.map(x => x.time)
// 	chartData.datasets[0].data = res.rises.map(x => x.dat)
// 	chartData.datasets[1].data = res.acc_rate_all.map(x => x.dat*10)
// 	chartData.datasets[2].data = res.acc_rate_all.map(x => x.dat/au.filteredWsData.length*1000)
// }
//
// onMounted(() => {
// 	getData()
// 	intvId.value = setInterval(() => getData(), 5*60*1000)
// })
// onUnmounted(() => clearInterval(intvId.value))
</script>

<template>
	<div class="flex text-gray-400 font-bold">
		<div>
			<div class="flex justify-between">
				전종목 등락률 합
				<div :class="`${accRateAll() > 0 ? 'text-red-600' : 'text-blue-600'} ml-2 text-black`"><code>{{accRateAll().toFixed(2)}}</code></div>
			</div>
			<div class="flex justify-between">
				전종목 등락률 평균
				<div :class="`${accRateAllAvg() > 0 ? 'text-red-600' : 'text-blue-600'} ml-2 text-black`"><code>{{accRateAllAvg().toFixed(2)}}</code></div>
			</div>
		</div>
		<div class="ml-auto">
			<div>
				<div class="flex justify-between">
					상승 평균
					<div class="ml-2 text-black"><code>{{accRateAvg(true).toFixed(2)}}</code></div>
				</div>
				<div class="flex justify-between">
					하락 평균
					<div class="ml-2 text-black"><code>{{accRateAvg().toFixed(2)}}</code></div>
				</div>
			</div>
		</div>
	</div>
	<div>
		<!-- <Chart type="line" :data="chartData" :options="au.chartOptions" class="h-[15rem]" /> -->
		<Sparkline />
	</div>
</template>
