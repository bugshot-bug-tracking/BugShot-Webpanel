<template>
	<Navbar />

	<div class="sidebar-container" :class="{ close: sidebarVisibility }">
		<div class="sidebar-wraper">
			<router-view name="sidebar" />
		</div>

		<div class="hide" @click="sidebarVisibility = !sidebarVisibility">
			<img src="@/assets/icons/caret-down-fill.svg" />
		</div>
	</div>

	<router-view />
</template>

<script>
// @ is an alias to /src
import Navbar from "./Navbar.vue";
import store from "../store";
import { ref } from "@vue/reactivity";

export default {
	name: "Home",
	components: { Navbar },
	setup() {
		store.dispatch("start");

		const sidebarVisibility = ref(false);

		return {
			sidebarVisibility,
		};
	},
};
</script>

<style lang="scss" scoped>
.sidebar-container {
	position: relative;
	border-right: 1px solid hsl(263, 79%, 94%);

	.sidebar-wraper {
		width: 12vw;
		min-width: 200px;
		max-width: 300px;
	}

	> .hide {
		position: absolute;
		right: -23px;
		top: 24px;
		background-color: #f8f8fc;
		width: 24px;
		height: 48px;
		border-radius: 0 10px 10px 0;
		border: 1px solid #ede4fc;
		border-left: 1px solid #f8f8fc;
		display: flex;

		> img {
			transform: rotateZ(90deg);
			width: 18px;
			filter: invert(26%) sepia(92%) saturate(4327%) hue-rotate(258deg)
				brightness(88%) contrast(104%);
		}
	}
	&.close {
		> .hide > img {
			transform: rotateZ(-90deg);
		}
		width: 10px;

		> .sidebar-wraper {
			display: none;
		}
	}
}
</style>
