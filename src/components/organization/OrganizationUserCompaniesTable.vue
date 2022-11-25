<template>
	<AssignmentTable :title="$t('company', 2)" :list="companies">
		<template #title>
			<span class="black-to-gray">{{ $t("organization") }}:</span>
			{{ organization?.attributes.designation }}
		</template>

		<template #item="{ item }: { item: Company }">
			<ResourceHeader
				:name="item.attributes.designation"
				:owner="user?.id === item.attributes.creator?.id"
			>
				<template #text>
					<b>
						<RouterLink :to="{ name: 'company', params: { id: item.id } }">
							{{ item.attributes.designation }}
						</RouterLink>
					</b>
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
	</AssignmentTable>
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";

import { Company } from "~/models/Company";
import { Project } from "~/models/Project";

const props = defineProps({
	user_id: {
		required: true,
		type: Number,
	},
});

const store = useOrganizationStore();

const organization = computed(() => store.getOrganization);

const user = computed(() => store.getOrganizationMember(props.user_id));

const companies = computed(() => store.getCompanies);
</script>

<style scoped></style>
