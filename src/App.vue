<template>
	<Banner />

	<main class="main-loading" v-if="loading">
		<img src="/src/assets/animations/loading.svg" alt="loading circle" />
	</main>

	<RouterView v-else />

	<Feedback />
</template>

<script setup lang="ts">
import { useI18nStore } from "~/stores/i18n";
import { useMainStore } from "./stores/main";

const store = useMainStore();

const loading = ref(true);

onMounted(async () => {
	// fetch main data
	//TODO add an error main component
	try {
		loading.value = true;

		useI18nStore().init();

		await store.init();
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
});
</script>

<style scoped>
.main-loading {
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>

<style lang="scss">
@import "./styles/global.scss";
@import "./styles/custom.scss";
@import "./styles/external.scss";

@font-face {
	font-family: "Open Sans";
	src: url("~/assets/fonts/OpenSans/static/OpenSans/OpenSans-Regular.ttf");
	font-style: normal;
	font-weight: normal;
}

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
	padding: 0 1rem;
}
</style>
