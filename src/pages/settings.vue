<template>
	<div class="home-layout" :class="{ minimized: minimized }">
		<section class="sidebar">
			<TSidebar @minimize="toggle">
				<template #header>
					<h3>{{ $t("setting", 2) }}</h3>
				</template>

				<template #main class="bs-scroll s-purple">
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
					<a class="log-out bs-btn red empty" @click="logout">
						<img
							src="/src/assets/extern/logout.svg"
							class="black-to-red"
						/>
						{{ $t("log_out") }}
					</a>
				</template>
			</TSidebar>
		</section>

		<section class="page">
			<RouterView />
		</section>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "src/stores/auth";

const user = computed(() => useAuthStore().getUser);

const logout = () => {
	useAuthStore().logout();

	useRouter().push({ name: "login" });
};

const minimized = ref(false);
const toggle = (value: boolean) => {
	minimized.value = value;
};
</script>

<style lang="scss" scoped>
.home-layout {
	display: grid;
	grid-template-columns: 0.25fr 1.75fr;
	grid-template-rows: 1fr;
	gap: 0px 0px;
	grid-auto-flow: row;
	grid-template-areas: "sidebar page";
	width: 100%;
	height: 100vh;
	max-height: 100vh;
	overflow: hidden;

	&.minimized {
		grid-template-columns: auto 1.75fr;
	}
}

section.sidebar {
	grid-area: sidebar;

	h3 {
		padding: 20px;
		text-align: left;
	}
}

section.page {
	grid-area: page;
}

a {
	text-decoration: none;
	color: black;
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>

<style lang="scss" scoped>
.account {
	h4 {
		text-align: left;
		padding: 10px 20px;
		color: #9ba5d7;
		border-bottom: 1px solid #ede4fc;
		margin: 10px;
		font-size: 1.1rem;
		text-transform: uppercase;
	}

	ul {
		list-style-type: none;
		width: 100%;
		padding: 0 10px;
		text-align: left;
		display: flex;
		flex-direction: column;

		> li {
			padding: 4px 4px 8px 4px;
		}
	}
}

.name {
	padding: 10px;
	font-size: 20px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin: 0 20px;
	margin-bottom: 10px;

	.username {
		font-weight: bold;
	}
}

.item {
	font-weight: 700;
	padding: 10px 20px;
	text-align: left;
	font-size: 1.1rem;

	&:hover {
		background-color: hsl(263, 79%, 94%);
		width: 100%;
		border-radius: 6px;
	}

	&.router-link-active {
		border-radius: 6px;
		background: hsl(158, 79%, 87%);
	}
}

.log-out {
	display: flex;
	align-items: center;
	gap: 8px;

	img {
		width: 24px;
		height: 24px;
		transform: rotateZ(90deg);
	}
}
</style>
