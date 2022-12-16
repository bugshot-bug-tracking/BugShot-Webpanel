<template>
	<AssignmentTable :title="$t('team_members')" :list="members">
		<template #item="item: User">
			<UserHeader
				:first_name="item.attributes.first_name"
				:last_name="item.attributes.last_name"
				:email="item.attributes.email"
				py-4
			>
				<template #plan-badge>
					<Badge
						:text="item.subscription?.attributes?.designation"
						:preset="item.subscription?.attributes?.type === 'month' ? 'pf' : 'gf'"
						:noText="$t('no_plan')"
					>
						<template #image>
							<img
								v-if="item.subscription?.attributes?.image"
								class="black-to-white"
								h-4
								:src="item.subscription.attributes.image"
							/>
						</template>
					</Badge>
				</template>

				<template #end>
					<img
						class="black-to-purple"
						src="/src/assets/icons/gear.svg"
						alt=""
						cursor-pointer
					/>
				</template>
			</UserHeader>
		</template>
	</AssignmentTable>
</template>

<script setup lang="ts">
import { User } from "~/models/User";

import { useOrganizationStore } from "~/stores/organization";

const store = useOrganizationStore();

const members = computed(() => {
	let users = [...(store.getMembers ?? [])];
	if (store.getCreator) users.unshift(store.getCreator);

	//! just for testing

	users = users.map((x) => {
		x.subscription = plans[x.id % 3];
		return x;
	});

	//!------------------

	return users;
});

//! vvv just for testing vvv

const plans = [
	{
		id: "1",
		attributes: {
			designation: "Plan #1",
			quantity: 10,
			price: 110,
			type: "month",
			image: "/src/assets/icons/starter.svg",
		},
	},
	{
		id: "2",
		attributes: {
			designation: "Plan #2",
			quantity: 6,
			price: 120,
			type: "year",
			image: "/src/assets/icons/premium.svg",
		},
	},
	undefined,
];
//!------------------
</script>

<style lang="scss" scoped>
.manage-button {
	cursor: pointer;

	&.loading {
		cursor: default;
		opacity: 0.5 !important;

		animation: spin 4s linear infinite;

		@keyframes spin {
			100% {
				-webkit-transform: rotate(360deg);
				transform: rotate(360deg);
			}
		}
	}
}
</style>
