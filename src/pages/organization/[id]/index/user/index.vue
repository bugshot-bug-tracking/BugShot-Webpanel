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

		<article class="bs-scroll" p-8>
			<UserCard
				w-72
				v-for="member of members"
				:key="member.id"
				:first_name="member.attributes.first_name"
				:last_name="member.attributes.last_name"
				:email="member.attributes.email"
				:to="{name:'organization-user',params:{id:resource!.id,user_id:member.id}}"
			/>
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
});

const store = useOrganizationStore();

const resource = computed(() => store.getOrganization);

const members = computed(() => {
	let users = [...store.getMembers];

	if (store.getCreator) users.unshift(store.getCreator);

	return users;
});
</script>

<style lang="scss" scoped>
article {
	display: flex;
	flex-wrap: wrap;
	max-height: 100%;
	gap: 2rem;
}
</style>

<route lang="yaml">
name: "organization-users"
</route>
