<script setup>
import PocketBase from 'pocketbase'
const pb = new PocketBase('http://localhost:8090')

const res = await pb.collection('todos').getFullList({sort: "-created"})
const todos = ref(res)
const todo = ref()
const mode = ref('create')
const selected = ref()

const onSave = () => mode.value == 'create' ? create() : onUpdate({...selected.value, name: todo.value})
const create = async () => {
	const res = await pb.collection('todos').create({name: todo.value})
	if (res.id) {
		todos.value.unshift(res)
		todo.value = ''
	}
}
const onUpdate = async (item) => {
	const res = await pb.collection('todos').update(item.id, item)
	const found = todos.value.find(x => x.id == item.id)
	for (let k in item) found[k] = item[k]
}
// const onCircle = (item) => {}
const onPencil = async (item) => {
	selected.value = item
	todo.value = item.name
	mode.value = mode.value == 'edit' ? 'create' : 'edit'
	if (mode.value == 'create') todo.value = ''
}
const onTrash = async (item) => {
	const res = await pb.collection('todos').delete(item.id)
	const idx = todos.value.findIndex(x => x.id == item.id)
	todos.value.splice(idx, 1)
}
</script>

<template>
	<div class="flex gap-1 mt-2">
		<input v-model="todo" type="search" class="p-2 border" />
		<button @click="onSave" class="w-[5rem] bg-gray-300">{{mode == 'create' ? 'C' : 'U'}}</button>
	</div>
	<ul class="p-2 mt-2">
		<li v-for="(item,i) in todos" class="flex items-center border-b">
			<div class="cupo mr-2 text-xl">
				<span v-if="!item.done" @click="onUpdate({...item, done:true})" class="">&#9744;</span>
				<span v-else @click="onUpdate({...item, done:false})" class="">&#9745;</span>
			</div>
			<span :class="`${item.done && 'line-through'} mr-1`">{{i+1}}. {{item.name}}</span>
			<div class="ml-auto text-xl">
				<span @click="onPencil(item)" :class="`cupo mr-2 ${mode == 'edit' && item.id == selected.id ? 'bg-blue-300' : ''} rounded-lg`">&#9998;</span>
				<span @click="onTrash(item)" class="cupo">&#10008;</span>
			</div>
		</li>
	</ul>
</template>
