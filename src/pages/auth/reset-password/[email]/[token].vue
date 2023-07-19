<template>
	<div text-left>
		<div v-if="!goodResponse">
			<n-h1 mb-8>
				<n-text type="primary" style="font-weight: 700">
					{{ t("password_reset") }}
				</n-text>
			</n-h1>
			<n-form
				ref="formRef"
				:model="form.data"
				:rules="form.rules"
				:show-require-mark="false"
				:disabled="loading"
			>
				<n-form-item :label="t('password')" path="password" :show-feedback="false">
					<n-input
						type="password"
						:input-props="{ autocomplete: 'new-password' }"
						size="large"
						show-password-on="click"
						v-model:value="form.data.password"
						:disabled="loading"
						placeholder=""
						@focus="passwordRulesActive = true"
						@blur="passwordRulesActive = false"
					>
						<template #password-visible-icon>
							<Icon-Password m-a color="var(--bs-black)" />
						</template>
						<template #password-invisible-icon>
							<Icon-Password hide m-a color="var(--bs-black)" />
						</template>
					</n-input>
				</n-form-item>
				<PasswordRules :rules="passwordRules" :active="passwordRulesActive" />
				<n-form-item
					:label="t('confirm_password')"
					path="confirm_password"
					:show-feedback="false"
				>
					<n-input
						type="password"
						:input-props="{ autocomplete: 'new-password' }"
						size="large"
						show-password-on="click"
						v-model:value="form.data.confirm_password"
						:disabled="loading"
						placeholder=""
						@focus="confirmPasswordRulesActive = true"
						@blur="confirmPasswordRulesActive = false"
					>
						<template #password-visible-icon>
							<Icon-Password m-a color="var(--bs-black)" />
						</template>
						<template #password-invisible-icon>
							<Icon-Password hide m-a color="var(--bs-black)" />
						</template>
					</n-input>
				</n-form-item>
				<PasswordRules :rules="confirmPasswordRules" :active="confirmPasswordRulesActive" />
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
						{{ t("confirm") }}
					</n-button>
				</n-form-item>
			</n-form>
		</div>

		<div class="submit-message" v-else>
			<img
				src="/src/assets/animations/bug_confirmation_not_white.gif"
				alt="Success"
				style="width: 19rem; height: 19rem"
			/>

			<n-text type="primary" strong>
				{{ t("password_reset_success") }}
			</n-text>
		</div>
	</div>
</template>

<script setup lang="ts">
import { FormInst, FormItemRule, FormRules } from "naive-ui";
import { useAuthStore } from "~/stores/auth";

const props = defineProps({
	email: {
		required: false,
		type: String,
		default: undefined,
	},
	token: {
		required: false,
		type: String,
		default: undefined,
	},
});

const router = useRouter();
const store = useAuthStore();
const { t } = useI18n();

const formRef = ref<FormInst | null>(null);

const form = reactive({
	data: {
		password: "",
		confirm_password: "",
	},
	rules: {
		password: {
			required: true,
			message: t("please_input_a_valid_password"),
			min: 8,
			trigger: ["blur"],
			validator: (rule: FormItemRule, value: any): boolean | Error => {
				if (passwordRules.value.some((r) => r.value === false)) return false;
				return true;
			},
		},
		confirm_password: {
			required: true,
			message: t("please_input_a_valid_password"),
			min: 8,
			trigger: ["blur"],
			validator: (rule: FormItemRule, value: any): boolean | Error => {
				if (confirmPasswordRules.value.some((r) => r.value === false)) return false;
				return true;
			},
		},
	} as FormRules,
	inputStates: undefined as "success" | "warning" | "error" | undefined,
	clearState: () => {
		form.inputStates = undefined;
		// errMessage.value = undefined;
	},
});

const passwordRules = computed(() => [
	{ text: t("limits.min_chars", { x: 8 }), value: form.data.password.length > 8 },
	{ text: t("limits.letters"), value: form.data.password.match(/[a-zA-Z]/g) },
	{ text: t("limits.numbers"), value: form.data.password.match(/[0-9]/g) },
]);

const confirmPasswordRules = computed(() => [
	{ text: t("limits.min_chars", { x: 8 }), value: form.data.confirm_password.length > 8 },
	{ text: t("limits.letters"), value: form.data.confirm_password.match(/[a-zA-Z]/g) },
	{ text: t("limits.numbers"), value: form.data.confirm_password.match(/[0-9]/g) },
	{ text: t("limits.passwords_match"), value: form.data.password === form.data.confirm_password },
]);

const passwordRulesActive = ref(false);
const confirmPasswordRulesActive = ref(false);

const errMessage = ref<string | undefined>(undefined);

const loading = ref(false);

const submit = async () => {
	let valid = true;
	goodResponse.value = false;

	if (props.email === undefined || props.token === undefined)
		return (errMessage.value = t("recover_link_invalid"));

	try {
		await formRef.value?.validate((errors) => {
			if (errors && errors.length > 0) valid = false;
		});

		loading.value = true;

		await store.newPassword({
			email: props.email,
			token: props.token,
			password: form.data.password,
			confirm_password: form.data.confirm_password,
		});

		goodResponse.value = true;

		setTimeout(() => {
			router.push({ name: "login" });
		}, 4000);
	} catch (error: any) {
		console.log(error);
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
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rem;
	font-size: 1.5rem;
	text-align: center;
}
</style>
