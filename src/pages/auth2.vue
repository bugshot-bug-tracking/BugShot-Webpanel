<template>
	<div class="auth-grid">
		<header>
			<RouterLink :to="{ name: 'home' }">
				<img src="/src/assets/images/bugshot-banner-white.svg" />
			</RouterLink>
		</header>

		<main>
			<RouterView />
		</main>

		<footer>
			<I18nSwitcher />
		</footer>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.auth-grid {
	width: 100vw;
	height: 100vh;

	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1.9fr 0.1fr;
	grid-template-areas:
		"header main"
		"header footer";

	@media (max-width: $breakpoint-l) {
		grid-template-columns: 1fr;
		grid-template-rows: 0.2fr 1.6fr 0.1fr;

		grid-template-areas:
			"header"
			"main"
			"footer";
	}

	> header {
		grid-area: header;
		background-image: url("/src/assets/images/bugshot_login_background.jpg");
		background-size: cover;
		background-position: center;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;

		@media (max-width: $breakpoint-l) {
			height: auto;
			background-image: unset;

			a img {
				height: 4rem;
			}
		}

		&::after {
			position: absolute;
			background: var(--bs-purple-dark);
			content: "";
			inset: 0;
			opacity: 0.92;
		}

		a {
			z-index: 1;
		}
	}

	> main {
		grid-area: main;
		position: relative;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	> footer {
		grid-area: footer;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 1rem;
		padding: 2rem;
		padding-top: 0;
	}
}
</style>

<route lang="yaml">
meta:
    layout: empty
</route>
