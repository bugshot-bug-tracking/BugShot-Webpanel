<template>
	<AssignmentTable :title="$t('company', 2)" :list="companies">
		<template #title>
			<span class="black-to-gray">{{ $t("organization") }}:</span>
			{{ organization.attributes.designation }}
		</template>

		<template #item="item: Company">
			<ResourceHeader
				:name="item.attributes.designation"
				:owner="member.user.id === item.attributes.creator?.id"
				:color="item.attributes.color_hex"
			>
				<template #text>
					<b>
						<RouterLink
							:to="{
								name: 'company',
								params: { organization_id: organization.id, company_id: item.id },
							}"
						>
							{{ item.attributes.designation }}
						</RouterLink>
					</b>
				</template>
			</ResourceHeader>

			<AssignedToList :list="projects(item.id)" @remove="" :type="'Project'">
				<template #header>
					<b>{{ $t("project", 2) }}</b>
				</template>

				<template #text="project: { item: Project }">
					<RouterLink
						:to="{
							name: 'project',
							params: {
								organization_id: organization.id,
								company_id: item.id,
								project_id: project.item.id,
							},
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

const store = useOrganizationStore();

const organization = computed(() => store.getOrganization!);

const member = computed(() => store.member!);

const companies = computed(() => member.value.attributes?.companies);

const projects = (company_id: string) =>
	member.value.attributes?.companies.find((x) => x.id === company_id)?.attributes.projects;
</script>
