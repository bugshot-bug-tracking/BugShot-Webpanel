<template>
	<AssignmentTable :title="$t('company', 2)" :list="companies">
		<template #item="{ item }: { item: Company }">
			<ResourceHeader
				:name="item.attributes.designation"
				:owner="user.id === item.attributes.creator?.id"
			>
				<template #text>
					<b>
						<RouterLink :to="{ name: 'company', params: { id: item.id } }">
							{{ item.attributes.designation }}
						</RouterLink>
					</b>
				</template>

				<template #after-text>
					<RouterLink :to="{ name: 'company-settings', params: { id: item.id } }" ml-a>
						<img
							src="/src/assets/icons/gear.svg"
							alt="settings"
							:title="$t('setting', 2)"
						/>
					</RouterLink>
				</template>
			</ResourceHeader>

			<AssignedToList :list="store.getCompanyProjects(item.id)" @remove="" :type="'Project'">
				<template #header>
					<b>{{ $t("project", 2) }}</b>
				</template>

				<template #text="project: { item: Project }">
					<RouterLink
						:to="{
							name: 'project',
							params: { id: item.id, project_id: project.item.id },
						}"
						:style="{ color: 'white' }"
					>
						{{ project.item.attributes.designation }}
					</RouterLink>
				</template>
			</AssignedToList>
		</template>

		<template #footer>
			<div mx-a w-fit>
				<CompanyCreateModal />
			</div>
		</template>
	</AssignmentTable>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useOrganizationStore } from "~/stores/organization";

import { Company } from "~/models/Company";
import { Project } from "~/models/Project";

const store = useOrganizationStore();
const user = computed(() => useAuthStore().getUser);

const companies = computed(() => store.getCompanies);
</script>

<style scoped></style>
