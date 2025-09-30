<script setup>
const {watchedMarkets} = useMarketWatch()
// const showKeys = computed(() => {
// 	watchedMarkets.value
// 	return 
// })
</script>

<template>
	<div>
		<ListObjArr v-model="watchedMarkets" />
	</div>
</template>
