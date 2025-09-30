// import PocketBase from 'pocketbase'
import {useAuStore} from '@/stores/au'

export const useNoti = () => {
	const au = useAuStore()
	// const pb = new PocketBase('http://anais.mheen.net/pb')
	const pb = usePb()

	const accRateAll = () => au.filteredWsData.reduce((acc,cur) => acc + cur.signed_change_rate, 0)
	const fwd = (tf) => au.filteredWsData.filter(x => tf ? x.signed_change_rate > 0 : x.signed_change_rate < 0)
	const accRate = (tf) => fwd(tf).reduce((acc,cur) => acc + cur.signed_change_rate, 0) * 100
	const accTrade = (tf) => fwd(tf).reduce((acc,cur) => acc + cur.acc_trade_price, 0)
	const accRateAvg = (tf) => accRate(tf)/fwd(tf).length

	const messages = [
		// {text: '상승', value: () => fwd(true).length, key: 'rises'},
		{text: '전종목 등락평균', value: () => (accRateAll()/au.filteredWsData.length*100).toFixed(2), key: 'all_acc_rate_avg'},
		{text: '전종목 등락률합', value: () => accRateAll().toFixed(2), key: 'all_acc_rate'},
		{text: '상승종목 상승평균', value: () => accRateAvg(true).toFixed(2), key: 'up_acc_rate_avg'},
		{text: '하락종목 하락평균', value: () => accRateAvg().toFixed(2), key: 'down_acc_rate_avg'},
		{text: '상승종목 거래총액', value: () => (accTrade(true)/1e8).toFixed(), key: 'up_acc_trade'},
		{text: '하락종목 거래총액', value: () => (accTrade()/1e8).toFixed(), key: 'down_acc_trade'},
		{text: '상승종목 상승률합', value: () => accRate(true).toFixed(2), key: 'up_acc_rate'},
		{text: '하락종목 하락률합', value: () => accRate().toFixed(2), key: 'down_acc_rate'},
	]

	const create = async () => {
		const data = {}
		messages.forEach(m => data[m.key] = [{time: au.now.slice(11,16), dat: m.value()}])
		// await pb.collection('upbit').create(data)
		await pb.create('upbit', data)
		return data
	}
	const update = async () => {
		const yyyyMMdd = new Date().toISOString().slice(1,10)
		const res = await pb.pb.collection('upbit').getFirstListItem('created ~ "'+yyyyMMdd+'"')
		for (let msg of messages) {
			const tic = {time: au.now.slice(11,16), dat: msg.value()}
			const data = {[msg.key]: [...res[msg.key], tic]}
			await pb.update('upbit', res.id, data)
		}
	}

	// return useState('foo', () => 'bar')
	return {messages, create, update }
}
