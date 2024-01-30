<template>
	<n-scrollbar flex-1>
		<div m-8 max-w-88ch>
			<div class="component-group" v-if="false">
				<div class="group-header">Advanced settings</div>
				<div class="group-content">show UI Elements</div>
			</div>

			<div class="component-group">
				<div class="group-header">
					{{ t("user_settings.advanced_page.notifications.header", 2) }}
				</div>
				<div class="group-content">
					<NotificationSettings
						v-model:selection="selection"
						:custom_options="currentCustomOptions.cloned"
						@change:custom_options="handleCustomOptionsChange"
					/>
				</div>
			</div>

			<div class="bs-container" flex-row gap-6 justify-center py-8>
				<n-button type="success" size="large" round strong @click="handleSubmit">
					{{ t("user_settings.advanced_page.save_changes") }}
				</n-button>

				<n-button type="success" size="large" round strong ghost @click="handleCancel">
					{{ t("user_settings.advanced_page.cancel_changes") }}
				</n-button>
			</div>
		</div>
	</n-scrollbar>
</template>

<script setup lang="ts">
import { SettingValues } from "~/models/Setting";
import { useUserSettingsStore } from "~/stores/userSettings";

const { t } = useI18n();

const store = useUserSettingsStore();

const resetFlag = ref(false);

const defaultSelection = computed(() => {
	switch (store.getNotificationsSelection?.attributes.value?.id) {
		default:
		case SettingValues.every_notification:
			return "all";

		case SettingValues.custom_notifications:
			return "custom";
	}
});

const selection = computed({
	get: () => {
		if (selectionRef.value != undefined && resetFlag.value === false) {
			return selectionRef.value;
		}

		return defaultSelection.value;
	},

	set: (value: "all" | "custom" | undefined) => {
		selectionRef.value = value;
	},
});

const selectionRef = ref<"all" | "custom" | undefined>(undefined);

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
	const queue = [];

	if (
		store.getNotificationsSelection &&
		selectionRef.value &&
		selectionRef.value !== defaultSelection.value
	) {
		const settingValue =
			selectionRef.value === "custom"
				? SettingValues.custom_notifications
				: SettingValues.every_notification;

		queue.push(
			store.changeSetting(store.getNotificationsSelection.attributes.setting.id, settingValue)
		);
	}

	if (!(selectionRef.value === "all"))
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
};

const handleCancel = () => {
	resetFlag.value = true;

	selectionRef.value = selection.value;
	optionChanges.value = new Map();

	Object.assign(currentCustomOptions.value, useCloned(store.getCustomNotificationsSettings));

	resetFlag.value = false;
};
</script>

<style lang="scss" scoped></style>

<route lang="yaml">
name: settings-advanced
</route>
