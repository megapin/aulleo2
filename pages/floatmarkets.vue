<script setup lang="ts">
import {useWindowSize, useDraggable} from '@vueuse/core'

definePageMeta({layout: false})
const au = useAuStore()
const c = useRuntimeConfig()
// const {x, y} = useMouse()
// const {mkts} = useTicker()
// const {account} = useAccount()

au.account = await $fetch('/api/account')
const res = await $fetch(c.public.upbit+'/ticker/all', {query: {quote_currencies: 'KRW'}})

const {width, height} = useWindowSize()
const el = ref<HTMLElement | null>(null)
const {x, y, style} = useDraggable(el, {initialValue: {x:180, y:30}})
const maxRadius = 30
const mouse = { x: undefined, y: undefined }
const intvId = ref()
const rafId = ref()
const mkts = ref(res)
const markets = ref([])
const canvas = ref()
const ctx = ref()
const sum = computed(() => ({
	tot: mkts.value.reduce((a, b) => a + b.signed_change_rate*100, 0),
	up:  mkts.value.filter(x => x.signed_change_rate > 0),
	down: mkts.value.filter(x => x.signed_change_rate < 0)
}))
const search = ref()
const cog = reactive({scr: [-100, 100]})
const flt = ref()
const accAvail = computed(() => venn('mkt', markets.value, au.account.map(x => ({mkt: 'KRW-'+x.currency}))))
const isAccount = ref(false)

const onAccount = () => {
	// canvas.value.height /= 2
	// init()
	isAccount.value = !isAccount.value
	flt.value = ''
}

const getData = async () => {
	mkts.value = await $fetch(c.public.upbit+'/ticker/all', {query: {quote_currencies: 'KRW'}})
	au.wsData = mkts.value
}

// https://codepen.io/AjayBear/pen/bRoJjx
function Market(item) {
	this.x = item.x
	this.y = item.y
	this.dx = item.dx
	this.dy = item.dy
	this.radius = item.radius
	this.minRadius = item.radius
	this.mkt = item.market
	this.scr = item.signed_change_rate
	this.price = item.trade_price

	this.draw = function () {
		this.fnd = mkts.value?.find(x => x.market == this.mkt)
		this.scr = (this.fnd.signed_change_rate*100).toFixed(2)
		this.txtColor = {RISE:'red', FALL:'blue', EVEN:'gray'}[this.fnd.change]
		this.mktFontSize = canvas.value.width > 412 
			? Math.max(this.fnd.change_rate*1e3, 16)
			: Math.max(this.fnd.change_rate*400, 8)
		this.scrFontSize = Math.max(this.mktFontSize*0.5, 16) 
		this.scrFont = this.scrFontSize +'px arial'
		this.mktFont = this.mktFontSize +'px arial'

		// item.width = ctx.value.measureText(this.text).width
		// signed_change_rate
		ctx.value.textAlign = "start"
		ctx.value.fillStyle = this.txtColor
		ctx.value.font = this.scrFont
		// ctx.value.fillText(this.scr +' ₩'+ this.price, this.x, this.y)
		ctx.value.fillText(this.scr+'%', this.x, this.y)
		// market
		ctx.value.fillStyle = this.txtColor
		ctx.value.font = this.mktFont
		ctx.value.fillText(this.mkt.slice(4), this.x, this.y - Math.max(this.mktFontSize*0.5, 16))
		// trade_price
		// ctx.value.font = this.scrFont
		// ctx.value.fillText('₩'+this.price, this.x, this.y - Math.max(this.mktFontSize*1.27, 35))
	}

	this.update = function () {
		if (this.x + this.radius > innerWidth || this.x - this.radius < 0) { this.dx = -this.dx }
		if (this.y + this.radius > innerHeight || this.y - this.radius < 0) { this.dy = -this.dy }
		this.x += this.dx
		this.y += this.dy
		//interactivity
		if (mouse.x-this.x < 50 && mouse.x-this.x > -50 && mouse.y-this.y < 50 && mouse.y-this.y > -50) {
			if (this.radius < maxRadius) { 
				this.radius += 1 
				console.log(this.mkt)
				// cancelAnimationFrame(rafId.value)
				ctx.value.fillStyle = this.txtColor
				ctx.value.font = this.scrFont
				ctx.value.fillText('₩'+this.price, this.x, this.y - Math.max(this.mktFontSize*1.27, 35))
			}
		} else if (this.radius > this.minRadius) { 
			this.radius -= 1 
		}
		this.draw()
	}
}

function init() {
	const radius = Math.random() * 6 + 1
	markets.value = mkts.value.map(mkt => new Market({...mkt,
		// x: Math.random() * (innerWidth - radius * 2) + radius,
		// y: Math.random() * (innerHeight - radius * 2) + radius,
		x: Math.random() * (canvas.value.width - radius * 2) + radius,
		y: Math.random() * (canvas.value.height - radius * 2) + radius,
		dx: Math.random() - 0.5,
		dy: Math.random() - 0.5,
		radius
	}))
}
function animate() {
	rafId.value = requestAnimationFrame(animate)
	ctx.value.clearRect(0, 0, innerWidth, innerHeight)
	const fltedMarkets = flt.value == 'accnt' 
		? accAvail.value
		: markets.value
			.filter(x => x.scr >= +cog.scr[0] && x.scr <= +cog.scr[1])
			.filter(x => search.value ? x.mkt.includes(search.value.toUpperCase()) : x)
			.filter(x => flt.value ? x.scr*(flt.value == 'up' ? 1 : -1) > 0 : x)
	for (let market of fltedMarkets) market.update()
}

onMounted(() => {
	canvas.value.height = window.innerHeight
	canvas.value.width = window.innerWidth
	ctx.value = canvas.value.getContext('2d')

	window.addEventListener('mousemove', function (event) {
		mouse.x = event.x
		mouse.y = event.y
	})
	window.addEventListener('resize', function () {
		canvas.value.width = window.innerWidth
		canvas.value.height = window.innerHeight
		init()
	})

	init()
	rafId.value = requestAnimationFrame(animate)
	intvId.value = setInterval(() => getData(), 1000)
})
onUnmounted(() => {
	clearInterval(intvId.value)
	cancelAnimationFrame(rafId.value)
})
</script>

<template>
	<div class="">
	<ClientOnly>
		<div class="fixed text-white p-2 w-52">
			<div class="flex">
				<span @click="navigateTo('/')" class="mr-2 cupo">🏠</span> Sum: 
				<span class="ml-auto flex gap-2">
					<b :class="sum.tot > 0 ? 'text-red-600' : 'text-blue-600'">{{sum.tot.toFixed(2)}}</b>
					<span @mouseover="flt = 'up'" @mouseout="flt = ''" class="text-red-600">{{sum.up.length}}</span>
					<span @mouseover="flt = 'down'" @mouseout="flt = ''" class="text-blue-600">{{sum.down.length}}</span>
				</span>
			</div>
			<div class="flex">
				Account: <button @click="onAccount" @mouseover="flt = 'accnt'" @mouseout="flt = ''" class="ml-auto px-2 rounded bg-gray-500">{{accAvail.length}}</button>
			</div>
			<div><input v-model="search" type="search" placeholder="검색" class="w-full mt-2 px-1 border-b bg-transparent" /></div>
			<div class="mt-2">
				<div class="flex">
					등락률: 
					<span class="ml-auto">
						{{cog.scr[0]}} ~ {{cog.scr[1]}}% <span @click="cog.scr = [-100, 100]" class="cupo">↺</span>
					</span>
				</div>
				<div class="flex">
					최소: <input v-model="cog.scr[0]" type="range" min="-100" max="0" class="ml-auto w-[75%]" />
				</div>
				<div class="flex">
					최대: <input v-model="cog.scr[1]" type="range" min="0" max="100" class="ml-auto w-[75%]" />
				</div>
			</div>
		</div>
		<div v-if="isAccount" ref="el" :style="width > 412 && style" class="absolute w-full md:w-[21%] p-4 backdrop-blur-sm bg-gray-500/40 text-white">
			<div class="text-end"> <span @click="isAccount = false" class="cupo">X</span> </div>
			<Assets />
		</div>
	</ClientOnly>

	<canvas ref="canvas" class="bg-[#000]"></canvas>
	</div>
</template>
