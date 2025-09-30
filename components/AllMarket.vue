<script setup>
import {fields, coins} from '@/data/coin'

const c = useRuntimeConfig()

const marketAll = '/market/all'
const {data: markets} = await useFetch(c.public.upbit+marketAll, {query: {is_details: 'true'}})

const columns = Object.keys(markets.value[0])
markets.value.sort((a, b) => a.market > b.market ? 1 : a.market < b.market ? -1 : 0)

const market = ref('KRW')
</script>

<template>
	<table>
		<thead>
			<tr>
				<th rowspan="4" v-for="item in ['#','market','korean_name','english_name','market_warning']" class="text-start text-xs border-b">
					{{item}}
				</th>
			</tr>
			<tr> <th colspan="6" v-for="item in ['market_event']" class="text-start text-xs border-b">{{item}}</th> </tr>
			<tr> 
				<th rowspan="2" v-for="item in ['warning']" class="text-start text-xs border-b">{{item}}</th> 
				<th colspan="5" v-for="item in ['caution']" class="text-start text-xs border-b">{{item}}</th> 
			</tr>
			<tr>
				<th class="text-start text-xs border-b" v-for="item in ['PRICE_FLUCTUATIONS', 'TRADING_VOLUME_SOARING', 'DEPOSIT_AMOUNT_SOARING', 'GLOBAL_PRICE_DIFFERENCES', 'CONCENTRATION_OF_SMALL_ACCOUNTS']">{{item}}</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item,i) in markets.filter(x => x.market.startsWith(market))" class="text-xs">
				<td>{{i+1}}</td>
				<template v-for="c in columns">
					<td v-if="typeof item[c] !== 'object'">{{item[c]}}</td>
					<template v-else>
						<template v-for="(v,k) in item[c]">
							<td v-if="typeof v == 'object'" v-for="(va,ke) in v" :class="va && 'text-red-600 font-bold'">{{va}}</td>
							<td v-else>{{v}}</td>
						</template>
					</template>
				</template>
			</tr>
		</tbody>
	</table>
</template>
