<template>
	<div class="bs-container" text-start>
		<n-text> {{ t("user_settings.advanced_page.notifications.description") }} </n-text>

		<n-text class="bs-bb text-4.5 font-bold" my-4 pb-2>
			{{ t("user_settings.advanced_page.notifications.where_to_receive") }}
		</n-text>

		<div flex flex-col gap-4>
			<n-checkbox disabled checked>
				<n-text font-bold>
					{{ t("user_settings.advanced_page.notifications.in_app_notifications") }}
				</n-text>

				<n-text ml-1>
					{{ t("user_settings.advanced_page.notifications.cant_be_changed") }}
				</n-text>
			</n-checkbox>

			<n-checkbox v-model:checked="localEmailEnabled">
				<n-text font-bold>
					{{ t("user_settings.advanced_page.notifications.email_notifications") }}
				</n-text>
			</n-checkbox>
		</div>

		<n-text class="bs-bb text-4.5 font-bold" mt-8 mb-4 pb-2>
			{{ t("user_settings.advanced_page.notifications.what_email_to_receive") }}
		</n-text>

		<div flex flex-col gap-4>
			<n-radio-group
				v-model:value="localSelection"
				@update:value="emit('update:selection', localSelection)"
				:disabled="localEmailEnabled === false"
				flex
				flex-col
				gap-4
			>
				<n-radio value="all">
					<n-text font-bold>
						{{ t("user_settings.advanced_page.notifications.notify_on_everything") }}
					</n-text>
				</n-radio>

				<n-radio value="custom">
					<n-text font-bold>
						{{ t("user_settings.advanced_page.notifications.custom_notifications") }}
					</n-text>
				</n-radio>
			</n-radio-group>

			<n-checkbox-group
				v-if="localSelection === 'custom'"
				v-model:value="customNotifications"
				@update:value="updateCheckboxValue"
				:disabled="localEmailEnabled === false"
				flex
				flex-col
				gap-4
				pl-8
			>
				<n-checkbox
					v-for="option in localCustomOptions"
					:key="option.setting.id"
					:value="option.setting.name"
				>
					<n-text strong>
						{{
							t(
								`user_settings.advanced_page.notifications.custom_notifications_options.${option.setting.name}`
							)
						}}
					</n-text>
				</n-checkbox>
			</n-checkbox-group>
		</div>
	</div>
</template>

<script setup lang="ts">
import { SettingValues } from "~/models/Setting";

const { t } = useI18n();

interface CustomNotificationOptions {
	setting: { id: number; name: string };
	value: { id: number; name: string };
}

const props = defineProps({
	emailEnabled: {
		type: Boolean,
		required: false,
		default: undefined,
	},

	selection: {
		type: String as PropType<"all" | "custom">,
		required: false,
		default: "all",
	},
	custom_options: {
		type: Array as PropType<CustomNotificationOptions[] | undefined>,
		required: false,
		default: undefined,
	},
});

const emit = defineEmits<{
	(event: "update:emailEnabled", value: boolean): void;
	(event: "update:selection", value: "all" | "custom"): void;
	(
		event: "change:custom_options",
		value: { actionType: "check" | "uncheck"; value: string | number }
	): void;
}>();

const emailEnabledRef = ref<boolean>(true);
const localSelection = ref<"all" | "custom">("all");
const localCustomOptions = ref<CustomNotificationOptions[]>([]);

const localEmailEnabled = computed({
	get() {
		return emailEnabledRef.value;
	},
	set(value) {
		emailEnabledRef.value = value;
		if (props.emailEnabled !== undefined) emit("update:emailEnabled", value);
	},
});

const customNotifications = ref<string[]>([]);

const updateCheckboxValue = (
	value: (string | number)[],
	meta: { actionType: "check" | "uncheck"; value: string | number }
): void => {
	emit("change:custom_options", meta);
};

onMounted(() => {
	localSelection.value = props.selection;

	if (props.custom_options) {
		localCustomOptions.value = props.custom_options;

		customNotifications.value = props.custom_options
			.filter((option) => option.value.id === SettingValues.activated)
			.map((option) => option.setting.name);
	}
});

watch(
	() => props.emailEnabled,
	(newVal, oldValue) => {
		if (newVal !== undefined && newVal !== oldValue) localEmailEnabled.value = newVal;
	}
);

watch(
	() => props.selection,
	(newVal) => {
		localSelection.value = newVal;
	}
);

watch(
	() => props.custom_options,
	(newVal) => {
		if (newVal) {
			localCustomOptions.value = newVal;

			customNotifications.value = newVal
				.filter((option) => option.value.id === SettingValues.activated)
				.map((option) => option.setting.name);
		}
	}
);
</script>

<style scoped lang="scss"></style>
