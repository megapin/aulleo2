<script setup>
const c = useRuntimeConfig()
const au = useAuStore()

au.wsData = await $fetch(c.public.upbit +"/ticker/all", {query: {quote_currencies: 'KRW'}})
</script>

<template>
	<div class="mx-auto p-4 md:px-[80px] bg-gray-100">
		<ClientOnly>
			<div class="flex flex-col md:grid md:grid-cols-4 gap-2 h-[95vh]">
				<article class="md:row-span-3">
					<MarketSummary />
					<Motcr />
				</article>
				<article class="md:row-span-3">
					<apexCharts />
				</article>
				<article>
					<Order2 />
				</article>
				<article>
					<Notis />
				</article>
				<article class="overflow-auto"> 
					<Assets />
				</article>
				<article class="">
					<!-- <Orders />   -->
					<AdjustAvg />
				</article>
				<article>
					<WatchMarkets />
				</article>
			</div>
		</ClientOnly>
	</div>

	<!-- <Account /> -->
	<!-- <Overview /> -->
	<!-- <Charts /> -->
	<!-- <TVChart :options="{allow_symbol_change:true, locale:'ko', interval:'D', autosize:true, symbol:'COINBASE:FILUSD'}" /> -->
	<!-- <Picks /> -->
	<!-- <Transactions /> -->
	<!-- old: Simulator -->
</template>

<style scoped>
article { 
	padding: 1rem;
	border: 1px slategray solid; 
	/* border-radius: 4px; */
}
</style>
