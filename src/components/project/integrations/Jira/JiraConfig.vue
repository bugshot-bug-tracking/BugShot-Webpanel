<template>
	<div flex-1 flex flex-col gap-4 max-w-82ch>
		<div flex flex-col gap-4>
			<n-form-item
				:label="t('project_integrations.jira.config.label.jira_site')"
				required
				:show-feedback="false"
			>
				<n-select
					v-model:value="siteSelect.value"
					:placeholder="t('project_integrations.jira.config.site_select_placeholder')"
					:options="siteSelect.options"
					:loading="siteSelect.loading"
					filterable
					clearable
					@clear="siteSelect.onClear"
					@update:value="siteSelect.onSelect"
					@focus="siteSelect.onFocus"
					text-left
				/>
			</n-form-item>

			<n-tooltip :overlap="true" trigger="hover" :disabled="isProjectSelectActive">
				<template #trigger>
					<n-form-item
						:label="t('project_integrations.jira.config.label.jira_project')"
						required
						:show-feedback="false"
						:class="{ disabled: !isProjectSelectActive }"
					>
						<n-select
							:disabled="!isProjectSelectActive"
							v-model:value="projectSelect.value"
							:placeholder="
								t('project_integrations.jira.config.project_select_placeholder')
							"
							:options="projectSelect.options"
							:loading="projectSelect.loading"
							filterable
							clearable
							remote
							@search="projectSelect.onSearch"
							@clear="projectSelect.onClear"
							@update:value="projectSelect.onSelect"
							@focus="projectSelect.onSearch('')"
							text-left
						/>
					</n-form-item>
				</template>

				{{ t("project_integrations.jira.config.please_select_site_first") }}
			</n-tooltip>
		</div>

		<hr h-1px mt-4 />

		<div flex flex-col gap-4 text-left :class="{ disabled: !areOptionsAvailable }">
			<n-tooltip :overlap="true" trigger="hover" :disabled="areOptionsAvailable">
				<template #trigger>
					<n-list>
						<n-list-item v-for="item in switches" :key="item.key">
							<div flex-1 flex gap-4 justify-between items-center py-2>
								<div flex flex-col items-start>
									<n-text strong mb-1>
										{{ item.text_header }}
									</n-text>
									<n-text class="text-3.5">
										{{ item.text_description }}
									</n-text>
								</div>

								<n-switch
									:disabled="!areOptionsAvailable || item.loading"
									class="n-switch-on-off"
									v-model:value="item.value"
									:loading="item.loading"
									@update:value="handleSwitchChange($event, item.name)"
								/>
							</div>
						</n-list-item>
					</n-list>
				</template>

				{{ t("project_integrations.jira.config.please_select_project") }}
			</n-tooltip>
		</div>
	</div>
</template>

<script setup lang="ts">
import { SelectOption } from "naive-ui";
import { useJiraStore } from "~/stores/integrations/jira";

const { t } = useI18n();

defineProps({
	loading: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const emit = defineEmits(["update:loading"]);

const store = useJiraStore();

onMounted(async () => {
	emit("update:loading", true);
	try {
		await store.init();

		if (store.getActiveSite) {
			siteSelect.options.push(store.getActiveSite);
			siteSelect.value = store.getActiveSite.value;

			if (store.getActiveProject) {
				projectSelect.options.push(store.getActiveProject);
				projectSelect.value = store.getActiveProject.value;
			}
		}

		if (store.getActiveSettings) {
			let activeSettings = store.getActiveSettings;
			for (let key in switches) {
				if (activeSettings.hasOwnProperty(key)) {
					switches[key].value = activeSettings[key];
				}
			}
		}
	} catch (error) {
		console.log(error);
	} finally {
		emit("update:loading", false);
	}
});

const siteSelect = reactive({
	value: undefined as string | undefined,
	options: [] as SelectOption[],
	loading: false,

	onFocus: useDebounceFn(async () => {
		try {
			siteSelect.loading = true;

			let response = await store.getSites();

			siteSelect.options = response?.map((site: any) => ({
				label: site.name,
				value: site.id,
				url: site.url,
			}));
		} catch (error) {
			console.log(error);
		} finally {
			siteSelect.loading = false;
		}
	}, 250),

	onSelect: async (value, option) => {
		console.log(value, option);

		// this is a clear event if both the value and option is undefined and should not be handled here
		if (value == undefined || option == undefined) return;

		try {
			siteSelect.loading = true;

			await store.setSite({ id: option.value, name: option.label, url: option.url });
		} catch (error) {
			console.log(error);
		} finally {
			siteSelect.loading = false;
		}
	},

	onClear: async () => {
		try {
			siteSelect.loading = true;

			await store.deleteSite();

			projectSelect.value = "";
		} catch (error) {
			console.log(error);
		} finally {
			siteSelect.loading = false;
		}
	},
});

// this is to treat the case where a site is not selected and a fetch of projects is impossible because of a missing site_id
const isProjectSelectActive = computed(
	() => !(siteSelect.value == undefined || siteSelect.value == "")
);

const projectSelect = reactive({
	value: undefined as string | undefined,
	options: [] as SelectOption[],
	loading: false,

	onSearch: useDebounceFn(async (value: string) => {
		try {
			projectSelect.loading = true;

			let response = await store.getProjects({ query: value });

			projectSelect.options = response?.values?.map((project: any) => ({
				label: project.name,
				value: project.id,
				key: project.key,
			}));
		} catch (error) {
			console.log(error);
		} finally {
			projectSelect.loading = false;
		}
	}, 750),

	onSelect: async (value, option) => {
		console.log(value, option);

		// this is a clear event if both the value and option is undefined and should not be handled here
		if (value == undefined || option == undefined) return;

		try {
			projectSelect.loading = true;

			await store.setProject({ id: option.value, name: option.label, key: option.key });
		} catch (error) {
			console.log(error);
		} finally {
			projectSelect.loading = false;
		}
	},

	onClear: async () => {
		try {
			projectSelect.loading = true;

			await store.deleteProject();
		} catch (error) {
			console.log(error);
		} finally {
			projectSelect.loading = false;
		}
	},
});

const areOptionsAvailable = computed(
	() =>
		isProjectSelectActive.value && projectSelect.value != undefined && projectSelect.value != ""
);

const switches = reactive({
	syncBugsTo: {
		value: false,
		loading: false,
		name: "syncBugsTo",
		key: "sync_bugs_to_jira",
		text_header: t("project_integrations.jira.config.options.bugs_to_jira.header"),
		text_description: t("project_integrations.jira.config.options.bugs_to_jira.description"),
	},
	// syncBugsFrom: {
	// 	value: false,
	// 	loading: false,
	// 	name: "syncBugsFrom",
	// 	key: "sync_bugs_from_jira",
	// 	text_header: t("project_integrations.jira.config.options.bugs_from_jira.header"),
	// 	text_description: t("project_integrations.jira.config.options.bugs_from_jira.description"),
	// },
	syncCommentsTo: {
		value: false,
		loading: false,
		name: "syncCommentsTo",
		key: "sync_comments_to_jira",
		text_header: t("project_integrations.jira.config.options.comments_to_jira.header"),
		text_description: t(
			"project_integrations.jira.config.options.comments_to_jira.description"
		),
	},
	syncCommentsFrom: {
		value: false,
		loading: false,
		name: "syncCommentsFrom",
		key: "sync_comments_from_jira",
		text_header: t("project_integrations.jira.config.options.comments_from_jira.header"),
		text_description: t(
			"project_integrations.jira.config.options.comments_from_jira.description"
		),
	},
	// updateStatusTo: {
	// 	value: false,
	// 	loading: false,
	// 	name: "updateStatusTo",
	// 	key: "update_status_to_jira",
	// 	text_header: t("project_integrations.jira.config.options.update_status_to.header"),
	// 	text_description: t("project_integrations.jira.config.options.update_status_to.description"),
	// },
	updateStatusFrom: {
		value: false,
		loading: false,
		name: "updateStatusFrom",
		key: "update_status_from_jira",
		text_header: t("project_integrations.jira.config.options.update_status_from.header"),
		text_description: t(
			"project_integrations.jira.config.options.update_status_from.description"
		),
	},
});

const handleSwitchChange = async (value: boolean, option: keyof typeof switches) => {
	console.log(value, option);

	switches[option].loading = true;

	switches[option].value = (
		await store.setSetting({ [switches[option].key]: value ? true : false })
	)[switches[option].key];

	switches[option].loading = false;
};
</script>

<style scoped lang="scss"></style>
