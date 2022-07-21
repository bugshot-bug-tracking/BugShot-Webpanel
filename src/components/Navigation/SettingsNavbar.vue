<template>
	<TSidebar @minimize="toggle">
		<template #header>
			<header>
				<h3>{{ $t("my_account") }}</h3>

				<RouterLink
					:to="{ name: 'home' }"
					style="
						text-decoration: underline;
						color: #7a2ee6;
						font-size: 0.875rem;
					"
				>
					{{ $t("back_to_al_projects") }}
				</RouterLink>
			</header>
		</template>

		<template #main>
			<div class="user">
				<span class="name">
					<div>{{ $t("hello") + "," }}</div>
					<div class="username">
						{{ user?.attributes?.first_name }}
					</div></span
				>
			</div>
			<div class="account">
				<h4>
					{{ $t("setting", 2) }}
				</h4>
				<ul>
					<router-link
						:to="{
							name: 'settings',
						}"
						class="item"
					>
						{{ $t("account_settings") }}
					</router-link>
				</ul>
			</div>
		</template>

		<template #footer>
			<a class="log-out bs-btn purple empty" @click="logout">
				<img
					src="/src/assets/icons/logout.svg"
					class="black-to-purple"
				/>
				{{ $t("log_out") }}
			</a>
		</template>
	</TSidebar>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const router = useRouter();

const user = computed(() => useAuthStore().getUser);

const logout = () => {
	useAuthStore().logout();

	router.push({ name: "Login" });
};

const minimized = ref(false);
const toggle = (value: boolean) => {
	minimized.value = value;
};
</script>

<style lang="scss" scoped>
header {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	text-align: left;
	padding: 1rem;
}

.account {
	h4 {
		text-align: left;
		padding: 0.5rem 1.25rem;
		color: #9ba5d7;
		border-bottom: 1px solid #ede4fc;
		margin: 0.5rem;
		font-size: 1.1rem;
		text-transform: uppercase;
	}

	ul {
		list-style-type: none;
		width: 100%;
		padding: 0 0.5rem;
		text-align: left;
		display: flex;
		flex-direction: column;

		> li {
			padding: 0.25rem 0.25rem 0.5rem 0.25rem;
		}
	}
}

.name {
	padding: 0.5rem;
	font-size: 1.25rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin: 0 1.25rem;
	margin-bottom: 0.5rem;

	.username {
		font-weight: bold;
	}
}

.item {
	font-weight: 700;
	padding: 0.5rem 1.25rem;
	text-align: left;
	font-size: 1.1rem;

	&:hover {
		background-color: hsl(263, 79%, 94%);
		width: 100%;
		border-radius: 0.375rem;
	}

	&.router-link-active {
		border-radius: 0.375rem;
		background: hsl(158, 79%, 87%);
	}
}

.log-out {
	display: flex;
	align-items: center;
	gap: 0.5rem;

	img {
		width: 1.5rem;
		height: 1.5rem;
		transform: rotateZ(0deg);
	}
}
</style>
