<template>
	<div
		v-if="loading && configurable"
		class="absolute inset-0 z-1 flex items-center justify-center"
		style="background: rgb(255 255 255 / 50%); cursor: wait"
	>
		<img src="/src/assets/animations/loading.svg" alt="loading circle" />
	</div>

	<div flex-1 flex flex-col>
		<div class="flex justify-between items-center p-4 gap-4 bs-bb">
			<div flex gap-6 items-start text-start>
				<Icon-Jira size="3rem" my-a />

				<div>
					<n-h3 m-0 mb-1> {{ t("project_integrations.jira.header") }}</n-h3>
					<n-text class="text-3.5" style="color: var(--bs-gray)">
						{{ t("project_integrations.jira.subheader") }}
					</n-text>
				</div>
			</div>

			<n-button v-if="!configurable" type="primary" size="large" @click="store.connect">
				{{ t("project_integrations.connect") }}
			</n-button>

			<n-popconfirm
				v-else
				@positive-click="disconnect"
				:positive-button-props="{
					type: 'error',
					disabled: disconnectLoading,
					loading: disconnectLoading,
				}"
				:negative-button-props="{ disabled: disconnectLoading }"
			>
				{{ t("project_integrations.jira.disconnect") }}

				<template #trigger>
					<n-button type="error" size="large" :disabled="disconnectLoading">
						{{ t("project_integrations.disconnect") }}
					</n-button>
				</template>
			</n-popconfirm>
		</div>

		<n-scrollbar>
			<n-tabs type="bar" animated pane-wrapper-class="mt-2" v-model:value="activeTab" p-4>
				<n-tab-pane name="overview" :tab="t('project_integrations.overview')">
					<div flex flex-col text-left>
						<n-text>
							{{ t("project_integrations.jira.overview.line_1") }}
						</n-text>

						<n-text mt-4>
							{{ t("project_integrations.jira.overview.list_header") }}
						</n-text>

						<n-ol list-decimal>
							<n-li>
								<n-text>
									{{ t("project_integrations.jira.overview.list_item_1") }}
								</n-text>
							</n-li>

							<n-li>
								<n-text>
									{{ t("project_integrations.jira.overview.list_item_2") }}
								</n-text>
							</n-li>

							<n-li>
								<n-text>
									{{ t("project_integrations.jira.overview.list_item_3") }}
								</n-text>
							</n-li>

							<n-li>
								<n-text>
									{{ t("project_integrations.jira.overview.list_item_4") }}
								</n-text>
							</n-li>

							<n-li>
								<n-text>
									{{ t("project_integrations.jira.overview.list_item_5") }}
								</n-text>
							</n-li>
						</n-ol>
					</div>
				</n-tab-pane>

				<n-tab-pane
					name="config"
					:tab="t('project_integrations.configurations')"
					:disabled="!configurable"
					display-directive="if"
				>
					<JiraConfig v-model:loading="loading" />
				</n-tab-pane>
			</n-tabs>
		</n-scrollbar>
	</div>
</template>

<script setup lang="ts">
import { useJiraStore } from "~/stores/integrations/jira";

const { t } = useI18n();

const props = defineProps({
	configurable: {
		type: Boolean,
		default: false,
		description: "Is the configuration tab available?",
	},
});

const store = useJiraStore();

const configurable = ref(props.configurable);
const activeTab = ref<"overview" | "config">("overview");

watch(
	() => props.configurable,
	(newVal) => {
		configurable.value = newVal;
		activeTab.value = newVal ? "config" : "overview";
	}
);

onMounted(() => {
	activeTab.value = configurable.value ? "config" : "overview";
});

const loading = ref(false);

const disconnectLoading = ref(false);
const disconnect = async () => {
	try {
		disconnectLoading.value = true;

		await store.disconnect();
	} catch (error) {
		console.log(error);
	} finally {
		disconnectLoading.value = false;
	}
};
</script>

<style scoped lang="scss">
:deep(.n-list) {
	background: transparent;
}
:deep(.n-form-item-blank) {
	gap: 1rem;
}

span {
	max-width: 66ch;
}
</style>
