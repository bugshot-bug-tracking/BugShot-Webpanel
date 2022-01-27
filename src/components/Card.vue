<template>
	<div class="wrapper">
		<router-link
			:to="routeTo"
			class="top"
			:style="{
				'background-color': color,
			}"
		>
			<img v-if="image" :src="image.attributes.base64" alt="IMG" />
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
import { computed } from "@vue/reactivity";
export default {
	name: "Card",
	props: {
		title: {
			required: true,
			type: String,
			default: "Title",
		},

		image: {
			type: Object,
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
	setup(props) {
		const imageURL = computed(() => {
			if (props.image == null) return;
			// console.log(props.image);
			let l = URL.createObjectURL(
				new Blob([props.image.attributes.base64])
			);
			// console.log(l);
			return props.image.attributes.base64;
		});

		return {
			imageURL,
		};
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
		overflow: hidden;

		> img {
			min-width: 100%;
			min-height: 100%;
		}

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
			width: 99%;
			// width: 89%;
			// border-right: 1px solid hsl(263, 79%, 94%); no settings on card for now
			padding: 10px 10px;
			font-weight: bold;
		}

		> .right {
			display: none;
			// display: flex; no settings on card for now
			height: 100%;
			img {
				width: 50px;
			}
		}
	}
}
</style>
