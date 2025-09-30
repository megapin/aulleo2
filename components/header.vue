<script setup>
import {menubars} from '@/data/coin'
// import {format} from 'date-fns'
import {useTimestamp, useDateFormat, useNow} from '@vueuse/core'

const au = useAuStore()
const pb = usePb()
const c = useRuntimeConfig()

const formatter = ref('YYYY-MM-DD HH:mm:ss')
const lang = ref('ko-KR')
au.now = useDateFormat(useNow(), formatter, {locales: lang})

const res = await pb.getFirstListItem('upbit_my',null)
const keys = ['bidPrice','enough','low','go','stop','timeover']
const isMenu = ref(false)
const options = ref(res)
const profile = ref(true)
const x = ref(0)
const y = ref(0)

const onAvatar = (e, tf=true) => {
	profile.value = tf
	isMenu.value = !isMenu.value
	x.value = e.clientX
	y.value = e.clientY
}
const onUpdate = async () => await pb.update('upbit_my', options.value.id, options.value)

onMounted(() => {
	Object.keys(options.value).forEach(k => au[k] = options.value[k])
})
</script>

<template>
	<div class="flex items-center justify-center gap-4 p-2 bg-gray-100">
		<ClientOnly>
			<span @click="navigateTo('/floatmarkets')" class="w-[1.5rem] h-[1.5rem] rounded-full cupo" 
				:style="{background: `hsl(${15+au.now.slice(-2)}, 80%, 50%)`}"></span>
		</ClientOnly>
		<div class="flex gap-4">
			<NuxtLink v-for="item in menubars" :to="item.to">
				{{item.label}}
			</NuxtLink>
		</div>
		<div class="flex items-center gap-2">
			<!-- <TestAccount /> -->
			<ClientOnly>
				<span class="px-2"><code>{{au.now}}</code></span>
			</ClientOnly>
			<span @click="onAvatar" class="w-[1.5rem] h-[1.5rem] rounded-full bg-gray-300 cupo"></span>
			<span @click="onAvatar($event, false)" class="w-[1.5rem] h-[1.5rem] rounded-full bg-indigo-500 cupo"></span>
		</div>
	</div>

	<div v-if="isMenu" class="absolute p-2 rounded bg-white z-50" :style="{left: x+'px', top: y+10+'px'}">
		<div v-if="profile">
			<div v-for="k in keys" class="flex justify-between items-center p-1 w-[15rem]">
				{{k}} 
				<div class="w-[6.7rem]">
					<input type="number" v-model="options[k]" class="border-b w-[6rem] pl-1"
						:step="k == 'timeover' ? 1 : k == 'bidPrice' ? 10000 : 0.01" 
						:suffix="k == 'timeover' ? 'h' : k == 'bidPrice' ? '' : '%'" />
				</div>
			</div>
			<div><button @click="onUpdate" class="w-full p-1 bg-black rounded text-white">저장</button></div>
			<div class="mt-3 p-1 rounded text-sm bg-gray-100">
				<div class="flex border-b pb-1 mb-1">
					<div class="flex-1 text-center" v-for="h in ['Lv.','Go','Stop']">{{h}}</div>
				</div>
				<div class="flex font-mono" v-for="n in 9">
					<div class="flex-1 text-center">{{n}}</div>
					<div class="flex-1 text-center">{{(au.enough + au.go*(n-1)).toFixed(2)}}</div>
					<div class="flex-1 text-center">{{(au.enough + au.go*(n-1) - au.stop*(n > 1 ? n-1 : n)).toFixed(2)}}</div>
				</div>
			</div>
		</div>
		<div v-else class="w-[25rem]">
			<Todos />
		</div>
	</div>
</template>
