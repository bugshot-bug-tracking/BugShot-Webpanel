<template>
	<div text-left>
		<n-h1>
			<n-text type="primary" style="font-weight: 700">
				{{ t("log_in") }}
			</n-text>
		</n-h1>

		<n-form
			ref="formRef"
			:model="form.data"
			:rules="form.rules"
			:show-require-mark="false"
			:disabled="loading"
			@submit.prevent="submit"
		>
			<n-form-item :label="t('email')" path="email" my-4>
				<n-input
					v-model:value="form.data.email"
					:placeholder="t('email_address')"
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

			<n-form-item :label="t('password')" path="password" my-4>
				<n-input
					v-model:value="form.data.password"
					:placeholder="t('password')"
					size="large"
					type="password"
					show-password-on="click"
					:status="form.inputStates"
					@input="form.clearState"
				>
					<template #password-visible-icon>
						<Icon-Password m-a color="var(--bs-black)" />
					</template>
					<template #password-invisible-icon>
						<Icon-Password hide m-a color="var(--bs-black)" />
					</template>
				</n-input>
			</n-form-item>

			<div v-if="errMessage" class="error-message">
				{{ errMessage }}

                <n-p style="font-size: 0.875rem; color: var(--bs-gray)" m-0 mt-2>
					<i18n-t v-if="!mailResent" keypath="login_page.error_resend_verification_mail" scope="global">
						<n-button
							:loading="resendLoading"
							text
							strong
							type="tertiary"
							underline
							@click="resendEmail"
							flex-row-reverse
							gap-2
							style="font-size: 0.875rem"
						>
							{{ t("login_page.error_resend_verification_mail_0") }}
						</n-button>
					</i18n-t>
                    <i18n-t v-else keypath="login_page.verification_mail_resent_successfully" scope="global"></i18n-t>
				</n-p>
			</div>

			<n-form-item>
				<n-button
					attr-type="submit"
					type="success"
					round
					strong
					ml-a
					:loading="loading"
					:disabled="loading"
				>
					{{ t("log_in") }}
				</n-button>
			</n-form-item>
		</n-form>

		<n-divider />

		<div flex items-center justify-between>
			<RouterLink :to="{ name: 'recover' }">
				<n-button type="primary" text>
					{{ t("forgot_password") + "?" }}
				</n-button>
			</RouterLink>

			<RouterLink :to="{ name: 'register' }">
				<n-button type="primary" round ghost strong>
					{{ t("register") }}
				</n-button>
			</RouterLink>
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
		password: "",
	},
	rules: {
		email: {
			required: true,
			trigger: "blur",
			type: "email",
			message: t("please_input_a_valid_email"),
		},
		password: {
			required: true,
			message: t("please_input_a_valid_password"),
			min: 8,
			trigger: ["blur"],
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

	try {
		await formRef.value?.validate((errors) => {
			if (errors && errors.length > 0) valid = false;
		});

		loading.value = true;

		await store.login({
			email: form.data.email,
			password: form.data.password,
		});

		router.push({ name: "home" });
	} catch (error: any) {
		// comes from ValidateError naive-ui
		if (!valid) return;

		errMessage.value = error.response.data.message;
		form.inputStates = "error";
	} finally {
		loading.value = false;
	}
};

const mailResent = ref(false);
const resendLoading = ref(false);
const resendEmail = async () => {
	try {
		resendLoading.value = true;
		await store.resendVerification(form.data.email);
	} catch (error) {
		console.log(error);
	} finally {
		resendLoading.value = false;
        mailResent.value = true;
	}
};
</script>

<style scoped lang="scss">
:deep(.n-divider__line) {
	height: 2px;
	background-color: var(--bs-purple-middle) !important;
}

.error-message {
	font-size: 0.875rem;
	text-align: center;
	color: var(--bs-red);
	font-weight: 600;
}
</style>

<route lang="yaml">
name: login
</route>
