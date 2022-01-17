<template>
	<div class="sidebar">
		<h3>Settings</h3>

		<span class="name">
			<div>Hello,</div>
			<div class="username">{{ user?.attributes?.first_name }}</div></span
		>
		<div class="links">
			<router-link
				:to="{
					name: 'UserSettings',
				}"
				class="item"
			>
				Settings
			</router-link>
		</div>
	</div>
</template>

<script>
import { computed } from "@vue/reactivity";
import store from "../../../store";
export default {
	name: "UserSettingsSidebar",
	setup(props) {
		const user = computed(() => {
			return store.getters.getUser;
		});

		return {
			user,
		};
	},
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
</style>
