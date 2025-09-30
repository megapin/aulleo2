export const useApexChart = (market) => {
	const au = useAuStore()

	const base = `https://api.upbit.com/v1/candles`
	// const opts = ['minutes', 'days', 'weeks', 'months']
	const opts = ['minutes_15', 'minutes_60', 'minutes_240', 'days']
	const data = ref(null)
	const error = ref(null)

	watchEffect(async () => {
		data.value = {}
		error.value = null
		const marketValue = toValue(market)
		try {
			for (let k of opts) {
				const trm = k.replace('_', '/')
				const url = `${base}/${trm}?market=${marketValue}&count=30`
				const res = await $fetch(url)
				res.sort((a, b) => a.timestamp - b.timestamp)

				const dataCandle = res.map(x => [
					new Date(x.candle_date_time_kst).getTime(), 
					x.opening_price, 
					x.high_price, 
					x.low_price, 
					x.trade_price
				]) 
				const options = { title: { text: k } }
				const dataVolume = res.map(d => [new Date(d.candle_date_time_kst).getTime(), d.candle_acc_trade_volume])

				au.apex[k] = {series: [{data: dataCandle}], options}
				if (k == 'days') {
				// 	au.apex[k] = {series: [{data: dataCandle}], options}
				// 	au.apex['days']['volume'] = {series: [{data: dataVolume}], options}
					au.apex['days_volume'] = {series: [{data: dataVolume}], options: {show: false}}
				}
				// else au.apex[k] = {series: [{data: dataCandle}], options}
			}
		} catch (e) {
			error.value = e
		}
	})

	return {data, error}
}
