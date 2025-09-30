<script setup>
// const c = useRuntimeConfig()
// const au = useAuStore()
</script>

<template>
	<div>
		<div class="flex gap-4 p-4">
			<ClientOnly>
				<!-- <div class="mt-4"> -->
				<!-- 	<SelectButton v-model="au.selectedMarket" :options="markets" aria-labelledby="basic" class="text-[12px] h-8 mb-2" /> -->
				<!-- 	<Overview /> -->
				<!-- </div> -->

				<div class="basis-3/5 h-[30rem] md:h-full overflow-auto md:columns-3 gap-4">
					<MotcrWc />
				</div>
				<!-- <div class="md:w-[25%] md:h-[73dvh]"> <Candle /> </div> -->
			</ClientOnly>

			<div class="basis-2/5">
				<MarketSummary />
				<Assets />
				<div class="flex p-4 w-[50%]">
					<Order3 />
				</div>
			</div>
			<!-- <div class="mt-4"> <Candle /> </div> -->
			<!-- <div class="h-[23rem]"> -->
			<!-- 	<TVChart :options="{allow_symbol_change: true, locale: 'ko', interval: 'D', autosize: true, symbol: 'COINBASE:FILUSD'}" /> -->
			<!-- </div> -->
		</div>
	</div>
</template>
