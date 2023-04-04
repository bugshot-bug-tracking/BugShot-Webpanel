<template>
	<AssignmentTable :title="$t('company', 2)" :list="companies">
		<template #after-title>
			<InfoPopover :message="$t('tooltips.company')" ml-2 />
		</template>

		<template #item="item: Company">
			<ResourceHeader
				:name="item.attributes.designation"
				:owner="user?.id === item.attributes.creator?.id"
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

				<template #after-text>
					<RouterLink
						:to="{
							name: 'company-settings',
							params: { organization_id: organization.id, company_id: item.id },
						}"
						ml-a
					>
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

		<template #footer>
			<div mx-a w-fit>
				<n-popover trigger="hover" :disabled="userHasSubscriptionOrTrial">
					<template #trigger>
						<div>
							<CompanyCreateModal :disabled="!userHasSubscriptionOrTrial" />
						</div>
					</template>

					<n-text type="warning">
						<i18n-t keypath="unauthorized_without_license_or_trial" scope="global">
							<RouterLink
								:to="{
									name: 'organization-payments',
									params: { id: organization.id },
								}"
							>
								<n-text type="info" underline>
									{{ $t("unauthorized_without_license_or_trial_0") }}
								</n-text>
							</RouterLink>
						</i18n-t>
					</n-text>
				</n-popover>
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

const organization = computed(() => store.getOrganization!);

const userHasSubscriptionOrTrial = computed(() => {
	return (
		user.value?.attributes?.subscriptions?.length > 0 ||
		hasTrial(user.value?.attributes.trial_end_date)
	);
});

const hasTrial = (date?: string) => {
	if (date == undefined) return false;

	let now = new Date();
	let then = new Date(date);

	if (then > now) return true;
	else return false;
};
</script>
