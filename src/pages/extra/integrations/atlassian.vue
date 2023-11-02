<template>
	<div class="container bs-b" v-if="status.value === 0">
		<img src="/src/assets/animations/loading.svg" w-50 />

		<n-text strong class="text-7" style="color: var(--bs-purple)">
			{{ t("verifying") }}
		</n-text>
	</div>

	<div class="container success" v-if="status.value === 1">
		<img src="/src/assets/animations/bug_confirmation.gif" w-50 />

		<n-text strong class="text-7" style="color: var(--bs-green)">
			{{ t("success") }}
		</n-text>
	</div>

	<div class="container" v-if="status.value === 2">
		<img src="/src/assets/animations/error_bug.gif" w-68 />

		<n-text strong class="text-7" style="color: var(--bs-red)">
			{{ status.message ?? t("error") }}
		</n-text>
	</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { useAuthStore } from "~/stores/auth";

const { t } = useI18n();

const route = useRoute();

const status = reactive({
	value: 0,
	message: undefined as undefined | string,
});

const state = computed(() => {
	if (!route.query.hasOwnProperty("state")) return undefined;

	let received_state = atob(route.query.state as string);

	let [token, project_id] = received_state.split("|");

	return { token, project_id };
});

onMounted(async () => {
	console.log(route);

	if (validateEnvironment()) {
		await getToken();

		status.value = 1;
	}

	setTimeout(() => {
		window.close();
	}, 3000);
});

const validateEnvironment = () => {
	// check the state query existence
	if (!route.query.hasOwnProperty("state") || route.query.state == null) {
		status.value = 2;
		status.message = t("extra.integrations.atlassian.errors.no_state");
		return false;
	}

	// check state state (error/success)
	if (route.query.hasOwnProperty("error")) {
		if (route.query.error === "access_denied") {
			status.value = 2;
			status.message = t("extra.integrations.atlassian.errors.access_denied");
		}

		status.value = 2;
		return false;
	}

	// check auth status
	if (useAuthStore().token == undefined || useAuthStore().token === "") {
		status.value = 2;
		status.message = t("extra.integrations.atlassian.errors.not_authenticated");
		return false;
	}

	// check token in state against auth token
	const local_token = useAuthStore().token.split("|")[1];

	if (local_token !== state.value?.token) {
		status.value = 2;
		status.message = t("extra.integrations.atlassian.errors.token_mismatch");
		return false;
	}

	// check for project id in state
	if (state.value?.project_id == undefined || state.value.project_id === "") {
		status.value = 2;
		status.message = t("extra.integrations.atlassian.errors.invalid_state");
		return false;
	}

	return true;
};

const getToken = async () => {
	try {
		// let response =
		await axios.post(`projects/${state.value!.project_id}/jira-link`, {
			code: route.query.code,
		});
	} catch (error) {
		// can be 400 if link already exists
		console.log(error);
	}
};
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 30rem;
	height: 25rem;
	background: #ffffff;
	box-shadow: 0px 2px 4px #1a204029;
	border-radius: 0.5rem;
	gap: 2.5rem;
	padding: 0.5rem;
}
</style>

<route lang="yaml">
meta:
    layout: empty
</route>
