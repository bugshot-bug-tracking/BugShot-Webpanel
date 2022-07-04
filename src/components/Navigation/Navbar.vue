<template>
	<nav>
		<div class="top">
			<RouterLink :to="{ name: 'home' }" class="home-logo">
				<img src="/src/assets/icons/bugshot.svg" alt="Home" />
			</RouterLink>

			<Notifications />
		</div>

		<div class="bottom">
			<UserMenu />

			<I18nSwitcher />
		</div>
	</nav>
</template>

<script setup lang="ts"></script>

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
