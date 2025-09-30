import {format} from 'date-fns'

export const useAuStore = defineStore('au', () => {
	const c = useRuntimeConfig()

	const now = ref(format(new Date(), 'yyyy-MM-dd hh:mm:ss'))
	const currency = ref('KRW')
	const market = ref({})
	const wsData = ref([])
	const search = ref()
	const cog = reactive({trade_price:[0.001,2*1e8], signed_change_rate:[-0.51,9.51], acc_trade_price:[1e7,5e12]})

	const chartData = reactive({})
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

	const apex = ref()
	const chartOptions = ref()


	return {
		now,
		currency, market,
		wsData,
		search, cog,
		chartData, chartOptions,
		btcKrw, usdcKrw,
		enough, low, nextLv, stop, go, timeover,
		my, bidPrice, account, myAsset, recommends, orders, isOrder,
		apex,
	}
})
