export const useTrade = () => {
	const au = useAuStore()
	const pb = usePb()

	const chkExecuted = async (orders) => {
		if (!orders || !orders.length) return
		const body = {uuids: orders.map(x => x.uuid)}
		const res = await $fetch('/api/order', {method:'POST', body})
		const resUuids = res.map(x => ({...x, ...orders.find(y => y.uuid == x.uuid)}))

		const resPb = await Promise.all(resUuids.map(async (x) => {
			const price = (x.executed_funds/x.executed_volume).toFixed(5)
			const data = !x.status
				? {status: 'done', volume: x.executed_volume, price}
				: {status: 'fin', askPrice: price}
			if (x.state !== 'wait') await pb.update('upbit_orders', x.id, data)
		}))
	}
	const askMarket = async (order) => {
		if (!order) return
		let {id, market, volume} = order
		const body = {market, side: 'ask', volume, ord_type: 'market'}
		console.log('autoAsk:',body)
		// const res = await $fetch('/api/order', {method: 'POST', body})
		// await pb.update('upbit_orders', id, {uuid: res.uuid, status: 'completed'})
		// au.nextLv[market] = null
	}
	const bidPrice = async () => {
		const krwBal = au.account?.find(x => x.currency == 'KRW').balance
		const rndPick = au.recommends[~~(Math.random()*au.recommends.length)]
		const body = {market: rndPick.market, side: 'bid', price: 2e5, ord_type: 'price'}
		// await $fetch('/api/order', {method: 'POST', body})
	}

	const autoAsk = async (items) => {
		for (let x of items) {
			// const timeover = new Date(created).getTime()+(au.timeover*60*60*1000) < Date.now()
			// const timeToAsk = isEnough(order) || (earn < au.low && timeover) || timeover
			const {id, market, price, enough, go, stop, lv, manual} = x
			const trade_price = au.filteredWsData.find(y => y.market == market).trade_price
			const earn = (trade_price - price) / price * 100

			// if (earn > enough && !au.nextLv[market]) {
			// 	au.nextLv[market] = {go: enough + go, stop: enough - stop}
			// 	// await pb.create('upbit_log', {nextLv: au.nextLv[market]})
			// }
			// if (earn > au.nextLv[market]?.go) {
			// 	au.nextLv[market] = {go: au.nextLv[market].go + go, stop: au.nextLv[market].go - stop}
			// }
			// if (au.nextLv[market]?.stop > earn) askMarket(x)
			
			if (earn > enough) {
				// if (lv == 0) await pb.update('upbit_orders', id, {lv: 1})
				// if (lv > 0 && earn > enough+go*lv) await pb.update('upbit_orders', id, {lv: lv+1})
				const level = lv == 0 ? 1 : (lv > 0 && earn > enough+go*lv) ? lv+1 : 0
				if (level) await pb.update('upbit_orders', id, {lv: level})
				if (lv > 0 && (enough+go*lv)-stop > earn && !manual) {
					console.log('auto:', market, lv, (enough+go*lv)-stop, earn)
					// askMarket(x)
				}
				if (manual) {
					console.log('manual:', market, lv, enough+go*lv-stop, earn)
				}
			}
		}
	}
	const runAuto = async () => {
		au.orders = await pb.getFullList('upbit_orders')
		chkExecuted(au.orders.filter(x => !x.status || x.status == 'completed'))
		autoAsk(au.orders.filter(x => x.status == 'done')) // && !x.manual))
		// bidPrice()
	}

	const setAuto = async ({id, manual}) => {
		await pb.update('upbit_orders', id, {manual: !manual})
	}

	const cancel = async (item) => {
		if (!confirm('CANCEL: '+ item.market)) return
		const body = {method: 'DELETE', body: {uuid: item.uuid}}
		await $fetch('/api/order', body)
		await pb.detach('upbit_orders', item.id)
	}

	const quick = async (item) => { // ask
		if (!confirm(JSON.stringify(item.body))) return
		const {id, body} = item
		const res = await $fetch('/api/order', {method: 'POST', body})
		id ? await pb.update('upbit_orders', id, {status: 'completed'})
			: await pb.create('upbit_orders', {uuid: res.uuid, market: body.market, side: 'bid'})
	}

	const allOut = async () => {
		if (!confirm('다 팔아?')) return
		const orders = au.orders.filter(x => x.status == 'done')
		for (let order of orders) askMarket(order)
	}

	const allIn = async () => {
		const side = 'bid'
		// const res = await $fetch('/api/order', {method: 'POST', body})
	}

	return {runAuto, setAuto, cancel, quick, allOut, allIn}
}
