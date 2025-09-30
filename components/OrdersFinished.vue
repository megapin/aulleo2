<script setup>
import { FilterMatchMode } from '@primevue/core/api';
const au = useAuStore()

const selects = [
	{name: '모두', val: 0},
	{name: '수익', val: 1},
	{name: '손절', val: -1},
]
const orders = computed(() => {
	au.orders?.forEach(x => {
		x.earn = ~~((x.askPrice - x.price) * x.volume)
		x.earnRate = ((x.askPrice - x.price) / x.askPrice * 100).toFixed(2)
	})
	return au.orders?.filter(x => earn.value ? x.askPrice && (x.askPrice - x.price) * earn.value > 0 : x.askPrice)
})
const visible = ref(false)
const earn = ref(0)
const menu = ref()
const month = ref()
const filters = ref({
	'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
})
</script>

<template>
	<div class="text-sm w-[96dvw] md:w-[100%]">
		<div class="flex items-center pb-1">
			<span class="font-medium">Orders finished</span>
			<div class="ml-auto inline-flex font-bold items-center">
				<span @click="earn = item.val" v-for="item in selects" :class="`${earn == item.val && 'bg-emphasis'} cursor-pointer hover:bg-emphasis rounded px-2 py-1`">
					{{item.name}} <span class="font-normal text-xs">{{au.orders.filter(x => item.val ? x.askPrice && (x.askPrice-x.price)*item.val > 0 : x.askPrice).length}}</span>
				</span>
				<span @click="menu.toggle($event)" class="cursor-pointer hover:bg-emphasis rounded px-2 py-1">다른 달</span>
			</div>
			<Menu ref="menu" :popup="true">
				<template #start>
					<DatePicker v-model="month" view="month" dateFormat="mm/yy" inline class="w-[15rem]" />
				</template>
			</Menu>
		</div>

		<DataTable v-model:filters="filters" :value="orders" size="small" removableSort scrollable scrollHeight="25rem" tableStyle="min-width:25rem">
			<template #header>
				<div class="flex justify-end">
					<IconField>
						<InputIcon>
							<i class="pi pi-search" />
						</InputIcon>
						<InputText v-model="filters['global'].value" placeholder="검색" size="small" class="w-[13rem]" />
					</IconField>
				</div>
			</template>
			<Column field="updated" header="날" sortable style="text-align:start">
				<template #body="{data}">{{data.updated.slice(5,16)}}</template>
			</Column>
			<Column field="market" header="종목" sortable style="text-align:start">
				<template #body="{data}">{{data.market.replace(/(KRW|BTC)-/,'')}}</template>
			</Column>
			<Column field="volume" header="Qty" sortable style="text-align:end">
				<template #body="{data}">{{data.price < 99 ? (data.volume/1e3).toFixed() : data.price < 999 ? ~~data.volume : data.volume.toFixed(2)}}</template>
				<!-- <template #body="{data}">{{shortNo(data.volume)}}</template> -->
			</Column>
			<Column field="price" header="평단" sortable style="text-align:end">
				<template #body="{data}">{{shortNo(data.price)}}</template>
			</Column>
			<Column field="askPrice" header="매도" sortable style="text-align:end">
				<template #body="{data}">{{shortNo(data.askPrice)}}</template>
			</Column>
			<Column field="earn" header="&#8361;" sortable style="text-align:end">
				<template #body="{data}">
					<div :class="textColor(data.askPrice > data.price)">{{data.earn}}</div>
				</template>
			</Column>
			<Column field="earnRate" header="%" sortable style="text-align:end">
				<template #body="{data}">
					<div :class="textColor(data.askPrice > data.price)">{{data.earnRate}}</div>
				</template>
			</Column>
		</DataTable>
	</div>
</template>
