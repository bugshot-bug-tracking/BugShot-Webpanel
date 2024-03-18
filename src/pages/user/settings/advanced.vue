<template>
	<n-scrollbar flex-1 x-scrollable>
		<article>
			<div class="component-group">
				<div class="group-header">
					{{ t("user_settings.advanced_page.notifications.header", 2) }}
				</div>
				<div class="group-content">
					<NotificationSettings
						:email-enabled="settings.emailEnabled"
						@update:emailEnabled="settings = { emailEnabled: $event }"
						:selection="settings.selection"
						@update:selection="settings = { selection: $event }"
						:custom_options="currentCustomOptions.cloned"
						@change:custom_options="handleCustomOptionsChange"
					/>
				</div>
			</div>

			<div flex flex-col gap-4>
				<div class="component-group">
					<div class="group-header">
						{{ t("user_settings.advanced_page.experimental.header") }}
					</div>

					<div class="group-content" text-start>
						<div class="bs-container" gap-4>
							<n-text tag="p" text-balance>
								{{ t("user_settings.advanced_page.experimental.disclaimer") }}
							</n-text>

							<n-text tag="p">
								{{ t("user_settings.advanced_page.experimental.disclaimer_2") }}
							</n-text>

							<n-checkbox v-model:checked="settings.betaUser">
								<n-text>
									{{
										t(
											"user_settings.advanced_page.experimental.acknowledgement"
										)
									}}
								</n-text>
							</n-checkbox>
						</div>
					</div>
				</div>

				<div class="bs-container" flex-row gap-6 justify-center py-8>
					<n-button
						type="success"
						size="large"
						round
						strong
						@click="handleSubmit"
						:disabled="loading"
						:loading="loading"
					>
						{{ t("user_settings.advanced_page.save_changes") }}
					</n-button>

					<n-button
						type="success"
						size="large"
						round
						strong
						ghost
						@click="handleCancel"
						:disabled="loading"
					>
						{{ t("user_settings.advanced_page.cancel_changes") }}
					</n-button>
				</div>
			</div>
		</article>
	</n-scrollbar>
</template>

<script setup lang="ts">
import { useDiscreteApi } from "~/composables/DiscreteApi";
import { SettingValues } from "~/models/Setting";
import { useUserSettingsStore } from "~/stores/userSettings";

const { t } = useI18n();
const { message } = useDiscreteApi();
const store = useUserSettingsStore();

const resetFlag = ref(false);
const loading = ref(false);

const settingsRef = reactive({
	emailEnabled: undefined as boolean | undefined,
	betaUser: undefined as boolean | undefined,
	selection: undefined as "all" | "custom" | undefined,
});

const settings = computed({
	get() {
		if (resetFlag.value === true) {
			return {
				emailEnabled: defaults.value.emailEnabled,
				betaUser: defaults.value.betaUser,
				selection: defaults.value.selection,
			};
		}

		return settingsRef;
	},
	set(values: { emailEnabled?: boolean; betaUser?: boolean; selection?: "all" | "custom" }) {
		Object.assign(settingsRef, values);
	},
});

const defaults = computed(() => {
	let emailEnabled = undefined as boolean | undefined;
	let betaUser = undefined as boolean | undefined;
	let selection = undefined as "all" | "custom" | undefined;

	switch (store.getGeneralMailSetting?.attributes.value?.id) {
		default:
		case SettingValues.activated:
			emailEnabled = true;
			break;

		case SettingValues.deactivated:
			emailEnabled = false;
			break;
	}

	switch (store.getBetaUserSetting?.attributes.value?.id) {
		case SettingValues.activated:
			betaUser = true;
			break;

		default:
		case undefined:
		case SettingValues.deactivated:
			betaUser = false;
			break;
	}

	switch (store.getNotificationsSelection?.attributes.value?.id) {
		default:
		case SettingValues.every_notification:
			selection = "all";
			break;

		case SettingValues.custom_notifications:
			selection = "custom";
			break;
	}

	return { emailEnabled, betaUser, selection };
});

const currentCustomOptions = ref(useCloned(store.getCustomNotificationsSettings));
const optionChanges = ref<Map<string | number, "check" | "uncheck">>(new Map());

watch(
	() => store.getCustomNotificationsSettings,
	(newVal) => Object.assign(currentCustomOptions.value, useCloned(newVal))
);

const handleCustomOptionsChange = ({
	actionType,
	value,
}: {
	actionType: "check" | "uncheck";
	value: string | number;
}) => {
	optionChanges.value.set(value, actionType);
};

const handleSubmit = async () => {
	try {
		loading.value = true;

		const queue = [];

		if (
			store.getGeneralMailSetting &&
			settingsRef.emailEnabled !== defaults.value.emailEnabled
		) {
			const settingValue = settingsRef.emailEnabled
				? SettingValues.activated
				: SettingValues.deactivated;

			queue.push(
				store.changeSetting(store.getGeneralMailSetting.attributes.setting.id, settingValue)
			);
		}

		if (store.getBetaUserSetting && settingsRef.betaUser !== defaults.value.betaUser) {
			const settingValue = settingsRef.betaUser
				? SettingValues.activated
				: SettingValues.deactivated;

			queue.push(
				store.changeSetting(store.getBetaUserSetting.attributes.setting.id, settingValue)
			);
		}

		if (store.getNotificationsSelection && settingsRef.selection !== defaults.value.selection) {
			const settingValue =
				settingsRef.selection === "custom"
					? SettingValues.custom_notifications
					: SettingValues.every_notification;

			queue.push(
				store.changeSetting(
					store.getNotificationsSelection.attributes.setting.id,
					settingValue
				)
			);
		}

		if (!(settingsRef.selection === "all"))
			optionChanges.value.forEach((value, key) => {
				const option = currentCustomOptions.value.cloned.find(
					(option) => option.setting.name === key
				);

				if (!option) return;

				let targetValue = undefined as
					| SettingValues.activated
					| SettingValues.deactivated
					| undefined;
				switch (option.value.id as number) {
					case SettingValues.activated:
						targetValue = value === "uncheck" ? SettingValues.deactivated : undefined;
						break;
					case SettingValues.deactivated:
						targetValue = value === "check" ? SettingValues.activated : undefined;
						break;
				}

				if (targetValue) {
					queue.push(store.changeSetting(option.setting.id, targetValue as number));
				}
			});

		await Promise.allSettled(queue);

		message.success(t("messages.settings_updated"));
	} catch (error) {
		console.log(error);
		message.error(t("messages.error"));
	} finally {
		loading.value = false;
	}
};

const handleCancel = () => {
	resetFlag.value = true;

	Object.assign(settingsRef, settings.value);
	optionChanges.value = new Map();

	Object.assign(currentCustomOptions.value, useCloned(store.getCustomNotificationsSettings));

	resetFlag.value = false;
};

onMounted(handleCancel);
watch(defaults, handleCancel);
</script>

<style lang="scss" scoped>
article {
	display: grid;
	grid-template-columns: repeat(auto-fit, 42rem);
	grid-auto-flow: dense;
	padding: 2.5rem;
	padding-right: 1.5rem;
	gap: 2rem;
}
</style>

<route lang="yaml">
name: settings-advanced
</route>
