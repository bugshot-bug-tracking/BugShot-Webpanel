<!-- Update in time to support different modes of use and use images (if possible scale to width and height 1:1) -->

<template>
	<div class="avatar">
		<div class="wrapper" :style="{ background: background_color }">
			<div class="initials" v-if="!image">
				{{ first_name[0] + last_name[0] }}
			</div>
			<div class="image" v-else></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import colors from "~/util/colors";

const props = defineProps({
	first_name: {
		required: true,
		type: String,
	},

	last_name: {
		required: true,
		type: String,
	},

	image: {
		required: false,
		type: String,
		default: null,
	},

	mode: {
		required: false,
		type: String,
		validator: (value: string) =>
			["normal", "switch", "online"].includes(value),
		default: "normal",
	},

	mode_options: {
		required: false,
		type: Object,
		default: {},
	},
});

const background_color = computed(() => {
	return colors[
		(props.first_name.toUpperCase().charCodeAt(0) +
			props.last_name.toUpperCase().charCodeAt(0)) %
			7
	];
});
</script>

<style lang="scss" scoped>
.avatar {
	display: flex;
	align-items: center;
	justify-content: center;

	.wrapper {
		border-radius: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}

.initials {
	text-transform: uppercase;
	color: white;
	padding: 0.5rem;
}

.creator {
	color: hsl(0, 0%, 100%);
	background-color: hsl(265, 80%, 50%);
	font-size: 12px;
	padding: 8px;
	border-radius: 25px;
	height: 35px;
	width: 35px;
	position: relative;

	.avatar {
		text-align: center;
		text-transform: uppercase;
	}
}
</style>
