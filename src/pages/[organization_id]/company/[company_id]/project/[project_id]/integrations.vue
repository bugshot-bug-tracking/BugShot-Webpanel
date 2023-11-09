<template>
	<T2Page>
		<template #header>
			<T3Header>
				<template #l-top>
					<a :href="project.attributes.url" target="_blank">
						{{ project.attributes.designation }}

						<img
							src="/src/assets/icons/external-link.svg"
							alt="external"
							w-3
							v-if="project.attributes.url"
						/>
					</a>
				</template>

				<template #l-bottom>
					{{ project.attributes.company.attributes.designation }}
				</template>

				<template #center>
					<SearchBar />
				</template>
			</T3Header>
		</template>

		<TrialBanner mb-0 />

		<n-layout>
			<n-layout position="absolute" has-sider>
				<n-layout-sider content-style="padding: 1.5rem;" :native-scrollbar="false" bordered>
					<n-list hoverable clickable>
						<n-list-item
							:class="{ active: activeIntegration === 'jira' }"
							@click="selectIntegration('jira')"
						>
							<n-button text gap-2 strong>
								<template #icon>
									<Icon-Jira />
								</template>

								{{ t("project_integrations.jira.button") }}
							</n-button>
						</n-list-item>
					</n-list>
				</n-layout-sider>

				<n-layout
					content-style="padding: 1.5rem; display: flex; height: 100%;"
					:native-scrollbar="false"
				>
					<Jira v-if="activeIntegration === 'jira'" :configurable="store.getJiraState" />
				</n-layout>
			</n-layout>
		</n-layout>
	</T2Page>
</template>

<script setup lang="ts">
import { useProjectStore } from "~/stores/project";

defineProps({
	organization_id: {
		type: String,
		required: true,
		description: "Organization ID",
	},

	company_id: {
		type: String,
		required: true,
		description: "Company ID",
	},

	project_id: {
		type: String,
		required: true,
		description: "Project ID",
	},
});

const { t } = useI18n();

const store = useProjectStore();

const project = computed(() => store.getProject!);

const activeIntegration = ref<undefined | "jira">(undefined);

const integrationLoading = ref(false);

const selectIntegration = async (value: undefined | "jira") => {
	try {
		switch (value) {
			case "jira":
				if (store.getJiraState) {
					integrationLoading.value = true;
					// do the init
				}
				activeIntegration.value = "jira";

				break;

			default:
				break;
		}
	} catch (error) {
		console.log(error);
	} finally {
		integrationLoading.value = false;
	}
};
</script>

<style lang="scss" scoped>
:deep(.n-list-item) {
	--n-merged-color-hover: var(--bs-purple-light);
}

.active {
	background-color: var(--bs-green-light);

	&:hover {
		--n-merged-color-hover: var(--bs-green-light);
	}
}
</style>

<route lang="yaml">
name: project-integrations
</route>
