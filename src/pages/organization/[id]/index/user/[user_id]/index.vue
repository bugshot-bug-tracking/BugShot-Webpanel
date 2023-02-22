<template>
	<T2Page>
		<template #header>
			<T2Header>
				<template #l-top>
					{{ $t("team_members") }}
				</template>

				<template #l-bottom>
					{{ resource!.attributes.designation }}
				</template>
			</T2Header>
		</template>

		<article class="bs-scroll" p-8 v-if="member">
			<div class="component-group" max-w-128>
				<div class="group-header">
					{{ $t("profile") }}
				</div>

				<div class="group-content">
					<UserProfileCard
						:first_name="member.attributes.first_name"
						:last_name="member.attributes.last_name"
						:email="member.attributes.email"
						:created_at="new Date().toISOString()"
					/>
				</div>
			</div>

			<div class="component-group" max-w-128 max-h-80vh w-120>
				<div class="group-header">
					{{ $t("companies_projects_for_member") }}
				</div>

				<div class="group-content">
					<OrganizationUserCompaniesTable />
				</div>
			</div>
		</article>
	</T2Page>
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";

defineProps({
	id: {
		type: String,
		required: true,
		description: "Organization ID",
	},

	user_id: {
		// needs to be cast to Number because router sends as String
		type: String,
		required: true,
		description: "User ID",
	},
});

const store = useOrganizationStore();

const resource = computed(() => store.getOrganization);

const member = computed(() => store.member?.user);
</script>

<style lang="scss" scoped>
article {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	max-height: 100%;
	column-gap: 3rem;
	align-content: flex-start;
	height: 100%;
	width: 100%;
}
</style>

<route lang="yaml">
name: "organization-user"
</route>
