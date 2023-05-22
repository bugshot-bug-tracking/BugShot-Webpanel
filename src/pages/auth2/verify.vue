<template>
	<div w-100 text-left>
		<div class="loading" v-if="status === 0">
			<img src="/src/assets/animations/loading.svg" alt="loading" />
			<div class="text">{{ t("verifying") + "..." }}</div>
		</div>

		<div class="success" v-if="status === 1">
			<img src="/src/assets/animations/bug_confirmation.gif" alt="loading" />
			<div class="text">{{ t("success") + "..." }}</div>
		</div>

		<div class="error" v-if="status === 2">
			<img src="/src/assets/animations/error_bug.gif" alt="loading" />
			<div class="text">{{ t("error") + "..." }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const props = defineProps({
	user_id: {
		required: true,
		type: String,
	},
	token: {
		required: true,
		type: String,
	},
});

const route = useRoute();
const router = useRouter();
const store = useAuthStore();
const { t } = useI18n();

// 0 means loading, 1 means success, 2 means error
const status = ref(0);

const verify = async () => {
	status.value = 0;

	try {
		store.verifyEmail({
			id: Number(props.user_id),
			token: props.token,
			expires: route.query.expires?.toString()!,
			signature: route.query.signature?.toString()!,
		});

		status.value = 1;
	} catch (error) {
		console.log(error);

		status.value = 2;
	} finally {
		setTimeout(() => {
			router.push({ name: "login2" });
		}, 3000);
	}
};

onMounted(verify);
</script>
