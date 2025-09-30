import {format} from 'date-fns'

export const useAuStore = defineStore('au', () => {
	const c = useRuntimeConfig()

	const now = ref(format(new Date(), 'yyyy-MM-dd hh:mm:ss'))
	const currency = ref('KRW')
	const market = ref({})
	const wsData = ref()
	const search = ref()
	const cog = reactive({trade_price:[0.001,2*1e8], signed_change_rate:[-0.51,9.51], acc_trade_price:[1e7,5e12]})

	// const filteredWsData = computed(() => wsData.value.filter(d => d.market ? d.market.startsWith(currency.value) : d.code.startsWith(currency.value)))
	const filteredWsData = computed(() => wsData.value.filter(d => d.market.startsWith(currency.value)))

	const chartData = reactive({})
	const sparklineData = reactive({
		up: [], down: [], upAbove: [], downAbove: [], 
		accTradePriceAbove5: [], accTradePriceAbove15: [],
		marketAccTradePrice: [], marketAccTradePrice24h: [],
	})
	const btcKrw = computed(() => wsData.value.find(d => d.market == 'KRW-BTC').trade_price)
	const usdcKrw = computed(() => wsData.value.find(d => d.market == 'KRW-USDC').trade_price)

	const enough = ref() // ref(0.87)
	const low = ref() // ref(-1.83)
	const nextLv = reactive({})
	const go = ref() // ref(0.37)
	const stop = ref() // ref(0.15)
	const timeover = ref() // ref(48)

	const my = ref()
	const bidPrice = ref(2e5)
	const account = ref()
	const myAsset = ref()
	const recommends = ref([])
	const orders = ref()
	const isOrder = ref(false)
	const apex = ref({minutes_15:'', minutes_60:'', minutes_240:'', days:'', days_vol:''})

	const setChart = async (market) => {
		const url = c.public.upbit+'/candles/'
		const query = {market, count: 30}
		const opt = {
			minutes: { cut: {s: 11, e: 16}, label: '(4h)', borderColor: 'dodgerblue', },
			days: { cut: {s: 5, e: 10}, label: '(일)', borderColor: 'gray', },
			weeks: { cut: {s: 5, e: 10}, label: '(주)', borderColor: 'olive', },
			months: { cut: {s: 2, e: 7}, label: '(월)', borderColor: 'green', }
		}
		for (let k of Object.keys(opt)) {
			const res = await $fetch(k == 'minutes' ? url+'minutes/240' : url+k, {query})
			res.sort((a, b) => a.timestamp - b.timestamp)
			apex[k] = {
				series: [{data: res.map(x => [new Date(x.candle_date_time_kst).getTime(), x.opening_price, x.high_price, x.low_price, x.trade_price])}],
				options: { title: {text: market}, }
			}
			chartData[k] = {
				labels: res.map(x => x.candle_date_time_kst.slice(opt[k].cut.s, opt[k].cut.e)),
				datasets: [{
					label: market + opt[k].label,
					data: res.map(x => market.includes('BTC-') ? x.trade_price*btcKrw.value : x.trade_price),
					fill: false,
					borderColor: opt[k].borderColor,
					tension: 0.4,
					type: 'line',
					yAxisID: 'y',
					pointStyle: false,
				},
				{
					label: '누적거래량',
					data: res.map(x => x.candle_acc_trade_volume),
					backgroundColor: 'lightgray',
					type: 'bar',
					yAxisID: 'y1'
				}]
			}
		}
	}
	const chartOptions = ref()


	return {
		now,
		currency, market,
		wsData, filteredWsData,
		search, cog,
		chartData, chartOptions,
		sparklineData,
		btcKrw, usdcKrw,
		enough, low, nextLv, stop, go, timeover,
		my, bidPrice, account, myAsset, recommends, orders, isOrder,
		apex,

		setChart,
	}
})
