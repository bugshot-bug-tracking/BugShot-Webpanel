<template>
	<div class="auth-grid">
		<header>
			<img src="/src/assets/icons/bugshot.svg" />
		</header>

		<main>
			<RouterView />
		</main>

		<footer>
			<I18nSwitcher />
		</footer>
	</div>
</template>

<style lang="scss" scoped>
.auth-grid {
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1.9fr 0.1fr;
	gap: 0px 0px;
	grid-template-areas:
		"header main"
		"header footer";
	overflow: hidden;

	> header {
		grid-area: header;
		background-image: url("/src/assets/images/bugshot_login_background.jpg");
		background-size: cover;
		background-position: center;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;

		&::after {
			width: 100%;
			height: 100%;
			background: #5916b9;
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			opacity: 0.92;
			z-index: 0;
		}

		img {
			z-index: 1;
		}
	}

	> main {
		grid-area: main;
		position: relative;
		padding: 30px;

		display: flex;
		flex-direction: column;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	> footer {
		grid-area: footer;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 1rem;
		width: 100%;
		padding: 30px;
		padding-top: 0;
	}
}
</style>
