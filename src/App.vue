<template>
	<RouterView />
</template>

<script setup lang="ts">
import { useI18nStore } from "~/stores/i18n";
import { useMainStore } from "~/stores/main";

useI18nStore().init();
useMainStore().init();
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Open+Sans&display=swap");
@import "./styles/global.scss";
@import "./styles/custom.scss";
@import "./styles/external.scss";

#app {
	font-family: "Open Sans", sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	display: flex;
}
</style>

<style lang="scss">
.disabled {
	opacity: 0.5 !important;

	&:hover {
		opacity: 0.5 !important;
		filter: none !important;
	}
}

.default-form {
	width: 100%;
	padding: 0 5%;
}
</style>

<style lang="scss">
.bs-input {
	width: 100%;
	display: flex;
	position: relative;
	align-items: center;
	margin: auto;

	input {
		border: 1px solid hsl(264, 78%, 77%);
		border-radius: 8px;
		width: 100%;
		padding: 10px;

		&:focus,
		&:focus-visible,
		&:hover {
			border-color: hsl(265, 79%, 41%);
			outline-color: hsl(265, 79%, 41%);
		}
	}

	textarea {
		border: 1px solid hsl(264, 78%, 77%);
		border-radius: 8px;
		width: 100%;
		padding: 10px;

		&:focus,
		&:focus-visible,
		&:hover {
			border-color: hsl(265, 79%, 41%);
			outline-color: hsl(265, 79%, 41%);
		}
	}

	&.w-icon {
		input {
			padding-right: 40px;
		}

		img {
			width: 20px;
			position: absolute;
			right: 12px;
		}
	}
}
</style>
