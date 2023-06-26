<template>
	<nav>
		<div class="top">
			<RouterLink :to="{ name: 'home' }" class="home-logo sh-home-logo">
				<img src="/src/assets/icons/bugshot.svg" alt="Home" />
			</RouterLink>

			<Notifications />
		</div>

		<div class="bottom">
			<UserMenu />

			<I18nSwitcher />

			<n-button
				text
				type="success"
				tag="a"
				:href="targetURL"
				target="_blank"
				style="font-size: 0.875rem"
				title="BugShot version"
			>
				v{{ version }}
			</n-button>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { version } from "~/../package.json";
import { useI18nStore } from "~/stores/i18n";

const targetURL = computed(() => {
	let locale = useI18nStore().getCurrentLocale;

	switch (locale) {
		default:
		case "en":
			return "https://www.bugshot.de/home-en";
		case "de":
			return "https://www.bugshot.de/home";
	}
});
</script>

<style lang="scss" scoped>
nav {
	background: #1a2040;
	width: 5.5rem;
	min-width: 5.5rem;
	height: 100vh;
	user-select: none;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-content: center;
}

.top {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 2.5rem;
	gap: 3rem;

	.home-logo {
		img {
			width: 2.5rem;
			height: 2.5rem;
		}
	}
}

.bottom {
	display: flex;
	flex-direction: column;
	margin-bottom: 1rem;
	align-items: center;
	gap: 1rem;
}
</style>
