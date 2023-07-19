<template>
	<div text-left>
		<n-h1 mb-8>
			<n-text type="primary" style="font-weight: 700">
				{{ t("password_reset") }}
			</n-text>
		</n-h1>

		<n-form
			v-if="!goodResponse"
			ref="formRef"
			:model="form.data"
			:rules="form.rules"
			:show-require-mark="false"
			:disabled="loading"
		>
			<n-form-item :label="t('email')" path="email" mt-4>
				<n-input
					v-model:value="form.data.email"
					placeholder=""
					size="large"
					:input-props="{
						type: 'email',
					}"
					:status="form.inputStates"
					@input="form.clearState"
				>
					<template #suffix>
						<Icon-Email size="1.5rem" color="var(--bs-black)" />
					</template>
				</n-input>
			</n-form-item>

			<div v-if="errMessage" class="error-message">
				{{ errMessage }}
			</div>

			<n-form-item>
				<n-button
					@click="submit"
					type="success"
					round
					strong
					ml-a
					:loading="loading"
					:disabled="loading"
				>
					{{ t("reset_password") }}
				</n-button>
			</n-form-item>
		</n-form>

		<div class="submit-message" v-else>
			<n-text style="color: white">
				{{ t("recover_email_sent") }}
			</n-text>
		</div>
	</div>
</template>

<script setup lang="ts">
import { FormInst, FormRules } from "naive-ui";
import { useAuthStore } from "~/stores/auth";

const router = useRouter();
const store = useAuthStore();
const { t } = useI18n();

const formRef = ref<FormInst | null>(null);

const form = reactive({
	data: {
		email: "",
	},
	rules: {
		email: {
			required: true,
			trigger: "blur",
			type: "email",
			message: t("please_input_a_valid_email"),
		},
	} as FormRules,
	inputStates: undefined as "success" | "warning" | "error" | undefined,
	clearState: () => {
		form.inputStates = undefined;
		errMessage.value = undefined;
	},
});

const errMessage = ref(undefined);

const loading = ref(false);

const submit = async () => {
	let valid = true;
	goodResponse.value = false;

	try {
		await formRef.value?.validate((errors) => {
			if (errors && errors.length > 0) valid = false;
		});

		loading.value = true;

		await store.recover({
			email: form.data.email,
		});

		goodResponse.value = true;

		setTimeout(() => {
			router.push({ name: "login" });
		}, 4000);
	} catch (error: any) {
		// comes from ValidateError naive-ui
		if (!valid) return;

		errMessage.value = error.response.data.errors.detail;
		form.inputStates = "error";
	} finally {
		loading.value = false;
	}
};

const goodResponse = ref(false);
</script>

<style scoped lang="scss">
.error-message {
	font-size: 0.875rem;
	text-align: justify;
	color: var(--bs-red);
	font-weight: 600;
}

.submit-message {
	background-color: var(--bs-purple);
	border-radius: 0.5rem;
	padding: 1rem;
	text-align: center;
}
</style>

<route lang="yaml">
name: recover
</route>
