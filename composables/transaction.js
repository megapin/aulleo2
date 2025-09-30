export const useTransaction = () => {
	const au = useAuStore()
	const pb = usePb()

	const isEnough = (ord) => {
		const {market, executed_funds, executed_volume} = ord
		const price = executed_funds / executed_volume
		const trade_price = au.filteredWsData.find(x => x.market == ord.market).trade_price
		const earn = (trade_price - price) / price * 100
		if (earn >= au.enough) {
			if (!au.nextLv[market]) {
				au.nextLv[market] = {}
				au.nextLv[market].stop = au.enough - au.stop
				au.nextLv[market].go = au.enough + au.go
			} else {
				if (earn >= au.nextLv[market].go) {
					au.nextLv[market].stop = au.nextLv[market].go - au.stop
					au.nextLv[market].go = au.nextLv[market].go + au.go
				}
				if (earn < au.nextLv[market].stop) return true
			}
		}
		if (au.nextLv[market] && earn < au.nextLv[market].stop) return true
	}

	const checkPast = async (market, end_time=`2024-11-22T00:00:00+09:00`) => {
		const body = {market, end_time, states: ['done', 'cancel']}
		return await $fetch('/api/order', {method: 'POST', body})
	}
	const checkBids = async () => {
		// const uuids = await pb.getFullList('upbit_uuids')
		const uuids = await pb.getFullList('upbit_orders', {filter: "status='done'"})
		const body = {uuids: uuids.map(x => x.uuid)}
		const res = await $fetch('/api/order', {method:'POST', body})
		return res.map(x => ({...x, id: uuids.find(y => y.uuid == x.uuid).id}))
	}

	const askMarket = async (orders) => {
		if (!orders.length) return
		const res = await Promise.all(orders.map(async (x) => {
			const body = {market: x.market, side: 'ask', volume: x.volume, ord_type: 'market'}
			await $fetch('/api/order', {method: 'POST', body})
		}))
		console.log(res)
	}
	const bidPrice = async () => {
		const krwBal = au.account?.find(x => x.currency == 'KRW').balance
		const rndPick = au.recommends[~~(Math.random()*au.recommends.length)]
		const body = {market: rndPick.market, side: 'bid', price: 2e5, ord_type: 'price'}
	}

	const runAuto = async () => {
		const bids = await checkBids()
		const enoughs = bids.filter(x => isEnough(x))
		askMarket(enoughs)
		bidPrice()
	}

	const cancel = async (item) => {
		if (confirm(JSON.stringify(item))) {
			await $fetch('/api/order', {method: 'DELETE', body: {uuid: item.uuid}})
			// await $fetch('/api/order', body)
			// await pb.update('upbit_orders', item.id, {status: 'cancel'})
		}
	}

	const quick = async (body, order) => {
		if (confirm(JSON.stringify(body))) {
			await $fetch('/api/order', {method: 'POST', body})
		}
	}

	const allOut = async () => {
		const toSells = au.orders.filter(x => x.status == 'done')
		for (let order of toSells) {
			const {market, volume} = order
			// await fetchOrder({market, side: 'ask', volume, ord_type: 'market'}, order)
		}
	}

	const allIn = async () => {
		const side = 'bid'
		// const res = await $fetch('/api/order', {method: 'POST', body})
	}

	return {checkPast, checkBids, runAuto, cancel, quick, allOut, allIn}
}
