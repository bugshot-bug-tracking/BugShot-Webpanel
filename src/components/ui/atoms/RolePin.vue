<template>
	<div
		class="user-role"
		:style="{ color: config.color }"
		:class="{ empty: config.empty }"
		capitalize
	>
		<span>{{ text }}</span>
	</div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import colors, { COLOR } from "~/util/colors";

const props = defineProps({
	text: {
		type: String,
		required: true,
		default: "[PH] Role",
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
		validator: (value: string) => ["owner", "team"].includes(value),
		default: undefined,
	},
});

const config = computed(() => {
	const conf = {
		color: COLOR.PURPLE,
		empty: true,
	};

	if (props.preset !== undefined) {
		switch (props.preset) {
			case "owner":
				conf.color = COLOR.GREEN;
				conf.empty = false;

			case "team":
			default:
				break;
		}
	}

	// prioritize atomic settings if they exist
	if (props.color !== undefined) conf.color = props.color;
	if (props.empty !== undefined) conf.empty = props.empty;

	return conf;
});
</script>

<style scoped lang="scss">
.user-role {
	border-radius: 0.5rem;
	padding: 0.25rem 0.5rem;
	font-size: 0.875rem;
	text-align: center;
	user-select: none;
	border: 2px solid currentColor;
	background-color: currentColor;

	span {
		color: #ffffff;
	}

	&.empty {
		background-color: #ffffff;
		font-weight: bold;

		span {
			color: currentColor;
		}
	}
}
</style>
