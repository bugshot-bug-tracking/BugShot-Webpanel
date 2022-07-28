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
@import "@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss";

body {
	background-color: hsl(240, 40%, 98%);
	overflow: hidden;
	margin: unset;
	color: #1a2040;
}

*,
::after,
::before {
	box-sizing: border-box;
}

p {
	margin: unset;
}

#app {
	font-family: "Open Sans", sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	display: flex;
}

#nav {
	padding: 30px;

	a {
		font-weight: bold;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}

#nprogress {
	pointer-events: none;
}

#nprogress .bar {
	background: hsl(158, 80%, 41%);
	opacity: 0.75;
	position: fixed;
	z-index: 1031;
	top: 0;
	left: 0;
	width: 100%;
	height: 4px;
}

.dp__select {
	color: #18b984;
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

.disabled-overlay {
	position: absolute;
	width: 100%;
	height: 100%;
	opacity: 0.5;
	top: 0;
	left: 0;
	background-color: white;
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

<style lang="scss">
.bs-priority {
	font-weight: normal;
	font-size: 12px;
	line-height: 16px;
	color: hsl(0, 0%, 100%);
	border-radius: 30px;
	width: fit-content;
	height: fit-content;
	position: relative;
	padding: 3px 10px;
	user-select: none;

	&.priority1 {
		background-color: hsl(188, 80%, 47%);
	}

	&.priority2 {
		background-color: hsl(218, 80%, 47%);
	}

	&.priority3 {
		background-color: hsl(32, 100%, 67%);
	}

	&.priority4 {
		background-color: hsl(0, 90%, 60%);
	}
}
</style>
