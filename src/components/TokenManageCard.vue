<template>
	<n-spin :show="loading">
		<n-card v-if="!editMode.enabled" h-32>
			<template #header>
				<n-text> {{ description }} </n-text>
			</template>

			<template #header-extra>
				<div flex gap-4>
					<n-button text @click="emit('favorite', !is_favorite)">
						<IconStar
							size="1.5rem"
							cursor-pointer
							:filled="is_favorite"
							color="var(--bs-yellow)"
							:title="t('favorite')"
						/>
					</n-button>

					<n-dropdown trigger="click" :options="options">
						<n-button text>
							<IconVerticalDots size="1.25rem" cursor-pointer />
						</n-button>
					</n-dropdown>
				</div>
			</template>

			<n-input type="text" :placeholder="t('token')" :value="token" readonly>
				<template #suffix>
					<div flex items-center justify-center>
						<Icon-Clipboard-Copy
							@click="copyToClipboard"
							color="var(--bs-black)"
							v-if="copyIconState === 'copy'"
							:title="t('copy')"
							size="1.25rem"
							cursor-copy
						/>
						<Icon-Clipboard-Success
							color="var(--bs-green-dark)"
							v-else-if="copyIconState === 'success'"
							:title="t('success')"
							size="1.25rem"
							cursor-default
						/>
						<Icon-Clipboard-Error
							color="var(--bs-red)"
							v-else-if="copyIconState === 'error'"
							:title="t('error')"
							size="1.25rem"
							cursor-default
						/>
					</div>
				</template>
			</n-input>
		</n-card>

		<n-card v-else h-32>
			<n-input
				type="text"
				size="large"
				:placeholder="editMode.defaultValue"
				v-model:value="editMode.value"
				ref="editInputRef"
			>
			</n-input>

			<div flex items-center justify-center gap-2 mt-4>
				<n-button type="success" round @click="editMode.save">
					<template #icon>
						<IconCheck cursor-pointer />
					</template>

					{{ t("project_page.settings.guest_token_modal.save_button") }}
				</n-button>

				<n-button type="error" round ghost @click="editMode.cancel">
					<template #icon>
						<IconX cursor-pointer />
					</template>

					{{ t("project_page.settings.guest_token_modal.cancel_button") }}
				</n-button>
			</div>
		</n-card>
	</n-spin>
</template>

<script setup lang="ts">
import { useDiscreteApi } from "~/composables/DiscreteApi";
import IconEdit from "./icons/Icon-Edit.vue";
import IconBin from "./icons/Icon-Bin.vue";
import { DropdownOption, InputInst } from "naive-ui";

const props = defineProps({
	description: {
		required: true,
		type: String,
	},
	token: {
		required: true,
		type: String,
	},
	loading: {
		required: false,
		type: Boolean,
		default: false,
	},
	is_favorite: {
		required: false,
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits<{
	(event: "delete"): void;
	(event: "change", value: string): void;
	(event: "favorite", value: boolean): void;
}>();

const { message } = useDiscreteApi();
const { t } = useI18n();

const copyIconState = ref<"copy" | "success" | "error">("copy");
const copyToClipboard = () => {
	if (props.token)
		try {
			navigator.clipboard.writeText(props.token);
			console.log("Text is copied!");
			message.success(t("messages.text_to_clipboard"));

			copyIconState.value = "success";
		} catch (error) {
			console.error("Could not copy text: ", error);
			message.success(t("messages.text_to_clipboard_error"));

			copyIconState.value = "error";
		} finally {
			setTimeout(() => {
				copyIconState.value = "copy";
			}, 1500);
		}
};

const editInputRef = ref<InputInst | null>(null);
const editMode = reactive({
	enabled: false,
	defaultValue: "",
	value: "",

	enable: () => {
		editMode.enabled = true;
		editMode.defaultValue = props.description;
		editMode.value = props.description;
		nextTick(() => editInputRef.value?.select());
	},

	cancel: () => {
		editMode.enabled = false;
	},

	save: () => {
		emit("change", editMode.value);

		editMode.cancel();
	},
});

const options = ref<DropdownOption[]>([
	{
		label: t("project_page.settings.guest_token_modal.edit_description"),
		key: "edit",
		icon: () => h(IconEdit),
		props: {
			onClick: () => editMode.enable(),
		},
	},

	{
		label: t("project_page.settings.guest_token_modal.delete_token"),
		key: "delete",
		icon: () => h(IconBin),
		props: {
			onClick: () => emit("delete"),
		},
	},
]);
</script>

<style scoped lang="scss"></style>
