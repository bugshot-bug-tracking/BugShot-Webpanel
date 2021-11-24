<template>
	<div class="wrapper">
		<router-link
			:to="routeTo"
			class="top"
			:style="{ 'background-color': color }"
		>
			<div class="text">{{ title }}</div>
		</router-link>

		<div class="bottom">
			<div class="left">
				<div class="text-left">{{ mainText }}</div>
				<div class="text-right">{{ secondText }}</div>
			</div>

			<div class="right">
				<img class="btn" src="@/assets/icons/settings_dots.svg" />
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Card",
	props: {
		title: {
			required: true,
			type: String,
			default: "Title",
		},

		image: {
			type: String,
			default: "///Image",
		},

		color: {
			type: String,
			default: "#7A2EE6",
		},

		mainText: {
			required: true,
			type: String,
			default: "Group",
		},

		secondText: {
			type: String,
			default: "Group",
		},

		routeTo: {
			required: true,
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	display: flex;
	flex-direction: column;
	margin: 10px;
	width: 320px;
	height: 200px;
	border-radius: 12px;
	box-shadow: 0px 2px 4px hsla(0, 0%, 0%, 0.161);

	> .top {
		border-radius: 12px 12px 0 0;
		height: 145px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;

		> .text {
			position: absolute;
			font-size: 20px;
			font-weight: bold;
			color: hsl(0, 0%, 100%);
		}
	}

	> .bottom {
		display: flex;
		position: relative;
		height: 55px;
		align-items: center;

		> .left {
			display: flex;
			justify-content: space-between;
			width: 89%;
			border-right: 1px solid hsl(263, 79%, 94%);
			padding: 10px 10px;
			font-weight: bold;
		}

		> .right {
			display: flex;
			height: 100%;
			img {
				width: 50px;
			}
		}
	}
}
</style>
