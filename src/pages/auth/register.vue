<template>
	<div text-left>
		<n-h1 text-6>
			<n-text style="font-weight: 700">
				{{ t("register_page.header") }}
			</n-text>
		</n-h1>

		<n-p mb-8>
			{{ t("register_page.subheader") }}
		</n-p>

		<n-steps :current="steps.current" :status="steps.status" size="small" class="steps">
			<n-step :title="t('register_page.step_1')" style="width: 30%; flex: unset">
				<template #icon><div /></template>
			</n-step>
			<n-step :title="t('register_page.step_2')" style="width: 50%; flex: unset">
				<template #icon><div /></template>
			</n-step>
			<n-step :title="t('register_page.step_3')" max-w-fit style="width: auto; flex: unset">
				<template #icon><div /></template>
			</n-step>
			<template #finish-icon><div /></template>
		</n-steps>

		<n-form
			ref="formRef"
			:model="form.data"
			:rules="form.rules"
			:show-require-mark="false"
			:disabled="loading"
			my-8
		>
			<Transition mode="out-in" :name="transitionDirection">
				<div v-if="steps.current === 1" flex flex-col gap-4>
					<n-h2 m-0>
						<n-text type="primary" style="font-weight: 700">
							{{ t("register_page.step_1_header") }}
						</n-text>
					</n-h2>

					<n-p style="font-size: 0.875rem" m-0>
						{{ t("register_page.step_1_subheader") }}
					</n-p>

					<n-form-item :label="t('email')" path="email">
						<n-input
							type="text"
							:input-props="{ type: 'email' }"
							size="large"
							v-model:value="form.data.email"
							:disabled="loading"
							placeholder=""
						>
							<template #suffix>
								<Icon-Email size="1.5rem" color="var(--bs-black)" />
							</template>
						</n-input>
					</n-form-item>

					<div flex items-center>
						<n-form-item path="tos_pp" :show-label="false">
							<n-checkbox mr-2 v-model:checked="form.data.tos_pp" :disabled="loading">
								<i18n-t
									keypath="register_page.accept_tos_and_pp"
									tag="p"
									scope="global"
								>
									<template v-slot:tos>
										<n-button
											type="primary"
											text
											tag="a"
											href="https://www.bugshot.de/nutzungsbedingungen"
											target="_blank"
											@click.stop
										>
											{{ $t("terms_of_service") }}
										</n-button>
									</template>

									<template v-slot:pp>
										<n-button
											type="primary"
											text
											tag="a"
											href="https://www.bugshot.de/datenschutz"
											target="_blank"
											@click.stop
										>
											{{ $t("privacy_policy") }}
										</n-button>
									</template>
								</i18n-t>
							</n-checkbox>
						</n-form-item>
					</div>

					<div flex flex-1 justify-between items-center my-4>
						<n-button
							type="success"
							round
							strong
							@click="steps.next"
							:disabled="loading"
							:loading="loading"
						>
							{{ t("register_page.next_step") }}
						</n-button>
					</div>
				</div>

				<div v-else-if="steps.current === 2" flex flex-col gap-4>
					<n-h2 m-0>
						<n-text type="primary" style="font-weight: 700">
							{{ t("register_page.step_2_header") }}
						</n-text>
					</n-h2>

					<n-p style="font-size: 0.875rem" m-0>
						{{ t("register_page.step_2_subheader") }}
					</n-p>

					<div>
						<n-form-item :label="t('first_name')" path="first_name">
							<n-input
								type="text"
								:input-props="{ autocomplete: 'given-name' }"
								size="large"
								placeholder=""
								v-model:value="form.data.first_name"
								:disabled="loading"
							>
							</n-input>
						</n-form-item>

						<n-form-item :label="t('last_name')" path="last_name">
							<n-input
								type="text"
								:input-props="{ autocomplete: 'family-name' }"
								size="large"
								placeholder=""
								v-model:value="form.data.last_name"
								:disabled="loading"
							>
							</n-input>
						</n-form-item>
					</div>

					<div flex flex-1 justify-between items-center my-4>
						<n-button
							type="success"
							round
							strong
							ghost
							@click="steps.prev"
							:disabled="loading"
						>
							{{ t("register_page.previous_step") }}
						</n-button>

						<n-button
							type="success"
							round
							strong
							@click="steps.next"
							:disabled="loading"
							:loading="loading"
						>
							{{ t("register_page.next_step") }}
						</n-button>
					</div>
				</div>

				<div v-else-if="steps.current === 3" flex flex-col gap-4>
					<n-h2 m-0>
						<n-text type="primary" style="font-weight: 700">
							{{ t("register_page.step_3_header") }}
						</n-text>
					</n-h2>

					<div>
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

						<PasswordRules
							:rules="confirmPasswordRules"
							:active="confirmPasswordRulesActive"
						/>
					</div>

					<div flex flex-1 justify-between items-center my-4>
						<n-button
							type="success"
							round
							strong
							ghost
							@click="steps.prev"
							:disabled="loading"
						>
							{{ t("register_page.previous_step") }}
						</n-button>

						<n-button
							type="success"
							round
							strong
							@click="onSubmit"
							:disabled="loading"
							:loading="loading"
						>
							{{ t("submit") }}
						</n-button>
					</div>
				</div>

				<div v-else-if="steps.current === 10" flex flex-col gap-4>
					<n-h2 m-0>
						<n-text type="primary" style="font-weight: 700">
							{{ t("register_page.success_header") }}!
						</n-text>
					</n-h2>

					<n-p style="font-size: 0.875rem" m-0>
						{{ t("register_page.success_text") }}
					</n-p>

					<n-p style="font-size: 0.875rem; color: var(--bs-gray)" m-0 mt-2>
						<i18n-t keypath="register_page.success_resend_mail" scope="global">
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
								{{ t("register_page.success_resend_mail_0") }}
							</n-button>
						</i18n-t>
					</n-p>
				</div>
			</Transition>
		</n-form>
	</div>
</template>

<script setup lang="ts">
import { FormInst, FormItemRule, FormRules, FormValidationError, StepsProps } from "naive-ui";
import { useDiscreteApi } from "~/composables/DiscreteApi";
import { User } from "~/models/User";
import { useAuthStore } from "~/stores/auth";

const { t } = useI18n();

const { message } = useDiscreteApi();

const store = useAuthStore();

const steps = reactive({
	current: 1,
	status: "process" as StepsProps["status"],
	next: async () => {
		loading.value = true;

		if (await steps.verifyStep()) {
			formRef.value?.restoreValidation();

			// improve UX by making the process slower so the animations have time to be visible
			await new Promise((resolve) => setTimeout(resolve, 250));
			transitionDirection.value = "slide-up";

			steps.current++;
		}

		loading.value = false;
	},
	prev: () => {
		transitionDirection.value = "slide-down";
		steps.current--;
	},

	verifyStep: async () => {
		try {
			await formRef.value?.validate();

			return true;
		} catch (error: any) {
			console.log(error);

			// restrict progression based on the step (there can be errors on future steps but we don't care about those until we reach em)
			switch (steps.current) {
				case 1:
					// if there are no errors in this step return true to continue the progression
					if (
						(error as FormValidationError[]).some((arr) =>
							arr.some((i) => i.field === "email" || i.field === "tos_pp")
						)
					) {
						console.log("1");
						return false;
					}
					break;

				case 2:
					// if there are no errors in this step return true to continue the progression
					if (
						(error as FormValidationError[]).some((arr) =>
							arr.some((i) => i.field === "first_name" || i.field === "last_name")
						)
					) {
						console.log("2");
						return false;
					}
					break;

				case 3:
					// if there are no errors in this step return true to continue the progression
					if (
						(error as FormValidationError[]).some((arr) =>
							arr.some(
								(i) => i.field === "password" || i.field === "confirm_password"
							)
						)
					) {
						console.log("3");
						return false;
					}
					break;

				default:
					break;
			}

			console.log("here");
			return true;
		}
	},

	success: () => {
		steps.current = 10;
	},
});

const formRef = ref<FormInst | null>(null);

const form = reactive({
	data: {
		email: "",
		first_name: "",
		last_name: "",
		password: "",
		confirm_password: "",

		tos_pp: false,
	},
	rules: {
		email: [
			{
				required: true,
				trigger: "blur",
				type: "email",
				message: t("please_input_a_valid_email"),
			},
			{
				async validator(rule: FormItemRule, value: string) {
					try {
						await store.checkEmail(value);
					} catch (error) {
						console.log(error);
						throw new Error(t("register_page.errors.email_taken"));
					}

					return true;
				},
			},
		],

		first_name: {
			required: true,
			trigger: "blur",
			type: "string",
			message: t("please_tell_us_your_first_name"),
			min: 1,
		},
		last_name: {
			required: true,
			trigger: "blur",
			type: "string",
			message: t("please_tell_us_your_last_name"),
			min: 1,
		},

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

		tos_pp: {
			required: true,
			message: t("please_accept_tos_and_pp"),
			trigger: ["change"],
			validator: (rule: FormItemRule, value: any): boolean | Error => {
				return value;
			},
		},
	} as FormRules,
	inputStates: undefined as "success" | "warning" | "error" | undefined,
	clearState: () => {
		form.inputStates = undefined;
		// errMessage.value = undefined;
	},
});

const loading = ref(false);

const passwordRules = computed(() => [
	{ text: t("limits.min_chars", { x: 8 }), value: form.data.password.length > 8 },
	{ text: t("limits.letters"), value: /[a-zA-Z]/g.test(form.data.password) },
	{ text: t("limits.numbers"), value: /[0-9]/g.test(form.data.password) },
]);

const confirmPasswordRules = computed(() => [
	{ text: t("limits.min_chars", { x: 8 }), value: form.data.confirm_password.length > 8 },
	{ text: t("limits.letters"), value: /[a-zA-Z]/g.test(form.data.confirm_password) },
	{ text: t("limits.numbers"), value: /[0-9]/g.test(form.data.confirm_password) },
	{ text: t("limits.passwords_match"), value: form.data.password === form.data.confirm_password },
]);

const passwordRulesActive = ref(false);
const confirmPasswordRulesActive = ref(false);

const userResponse = ref<User | undefined>(undefined);

const onSubmit = async () => {
	try {
		loading.value = true;

		let response = await store.register({
			email: form.data.email,
			first_name: form.data.first_name,
			last_name: form.data.last_name,
			password: form.data.password,
			confirm_password: form.data.confirm_password,
		});
		userResponse.value = response;

		steps.success();
	} catch (error: any) {
		console.log(error);
		userResponse.value = undefined;

		const resError = error.response.data.errors;

		if (resError?.email) {
			message.error(resError.email[0]);
			steps.current = 1;
			return;
		}

		if (resError?.password) {
			message.error(resError.password[0]);
			return;
		}
	} finally {
		loading.value = false;
	}
};

const resendLoading = ref(false);
const resendEmail = async () => {
	try {
		resendLoading.value = true;
		if (userResponse.value) await store.resendVerification(userResponse.value.id);
	} catch (error) {
		console.log(error);
	} finally {
		resendLoading.value = false;
	}
};

const transitionDirection = ref<
	"slide-up" | "slide-down" | "slide-left" | "slide-right" | "rotate-left" | "rotate-right"
>("slide-up");
</script>

<style scoped lang="scss">
:deep(.n-step--process-status) {
	.n-step-indicator {
		background-color: var(--bs-gray);
	}
}

:deep(.n-step--wait-status) {
	.n-step-indicator {
		background-color: var(--bs-gray);
		opacity: 0.5;
	}
}
:deep(.n-step--finish-status) {
	.n-step-indicator {
		background-color: var(--bs-green);
	}
}
:deep(.n-step-indicator) {
	width: 0.5rem;
	height: 0.5rem;
	box-shadow: unset;
	margin: auto;
}
:deep(.n-step-content-header) {
	margin-top: 0 !important;
}
:deep(.n-step-splitor) {
	margin-top: 0;
	align-self: center;
}

.steps {
	@media (max-width: $breakpoint-xs) {
		display: none;
	}
}
</style>

<route lang="yaml">
name: register
</route>
