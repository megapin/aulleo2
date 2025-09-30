<script setup>
const props = defineProps(['val'])
const au = useAuStore()

const stroke = 2, width = 56, height = 30

// const shape = computed(() => {
// 	const h = height - stroke * 2
// 	const data = au.sparklineData[props.val] || []
// 	const highestPoint = Math.max.apply(null, data) + 1
// 	const coordinates = []
// 	const totalPoints = data.length - 1
// 	data.forEach((item, n) => {
// 		const x = (n / totalPoints) * width + stroke
// 		const y = h - (item / highestPoint) * h + stroke
// 		coordinates.push({ x, y })
// 	})
// 	if (!coordinates[0]) return ("M 0 " + stroke + " L 0 " + stroke + " L " + width + " " + stroke)
// 	const path = []
// 	coordinates.forEach(point => path.push(["L", point.x, point.y].join(" ")))
// 	return ["M" + coordinates[0].x, coordinates[0].y, ...path].join(" ")
// })

const shape = computed(() => {
	const h = height - stroke * 2
	const data = au.sparklineData[props.val] || []
	const max = props.val.includes('marketAccTrade') ? data : [au.filteredWsData.length]
	const highestPoint = Math.max.apply(null, max) + 1
	const coordinates = []
	const totalPoints = data.length
	data.forEach((item, n) => {
		const x = (n / totalPoints) * width + stroke
		const y = h - (item / highestPoint) * h + stroke
		coordinates.push({ x, y })
	})
	if (!coordinates[0]) return ("M 0 " + stroke + " L 0 " + stroke + " L " + width + " " + stroke)
	const path = []
	coordinates.forEach(point => path.push(["L", point.x, point.y].join(" ")))
	return ["M" + coordinates[0].x, coordinates[0].y, ...path].join(" ")
})
const fillEndPath = computed(() => `V ${height} L 4 ${height} Z`)
</script>

<template>
	<ClientOnly>
  <svg class="sparkline" :width="width" :height="height" :stroke-width="stroke">
    <path class="sparkline--line" :d="shape" fill="none"></path>
    <path class="sparkline--fill" :d="[shape, fillEndPath].join(' ')" stroke="none"></path>
  </svg>
	</ClientOnly>
</template>

<style scoped>
.sparkline {
  stroke: #1f8ceb;
  fill: rgba(31, 140, 235, 0.06);
  transition: all 1s ease-in-out;
}
.sparkline path { box-sizing: border-box; }
</style>
