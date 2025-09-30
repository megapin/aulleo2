<script setup>
const objArr = defineModel()

// const headers = Object.keys(objArr.value[0])
const headers = ref(Object.keys(objArr.value[0]).map(x => ({name: x, selected: true})))
const selectedHeaders = computed(() => headers.value.filter(x => x.selected))

const onSelect = e => {
	console.log(e)
	// selects.value.push(e.target.value)
	const idx = headers.value.findIndex(x => x.name == e.target.value)
	headers.value[idx].selected = !headers.value[idx].selected
}
</script>

<template>
	<div>
		<select @input="onSelect" class="p-1">
			<option value="">--Select headers--</option>
			<option v-for="item in headers" :value="item.name">{{item.selected ? '*' : ''}} {{item.name}}</option>
		</select>
	</div>

	<div class="w-full h-[23rem] text-sm overflow-auto">
		<table class="w-full">
			<thead>
				<tr class="border-b-2">
					<th v-for="(item, i) in selectedHeaders" :class="i ? 'text-end' : 'text-start'">
						{{item.name.slice(0,7)}}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in objArr" class="border-b">
					<td v-for="(h, i) in selectedHeaders" :class="!i ? 'text-start' : 'text-end'">
						{{typeof item[h.name] === 'number' ? shortNo(item[h.name]) : item[h.name]}}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
