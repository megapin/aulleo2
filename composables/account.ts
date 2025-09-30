export const useAccount = () => {
	// const {mkts} = useTicker()
	
	const account = ref()

	const getAccount = async () => {
		account.value =  await $fetch('/api/account')
		// const res = await $fetch('/api/account')
		// account.value = res.map(x => {
		// 	// const avail = mkts.value?.find(m => m.market.slice(4) == x.currency) ? true : false
		// 	return {...x, avail}
		// })
	}

	onMounted(() => { getAccount() })
	onUnmounted(() => {})

	return {account}
}
