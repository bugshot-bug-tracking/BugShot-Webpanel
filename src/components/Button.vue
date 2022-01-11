<template>
	<div>{{ text }}</div>
</template>

<script>
export default {
	name: "CustomButton",

	props: {
		fill: {
			type: Boolean,
			default: true,
		},
		text: {
			type: String,
			default: "Button",
		},
	},

	setup() {},
};
</script>

<style lang="scss" scoped></style>
