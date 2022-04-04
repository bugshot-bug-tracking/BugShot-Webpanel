<template>
	<div class="wraper">
		<div class="sidebar">
			<h3>{{ $t("setting", 2) }}</h3>
			<span class="name">
				<div>{{ $t("hello") + "," }}</div>
				<div class="username">
					{{ user?.attributes?.first_name }}
				</div></span
			>
			<div class="links">
				<router-link
					:to="{
						name: 'UserSettings',
					}"
					class="item"
				>
					{{ $t("setting", 2) }}
				</router-link>
			</div>
		</div>

		<div class="log-out">
			<a class="btn bs be-red" @click="logout">
				<img
					src="../../../assets/extern/logout.svg"
					class="bs-to-red"
				/>
				{{ $t("log_out") }}
			</a>
		</div>
	</div>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import store from "../../../store";
import router from "../../../router";

const user = computed(() => {
	return store.getters.getUser;
});
const logout = () => {
	store.dispatch("logout");
	router.push({ name: "Login" });
};
</script>

<style lang="scss" scoped>
.sidebar {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;

	> h3:first-child {
		padding: 20px;
		text-align: left;
	}

	.name {
		padding: 10px;
		font-size: 20px;
		border-bottom: 1px solid #ede4fc;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin: 0 20px;
		margin-bottom: 10px;

		.username {
			font-weight: bold;
		}
	}

	.links {
		display: flex;
		border-bottom: 1px solid #ede4fc;
	}

	.item {
		width: 100%;
		font-weight: 700;
		margin: 2px 4px;
		padding: 10px 20px;
		text-align: left;
		font-size: 22px;

		&:hover {
			background-color: hsl(263, 79%, 94%);
			width: 100%;
			border-radius: 6px;
		}

		&.router-link-exact-active {
			border-radius: 6px;
			background: hsl(158, 79%, 87%);
		}
	}

	a {
		text-decoration: none;
		color: black;
	}
}

.log-out {
	height: 8vh;
	min-height: 60px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #ede4fc;
	padding: 10px 0;

	a {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	img {
		width: 24px;
		height: 24px;
		transform: rotateZ(90deg);
	}
}

.wraper {
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
	justify-content: space-between;
}
</style>
