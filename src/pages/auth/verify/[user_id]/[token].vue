<template>
	<section w-100 text-left>
		<div class="loading" v-if="status === 0">
			<img
				src="/src/assets/animations/loading.svg"
				alt="loading"
				style="width: 15rem; height: 15rem"
			/>
			<n-text type="primary" strong>{{ t("verifying") + "..." }} </n-text>
		</div>

		<div class="success" v-if="status === 1">
			<img
				src="/src/assets/animations/bug_confirmation_not_white.gif"
				alt="Success"
				style="width: 19rem; height: 19rem"
			/>

			<n-text type="success" strong>
				{{ t("success") + "!" }}
			</n-text>
		</div>

		<div class="error" v-if="status === 2">
			<img
				src="/src/assets/animations/error_bug.gif"
				alt="error"
				style="width: 19rem; height: 19rem"
			/>
			<n-text type="error" strong>{{ t("error") + "!" }} </n-text>
		</div>
	</section>
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
		await store.verifyEmail({
			id: Number(props.user_id),
			token: props.token,
			expires: route.query.expires?.toString()!,
			signature: route.query.signature?.toString()!,
		});

		status.value = 1;

		setTimeout(() => {
			router.push({ name: "login" });
		}, 3000);
	} catch (error) {
		console.log(error);

		status.value = 2;
	}
};

verify();
</script>

<style scoped lang="scss">
section > div {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rem;
	font-size: 1.5rem;
	text-align: center;
}
</style>
