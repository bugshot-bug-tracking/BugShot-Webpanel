<template>
	<nav class="normal">
		<RouterLink :to="{ name: 'home' }" class="home-logo" my-6>
			<img src="/src/assets/icons/bugshot.svg" alt="Home" w-10 h-10 />
		</RouterLink>

		<Notifications my-2 />

		<div flex-1 />

		<UserMenu my-2 />

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
	</nav>

	<nav class="mobile" mb-1>
		<Notifications my-2 />

		<div flex-1 />

		<div relative>
			<RouterLink :to="{ name: 'home' }" class="home-logo">
				<Icon-BugShot class="bugshot-logo" size="4rem" />
			</RouterLink>
		</div>

		<div flex-1 />

		<UserMenu my-2 />
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
@media (max-width: $breakpoint-l) {
}

nav.normal {
	display: flex;
	@media (max-width: $breakpoint-l) {
		display: none;
	}
}

nav.mobile {
	display: none;
	@media (max-width: $breakpoint-l) {
		display: flex;
	}

	.home-logo {
		position: absolute;
		transform: translate(-50%, -40%);

		.bugshot-logo {
			position: relative;

			width: 6rem;
			height: 6rem;
			padding: 1rem;

			background-color: var(--bs-black);
			border-radius: 2px;

			&::before,
			&::after {
				border-radius: 2px;
				content: "";
				position: absolute;
				border-top: 1rem solid transparent;
				border-bottom: 1rem solid transparent;
				top: 0;
				bottom: 0;
			}

			&::before {
				border-right: 1rem solid var(--bs-black);
				right: 99%;
			}
			&::after {
				border-left: 1rem solid var(--bs-black);
				left: 99%;
			}
		}
	}
}

nav {
	background: #1a2040;
	width: 5.5rem;
	min-width: 5.5rem;
	height: 100vh;

	user-select: none;
	display: flex;
	flex-direction: column;
	align-items: center;

	gap: 1rem;

	padding: 1rem 0 1rem 0;

	@media (max-width: $breakpoint-l) {
		height: 5.5rem;
		min-height: 5.5rem;
		width: 100vw;
		flex-direction: row;
		padding: 0 1rem 0 1rem;
	}
}
</style>
