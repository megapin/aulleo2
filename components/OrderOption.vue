<script setup>
const props = defineProps(['order'])
const trade = useTrade()
const au = useAuStore()
const pb = usePb()

const menu = ref()
const form = ref(props.order)

const onToggle = (e) => trade.setAuto(form.value)
const onSave = async () => {
	const {enough, go, stop} = form.value
	await pb.update('upbit_orders', form.value.id, {enough, go, stop})
}
const onMerge = async () => {
	const id = ''
	const f1 = au.account.find(x => x.currency == form.value.market.slice(4))
	const f2 = au.orders.find((x, i, arr) => x.market == form.value.market 
		&& Math.min(...arr.map(a => new Date(a.created).getTime()))
	)
	const fil = au.orders.filter(x => x.market == f2.market && x.id !== f2.id)
	await pb.update('upbit_orders', f2.id, {price: f1.avg_buy_price, volume: f1.balance})
	for await (let item of fil) pb.detach('upbit_orders', item.id)
}
</script>

<template>
	<div>
		<i @click="menu.toggle($event)" 
			:class="`pi pi-compass ml-1 cupo ${['text-purple-500','text-gray-700'][order.manual ? 1 : 0]}`" />

		<Menu ref="menu" :popup="true">
			<template #start>
				<div class="px-4 pt-2 w-56 text-sm">
					<div class="flex justify-between items-center pb-1 mb-2">
						auto/manual
						<ToggleSwitch v-model="form.manual" @input="onToggle" />
					</div>
					<div class="flex justify-between items-center pb-1">
						enough
						<!-- <InputNumber v-model="form.enough" fluid size="small" showButtons suffix="%"  -->
						<!-- 	:step="0.01" :maxFractionDigits="2" class="w-24 h-[1.8rem]" /> -->
						<div class="ml-auto">
							<span @click="" class="px-2 py-1 cupo">-</span>
							<input v-model="form.enough" class="w-10 px-1 focus:outline-none border-b-2 focus:border-gray-500" />
							<span @click="" class="pl-1 py-1 cupo">+</span>
						</div>
					</div>
					<div class="flex justify-between items-center pb-1">
						go
						<!-- <InputNumber v-model="form.go" fluid size="small" showButtons suffix="%"  -->
						<!-- 	:step="0.01" :maxFractionDigits="2" class="w-24 h-[1.8rem]" /> -->
						<div class="ml-auto">
							<span @click="" class="px-2 py-1 cupo">-</span>
							<input v-model="form.go" class="w-10 px-1 focus:outline-none border-b-2 focus:border-gray-500" />
							<span @click="" class="pl-1 py-1 cupo">+</span>
						</div>
					</div>
					<div class="flex justify-between items-center pb-1">
						stop
						<!-- <InputNumber v-model="form.stop" fluid size="small" showButtons suffix="%"  -->
						<!-- 	:step="0.01" :maxFractionDigits="2" class="w-24 h-[1.8rem]" /> -->
						<div class="ml-auto">
							<span @click="" class="px-2 py-1 cupo">-</span>
							<input v-model="form.stop" class="w-10 px-1 focus:outline-none border-b-2 focus:border-gray-500" />
							<span @click="" class="pl-1 py-1 cupo">+</span>
						</div>
					</div>
					<div class="flex mt-2">
						<Button @click="onMerge" size="small" severity="secondary" label="합치기" class="" />
						<Button @click="onSave" size="small" label="저장" class="ml-auto" />
					</div>
				</div>
			</template>
		</Menu>
	</div>
</template>
