<script setup>
const au = useAuStore()

// const amount = ref(1e5)
// const price = ref()

// const adjust = computed(() => {
// 	const {balance, avg_buy_price} = au.market
// 	return (+balance*avg_buy_price + amount.value) / (+balance + amount.value / price.value)
// })

const fnd = computed(() => au.wsData.find(x => x.market == au.market.market))
const krw = computed(() => {
	const krw = au.account?.find(x => x.currency == 'KRW') || {}
	return {
		total: +krw.balance + +krw.locked,
		balance:+krw.balance,
		locked: +krw.locked
	}
})
const amnts = computed(() => Array(~~(krw.value?.balance/1e5)).fill(1e5).map((x, i) => x*(i+1)))
const prcs = computed(() => Array(21).fill(fnd.value?.trade_price).map((x, i) => x + x*0.01*(i-10)))
</script>

<template>
	<div class="">
		<div>
			<div>
				<!-- <span class="bg-gray-500 text-white px-1 mr-2 rounded">{{krw.total.toFixed()}}</span> -->
				<b>{{au.market.market.slice(4)}}</b>
				<span :class="`${fnd.signed_change_rate > 0 ? 'bg-red-600' : 'bg-blue-600'} text-white rounded pl-1 mx-1`">
					{{(fnd.signed_change_rate*100).toFixed(2)}}%
				</span>
				{{au.market.balance}} ea | {{au.market.avg_buy_price}} avg 
				<!-- | {{au.market.trade_price}} cur -->
			</div>
		</div>
			<!-- <InputNumber v-model="price" mode="currency" currency="KRW" size="small" class="mb-2" /> -->
			<!-- <div class="flex flex-col items-center"> -->
			<!-- 	<div class="">Adjusted: {{adjust.toFixed(2)}}</div> -->
			<!-- 	<div class="">Change: {{((au.market.trade_price-adjust)/adjust*100).toFixed(2)}}%</div> -->
			<!-- 	<div>Total: {{amount}}</div> -->
			<!-- </div> -->
			<!-- <Slider v-model="amount" :min="1e4" :max="krwBalance" :step="1e4" class="mx-2 mt-4" /> -->

		<table class="w-full font-mono mt-2">
			<thead>
				<tr>
					<td class="text-center bg-gray-500 text-white rounded">{{krw.total.toFixed()}}원</td>
					<td v-for="amnt in amnts" class="px-2 text-end">
						{{amnt}}
					</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(prc, i) in prcs" :class="!(i-10) && 'bg-purple-300'">
					<td class="px-2 flex items-end gap-1">
						{{shortNo(prc)}} <span class="ml-auto text-sm">{{(i-10)}}%</span>
					</td>
					<td v-for="amnt in amnts" class="px-2 text-end">
						<div class="">
							{{shortNo((au.market.balance*au.market.avg_buy_price+amnt)/(amnt/prc+ +au.market.balance))}}
							<!-- {{((au.market.balance*au.market.avg_buy_price+amnt)/(amnt/prc+ +au.market.balance)).toFixed(2)}} -->
						</div>
						<!-- {{(amnt/prc).toFixed(2)}} -->
						<!-- <div>{{au.market.balance}}</div> -->
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	<!-- <div class="px-4 pt-4 pb-2 flex justify-between"> -->
	<!-- 	<Button @click="menu2.toggle($event)" severity="secondary" label="취소" size="small" /> -->
	<!-- 	<Button @click="isQuick ? onConfirm() : onWithdraw()" label="확인" size="small" :disabled="isQuick ? false : amount < 10000" /> -->
	<!-- </div> -->

	<!-- <Dialog v-model:visible="isVisible" pt:root:class="!border-0 !bg-transparent w-[50rem]" pt:mask:class="backdrop-blur-sm"> -->
	<!-- 	<template #container="{ closeCallback }"> -->
	<!-- 		<div class="h-[33rem]"> -->
	<!-- 			<TVChart :options="{allow_symbol_change: true, locale: 'ko', interval: 'D', autosize: true,  -->
	<!-- 				symbol: `COINBASE:${au.market.currency}USD`}" /> -->
	<!-- 		</div> -->
	<!-- 	</template> -->
	<!-- </Dialog> -->
</template>
