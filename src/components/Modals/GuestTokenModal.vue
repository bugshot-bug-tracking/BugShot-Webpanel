<template>
	<MyModal :modelValue="props.show" :close="close" z-100>
		<ModalTemplate @close="close">
			<template #header-text>
				{{ t("project_page.settings.guest_token") }}
			</template>

			<div v-if="!addMode.enabled" min-h-32>
				<n-scrollbar v-if="list.length > 0" max-h-50vh px-4>
					<n-list :show-divider="false">
						<n-list-item v-for="token in list" :key="token.id" my-4>
							<TokenManageCard
								:description="token.attributes.description"
								:token="token.attributes.access_token"
								:is_favorite="token.attributes.is_favorite"
								:loading="tokenCardLoading === token.id"
								@change="handleChange(token, $event)"
								@delete="handleDelete(token)"
								@favorite="handleFavorite(token, $event)"
							/>
						</n-list-item>
					</n-list>
				</n-scrollbar>

				<n-empty
					v-else
					:description="t('project_page.settings.guest_token_modal.no_token_generated')"
				/>

				<div flex-1 flex justify-center mt-6>
					<n-button type="success" round @click="addMode.enable">
						<template #icon>
							<IconAdd />
						</template>

						{{ t("project_page.settings.guest_token_modal.add_token") }}
					</n-button>
				</div>
			</div>

			<div v-if="addMode.enabled" min-h-32>
				<n-spin :show="addMode.loading">
					<n-card :bordered="false" class="add-token-card">
						<n-form-item label="Token description">
							<n-input
								type="text"
								size="large"
								:placeholder="addMode.defaultValue"
								v-model:value="addMode.value"
								ref="addInputRef"
							>
							</n-input>
						</n-form-item>

						<div flex items-center justify-center gap-2>
							<n-button type="success" round @click="addMode.submit">
								<template #icon>
									<IconCheck cursor-pointer />
								</template>

								{{ t("project_page.settings.guest_token_modal.save_button") }}
							</n-button>

							<n-button type="error" round ghost @click="addMode.cancel">
								<template #icon>
									<IconX cursor-pointer />
								</template>

								{{ t("project_page.settings.guest_token_modal.cancel_button") }}
							</n-button>
						</div>
					</n-card>
				</n-spin>
			</div>
		</ModalTemplate>
	</MyModal>
</template>

<script setup lang="ts">
import { InputInst } from "naive-ui";
import { useDiscreteApi } from "~/composables/DiscreteApi";
import { AccessToken } from "~/models/AccessToken";

const props = defineProps({
	show: {
		type: Boolean,
		required: true,
		default: false,
	},
	list: {
		type: Array as PropType<AccessToken[]>,
		required: false,
		default: [],
	},

	onAdd: {
		type: Function as PropType<{ (description: string): Promise<AccessToken> }>,
		required: false,
		default: undefined,
	},
	onChange: {
		type: Function as PropType<{ (token: AccessToken, value: string): Promise<AccessToken> }>,
		required: false,
		default: undefined,
	},
	onDelete: {
		type: Function as PropType<{ (token: AccessToken): Promise<void> }>,
		required: false,
		default: undefined,
	},
	onFavorite: {
		type: Function as PropType<{ (token: AccessToken, value: boolean): Promise<void> }>,
		required: false,
		default: undefined,
	},
});

const emit = defineEmits(["update:show"]);

const { message } = useDiscreteApi();
const { t } = useI18n();

const tokenCardLoading = ref("");

const close = () => {
	emit("update:show", false);
};

const addInputRef = ref<InputInst | null>(null);

const addMode = reactive({
	enabled: false,
	defaultValue: "",
	value: "",
	loading: false,

	enable: () => {
		addMode.enabled = true;
		addMode.defaultValue = `Guest ${props.list.length + 1}`;
		addMode.value = `Guest ${props.list.length + 1}`;
		addMode.loading = false;
		nextTick(() => addInputRef.value?.select());
	},
	cancel: () => {
		addMode.enabled = false;
	},

	submit: async () => {
		try {
			addMode.loading = true;

			if (props.onAdd) {
				await props.onAdd(addMode.value === "" ? addMode.defaultValue : addMode.value);

				message.success(t("messages.token_created"));
			}

			addMode.cancel();
		} catch (error) {
			message.error(t("messages.error"));
		} finally {
			addMode.loading = false;
		}
	},
});

const handleChange = async (token: AccessToken, value: string) => {
	try {
		tokenCardLoading.value = token.id;

		if (props.onChange) {
			await props.onChange(token, value);

			message.success(t("messages.token_updated"));
		}
	} catch (error) {
		message.error(t("messages.error"));
	} finally {
		tokenCardLoading.value = "";
	}
};
const handleDelete = async (token: AccessToken) => {
	try {
		tokenCardLoading.value = token.id;

		if (props.onDelete) {
			await props.onDelete(token);

			message.success(t("messages.token_deleted"));
		}
	} catch (error) {
		message.error(t("messages.error"));
	} finally {
		tokenCardLoading.value = "";
	}
};

const handleFavorite = async (token: AccessToken, value: boolean) => {
	try {
		tokenCardLoading.value = token.id;

		if (props.onFavorite) {
			await props.onFavorite(token, value);

			message.success(t("messages.token_favorite_updated"));
		}
	} catch (error) {
		message.error(t("messages.error"));
	} finally {
		tokenCardLoading.value = "";
	}
};
</script>

<style scoped lang="scss">
:deep(li.n-list-item) {
	padding: 0;

	&:first-of-type {
		margin-top: 0;
	}
	&:last-of-type {
		margin-bottom: 0;
	}
}
</style>

<style lang="scss">
.add-token-card {
	.n-card__content {
		padding: 0 !important;
	}
}
</style>
