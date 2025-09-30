export const useTicker = () => {
	const c = useRuntimeConfig()

	const intvId = ref()
	const mkts = ref()
	const error = ref()

	const getData = async () => {
		mkts.value = await $fetch(c.public.upbit+'/ticker/all', {query: {quote_currencies: 'KRW'}})
	}

	onMounted(() => {
		intvId.value = setInterval(() => getData(), 1000)
	})
	onUnmounted(() => {
		clearInterval(intvId.value)
	})

	return {mkts, error}
}
