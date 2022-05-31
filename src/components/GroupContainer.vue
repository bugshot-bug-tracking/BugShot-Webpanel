<template>
	<div class="group-container">
		<div class="top">
			<div class="text-left">{{ mainText }}</div>
			<div class="text-right">{{ secondText }}</div>
		</div>

		<div class="items">
			<slot />
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	mainText: {
		required: true,
		type: String,
		default: "Group",
	},

	secondText: {
		type: String,
		default: "",
	},
});
</script>

<style lang="scss" scoped>
.group-container {
	display: flex;
	flex-direction: column;
	font-size: 18px;
	padding: 20px 40px;

	> .top {
		display: flex;
		justify-content: space-between;
		width: 350px;
		border-bottom: 1px solid hsl(264, 78%, 77%);
		padding: 0 10px 10px 10px;
		align-items: center;

		> .text-left {
			color: black;
			font-size: 20px;
			font-weight: 600;
			text-align: left;
		}

		> .text-right {
			color: hsl(265, 79%, 54%);
			min-width: 120px;
		}
	}

	> .items {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 10px;
	}
}
</style>
