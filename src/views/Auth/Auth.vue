<template>
	<div class="viewport-height-wrap">
		<!-- ./left-port -->
		<div class="left-port">
			<img src="../../assets/icons/bugshot.svg" class="logo" />
		</div>

		<!-- ./right-port -->
		<div class="right-port">
			<div />

			<div>
				<router-view />
			</div>

			<div class="footer">
				<I18nSwitcher />
			</div>
		</div>
	</div>
</template>

<script setup>
import I18nSwitcher from "../../components/i18nSwitcher.vue";
</script>

<style lang="scss" scoped>
.viewport-height-wrap {
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	display: flex;

	.left-port {
		background-image: url(../../assets/images/bugshot_login_background.jpg);
		flex: 0 0 50%;
		width: 50vw;
		background-size: cover;
		background-position: center;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		position: relative;

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

		.logo {
			position: relative;
			z-index: 1;
		}
	}
}

.right-port {
	flex: 0 0 50%;
	width: 50%;
	padding: 30px;
	display: flex;
	flex-direction: column;
	margin-left: auto;
	margin-right: auto;
	position: relative;
	align-items: center;
	justify-content: space-between;
}

.footer {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 1rem;
	width: 100%;
}
</style>
