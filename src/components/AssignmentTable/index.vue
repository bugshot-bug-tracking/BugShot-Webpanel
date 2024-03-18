<template>
	<section class="bs-container">
		<header class="bs-bb">
			<span>
				<b>
					<slot name="title"> {{ title }} </slot>
				</b>
			</span>

			<slot name="after-title"> </slot>
		</header>

		<div v-if="list === undefined" />

		<n-scrollbar v-else-if="list.length > 0" max-h-65vh>
			<n-list pr-4>
				<n-list-item
					v-for="item of list"
					:key="item.id"
					style="padding: 0; margin: 0.5rem 0"
					class="first-of-type:mt-0! last-of-type:mb-0!"
				>
					<slot name="item" v-bind="item" />
				</n-list-item>
			</n-list>
		</n-scrollbar>

		<div my-8 class="black-to-gray" v-else>
			<b>{{ $t("no_resources") }}</b>
		</div>

		<footer v-if="$slots['footer']">
			<slot name="footer"> </slot>
		</footer>
	</section>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { Company } from "~/models/Company";
import { Project } from "~/models/Project";
import { User } from "~/models/User";

// const props =
defineProps({
	title: {
		required: false,
		type: String,
		description: "Text shown in the title slot",
		default: "[PH] Title",
	},

	list: {
		required: false,
		type: Array as PropType<(Company | Project | User)[]>,
		description: "List of items to show",
		default: undefined,
	},
});
</script>

<style lang="scss" scoped>
section {
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
</style>
