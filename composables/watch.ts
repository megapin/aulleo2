export const useMarketWatch = () => {
	const au = useAuStore()
	const watchedMarkets = ref()

	watchEffect(() => {
		watchedMarkets.value = null
		const auWsData = toValue(au.wsData)
		watchedMarkets.value = auWsData.filter(x => x.signed_change_rate > 0)
	})

	return {watchedMarkets}
}
