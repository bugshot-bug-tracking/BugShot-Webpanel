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
import { useAuthStore } from "./stores/auth";
import { useMainStore } from "./stores/main";

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
