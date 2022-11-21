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
		</article>
	</T2Page>
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";

const props = defineProps({
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

const member = computed(() => store.getOrganizationMember(parseInt(props.user_id)));
</script>

<route lang="yaml">
name: "organization-user"
</route>
