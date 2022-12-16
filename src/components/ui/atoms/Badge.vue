<template>
	<div
		class="bs-badge"
		:style="{ color: config.color }"
		:class="{ empty: config.empty }"
		capitalize
	>
		<slot name="image" />

		<span v-if="text">
			{{ text }}
		</span>

		<span v-else>{{ noText ?? $t("nothing") }}</span>
	</div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import colors, { COLOR } from "~/util/colors";

const props = defineProps({
	text: {
		type: String,
		required: false,
		default: undefined,
	},

	noText: {
		type: String,
		required: false,
		default: undefined,
	},

	color: {
		type: String as PropType<COLOR>,
		required: false,
		validator: (value: string) => colors.includes(value),
		default: undefined,
	},

	empty: {
		type: Boolean,
		required: false,
		default: undefined,
	},

	preset: {
		type: String,
		required: false,
		validator: (value: string) => ["pf", "pe", "gf", "ge"].includes(value),
		default: undefined,
	},
});

const config = computed(() => {
	const conf = {
		color: COLOR.GRAY,
		empty: false,
	};

	if (props.text && props.preset !== undefined) {
		switch (props.preset[0]) {
			case "p":
				conf.color = COLOR.PURPLE;
				break;

			case "g":
				conf.color = COLOR.GREEN;
				break;
		}

		switch (props.preset[1]) {
			case "e":
				conf.empty = true;
				break;

			default:
			case "f":
				conf.empty = false;
				break;
		}
	}

	// prioritize atomic settings if they exist
	if (props.color !== undefined) conf.color = props.color;
	if (props.empty !== undefined) conf.empty = props.empty;

	return conf;
});
</script>
