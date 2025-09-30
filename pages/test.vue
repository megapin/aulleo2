<script setup>
const comp = ref('fc16')
const materials = [
	{
		aText: 'FrontCodes', href: "https://front.codes",
		items: [
			{btnText: 'Log In / Sign Up - pure css - #12', comp: 'fc12'},
			{btnText: 'Pricing - pure css - #16', comp: 'fc16'},
		]
	},
	{
		aText: 'Codepen.io', href: "https://codepen.io/Mamboleoo/pen/obWGYr",
		items: [
			{btnText: 'Text to particles', comp: 'cp1'},
		]
	},
	{
		aText: 'StackOverflow', href: "https://stackoverflow.com/questions/43545815/html5-canvas-smooth-text-movement-animation-impossible",
		items: [
			{btnText: 'marketAni3', comp: 'so1'},
		]
	},
]
const open = ref(false)
const tog = e => open.value = !open.value
</script>

<template>
	<header class="p-2">
		<h1>Animations</h1>
	</header>

	<section class="flex">
		<div class="base-1/6 flex flex-col gap-2 p-2">
			<template v-for="item in materials">
				<a :href="item.href">{{item.aText}}</a>
				<div>
					<button v-for="itm in item.items" @click="comp = itm.comp" class="block py-1 px-2">
						* {{itm.btnText}}
					</button>
				</div>
			</template>
		</div>

		<div class="flex-1">
			<TestFCLoginSignup v-if="comp == 'fc12'" />
			<TestFCPricing v-if="comp == 'fc16'" />
			<TestCodepen17 v-if="comp == 'cp1'" />
			<TestStackOverflow18 v-if="comp == 'so1'" />
		</div>
	</section>
</template>
