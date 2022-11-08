<template>
	<article class="bs-container">
		<header class="bs-bb">
			<span>
				<b>
					<slot name="title"> {{ title }} </slot>
				</b>
			</span>

			<slot name="after-title"> </slot>
		</header>

		<ul class="bs-scroll">
			<li class="bs-bb" v-for="item of list" :key="item.id">
				<slot name="item" v-bind="{ item: item }"> </slot>
			</li>
		</ul>

		<footer v-if="$slots['footer']">
			<slot name="footer"> </slot>
		</footer>
	</article>
</template>

<script setup lang="ts">
import { PropType } from "vue";

// const props =
defineProps({
	title: {
		required: true,
		type: String,
		description: "Text shown in the title slot",
		default: "[PH] Title",
	},

	list: {
		required: false,
		type: Array as PropType<
			{ type: string; id: string; attributes: { designation: string } }[]
		>,
		description: "List of items to show",
		default: [],
	},
});
</script>

<style lang="scss" scoped>
article {
	max-height: 100%;
}

header {
	padding-bottom: 1rem;
	display: flex;
	align-items: center;
}

footer {
	border-top: 1px solid #eee5fc;
	padding-top: 0.5rem;
}

ul {
	height: 100%;
}

li {
	padding-bottom: 1rem;
}
</style>
