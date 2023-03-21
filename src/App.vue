<template>
	<Banner />

	<main class="main-loading" v-if="loading">
		<img src="/src/assets/animations/loading.svg" alt="loading circle" />
	</main>

	<n-config-provider
		:locale="enUS"
		:date-locale="dateEnUS"
		:theme="theme"
		:theme-overrides="overrides"
		flex
		style="width: 100vw; position: relative"
		v-else
	>
		<RouterView />
	</n-config-provider>
	<Feedback />
</template>

<script setup lang="ts">
import { useI18nStore } from "~/stores/i18n";
import { useAuthStore } from "./stores/auth";
import { useMainStore } from "./stores/main";
import { useTheme } from "~/composables/useThemes";
import { enUS, dateEnUS } from "naive-ui"; //TODO WIP sync with locale store

const { theme, overrides } = useTheme();

const route = useRoute();

const user = computed(() => useAuthStore().getUser);

const loading = ref(true);

//TODO add an error main component

onMounted(async () => {
	try {
		loading.value = true;

		useI18nStore().init();

		await useAuthStore().attempt(localStorage.getItem("authToken") || "");
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
});

// when there is a user (auth on), fetch main data
watch(user, async (newUser, oldUser) => {
	if ((oldUser.id == undefined && newUser.id != undefined) || oldUser.id !== newUser.id)
		try {
			loading.value = true;

			if (user.value.id) await useMainStore().init();
		} catch (error) {
			console.log(error);
		} finally {
			loading.value = false;
		}
});

watchEffect(() => {
	if (
		route.query.lang != undefined &&
		typeof route.query.lang === "string" &&
		["auto", "en", "de"].includes(route.query.lang)
	) {
		useI18nStore().setLocale(route.query.lang);
	}
});
</script>

<style lang="scss">
@import "./styles/global.scss";
@import "./styles/custom.scss";
@import "./styles/external.scss";
</style>

<style scoped>
.main-loading {
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
