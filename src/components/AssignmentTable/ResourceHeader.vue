<template>
	<div flex items-center gap-2 py-2>
		<div class="dot" :style="{ background: c_color }" />

		<slot name="text">
			<b> {{ name }} </b>
		</slot>

		<img
			v-if="owner"
			src="/src/assets/icons/my_projects.svg"
			alt="owner"
			w-6
			h-6
			:title="$t('owner')"
		/>

		<slot name="after-text"> </slot>
	</div>
</template>

<script setup lang="ts">
import colors from "~/util/colors";

const props = defineProps({
	name: {
		type: String,
		required: true,
	},

	owner: {
		type: Boolean,
		required: false,
		default: false,
		description: "Used to show the owner pin",
	},

	removable: {
		type: Boolean,
		required: false,
		default: true,
		description: "Flag for showing remove button",
	},

	current_user: {
		type: Boolean,
		required: false,
		default: false,
		description: "Flag for showing the proper remove message",
	},

	color: {
		tpe: String,
		required: false,
		default: undefined,
	},
});

const c_color = computed(
	() =>
		props.color ??
		colors[
			(props.name.charCodeAt(0) +
				props.name.charCodeAt(props.name.length / 2) +
				props.name.charCodeAt(props.name.length - 1)) %
				7
		]
);
</script>
