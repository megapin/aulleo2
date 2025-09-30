<script setup>
const au = useAuStore()
// au.account = await $fetch('/api/account')

au.myAsset = computed(() => {
	const filted = au.account?.filter(x=> au.wsData.find(w => w.market.includes('-'+x.currency)))
	return filted ? filted.map(x => {
		const market = x.currency == 'FIL' ? 'BTC-FIL' : 'KRW-'+x.currency
		const found = au.wsData.find(w => w.market == market)
		const trade_price = x.currency == 'FIL' ? found.trade_price * au.btcKrw : found.trade_price
		const step = getUnit(trade_price)
		return {...x, trade_price, step}
	}) : []
})
const total = computed(() => 
	au.myAsset.reduce((a,c) => a + (c.balance*c.trade_price), 0) 
	+ +au.account?.find(x => x.currency == 'KRW').balance
)
const visible = ref(false)

const onOrder = (item) => {
	au.market = item
	visible.value = true
}
</script>

<template>
	<div class="flex gap-1">
		<!--
		<SplitButton :label="(~~total).toLocaleString()" :model="au.myAsset" class="w-[50%] md:w-full" outlined fluid>
			<template #item="{item}">
				<div class="flex py-1 px-2 text-sm">
					<div class="w-100 flex flex-col">
						<Badge class="w-28 flex justify-between">
							<span class="w-16">{{item.currency}}</span>
							{{((item.trade_price-item.avg_buy_price)/item.avg_buy_price*100).toFixed(2)}}%
						</Badge>
						<div class="flex justify-between">
							<Button v-slot="slotProps" asChild size="small">
								<button @click="onOrder(item)" v-bind="slotProps.a11yAttrs" class="rounded bg-gradient-to-br from-primary-400 to-primary-700 
									active:from-primary-700 active:to-primary-900 text-white border-none 
									px-1 py-0 font-bold hover:ring-2 cursor-pointer ring-offset-2 ring-offset-surface-0 
									dark:ring-offset-surface-900 ring-primary transition-all">
									A/B
								</button>
							</Button>
							{{(+(item.balance*(item.trade_price - item.avg_buy_price)).toFixed()).toLocaleString()}}
						</div>
					</div>
					<div class="w-20 text-end">{{(~~item.balance).toLocaleString()}}</div>
					<div class="w-20 text-end">
						{{(~~item.avg_buy_price).toLocaleString()}}
						<hr class="ml-4">
						{{(~~item.trade_price).toLocaleString()}}</div>
					<div class="w-24 text-end">
						{{(+(item.balance*item.avg_buy_price).toFixed()).toLocaleString()}}
						<hr class="ml-4">
						{{(+(item.balance*item.trade_price).toFixed()).toLocaleString()}}
					</div>
				</div>
			</template>
		</SplitButton>
		<Button @click="onOrder(au.filteredWsData.find(x => x.market == 'KRW-BTC'))" class="w-[50%] ml-2" variant="outlined">주문</Button>
		-->
		<Button @click="onOrder(au.filteredWsData.find(x => x.market == 'KRW-BTC'))" class="w-full" variant="outlined">주문</Button>
	</div>

	<Dialog v-model:visible="visible" modal :header="au.selectedAsset?.currency || '주문'" :style="{ width: '28rem' }">
		<Order />
	</Dialog>
</template>
