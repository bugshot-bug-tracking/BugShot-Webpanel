<template>
	<AssignmentTable :title="$t('team_members')" :list="members" v-if="user">
		<template #after-title>
			<div ml-a>
				<ManageMembers
					:list="manageableMembers"
					:pending_list="pendingMembers"
					:add="addMember"
					:edit="editMember"
					:delete="deleteMember"
					:deleteInvitation="deleteInvitation"
					:preOpenCall="preCall"
					infoKey="tooltips.organization_roles"
				>
					<template #button="{ loading }">
						<img
							src="/src/assets/icons/gear.svg"
							alt="gear"
							:title="!loading ? $t('manage_members.title') : $t('loading') + '...'"
							w-8
							h-8
							class="manage-button"
							:class="{ loading: loading }"
						/>
					</template>

					<!--

						//TODO make this work and extract ManageMembers into resource specific components so it can be reused in other places; make the button a slot

						<template #extra>
						<div class="w-100 project-select">
							<span>Assign to Company?</span>

							<v-select
								:options="companies"
								:placeholder="'Select Company'"
								:get-option-label="(option) => option.attributes.designation"
								:reduce="(option) => option.id"
								v-model="selectOption"
							>
								<template #open-indicator="{ attributes }">
									<img
										class="black-to-purple"
										style="background-color: unset; width: 1rem; height: 1rem"
										v-bind="attributes"
										src="/src/assets/icons/caret_down.svg"
									/>
								</template>

								<template v-slot:option="option">
									{{ option.attributes.designation }}
								</template>

								<template v-slot:selected-option="option">
									{{ option.attributes.designation }}
								</template>
							</v-select>
						</div>
					</template> -->
				</ManageMembers>
			</div>
		</template>

		<template #item="item: User">
			<UserHeader
				:first_name="item.attributes.first_name"
				:last_name="item.attributes.last_name"
				:email="item.attributes.email"
				py-4
			>
				<template #role-badge>
					<Badge
						v-if="resource.attributes.creator?.id === item.id"
						:text="$t('owner')"
						:preset="'gf'"
					/>

					<Badge
						v-else-if="item.role?.attributes.designation"
						:text="$t('roles.' + item.role?.attributes.designation.toLocaleLowerCase())"
						:preset="'pe'"
					/>
				</template>

				<template #end>
					<RouterLink
						:to="{
							name: 'organization-user',
							params: { id: resource.id, user_id: item.id },
						}"
						class="black-to-purple"
						:style="{ 'font-size': '0.825rem' }"
						v-if="false"
					>
						<img
							src="/src/assets/icons/password_view.svg"
							alt="view"
							:style="{ width: '0.825rem', height: '0.825rem' }"
							mr-1
						/>

						<b>{{ $t("view_details") }}</b>
					</RouterLink>
				</template>
			</UserHeader>

			<AssignedToList
				:list="store.getMemberCompanies(item.id)"
				@remove=""
				:type="'Company'"
				my-2
			/>

			<div flex gap-4 mb-2 style="color: var(--bs-purple)">
				<b>{{ $t("member_plan") }}:</b>

				<div v-if="resource.attributes.creator.id === item.id">
					<div
						flex
						gap-2
						items-center
						v-if="getCreatorSubscription(user.attributes.subscriptions)"
					>
						<img
							src="/src/assets/icons/starter.svg"
							alt=""
							w-5
							h-5
							mr-1
							class="black-to-purple"
						/>
						<p>
							{{ getCreatorSubscription(user.attributes.subscriptions) }}
						</p>
					</div>

					<p v-else-if="hasTrial(user.attributes.trial_end_date)" style="color: #ffc400">
						<b>{{ $t("trial") }}</b>
					</p>

					<p v-else>
						{{ $t("no_plan") }}
					</p>
				</div>

				<div v-else-if="item.subscription">
					<img
						src="/src/assets/icons/starter.svg"
						alt=""
						w-5
						h-5
						mr-1
						class="black-to-purple"
					/>

					{{ getUserSubscriptionName(item.subscription) }}
				</div>

				<div v-else-if="hasTrial(item.attributes.trial_end_date)" style="color: #ffc400">
					<b>{{ $t("trial") }}</b>
				</div>

				<div v-else>
					{{ $t("no_plan") }}
				</div>
			</div>
		</template>
	</AssignmentTable>
</template>

<script setup lang="ts">
import { User } from "~/models/User";

import { useAuthStore } from "~/stores/auth";
import { useOrganizationStore } from "~/stores/organization";
import { usePaymentsStore } from "~/stores/payments";

const store = useOrganizationStore();

const user = computed(() => useAuthStore().getUser);

const resource = computed(() => store.getOrganization!);

const members = computed(() => {
	let users = [...(store.getMembers ?? [])];
	if (store.getCreator) users.unshift(store.getCreator);
	return users;
});

//TODO replace this with members when ManageMember component ignores owner actions
const manageableMembers = computed(() => store.getMembers);

const pendingMembers = computed(() => store.getPendingInvitations);

const preCall = async () => {
	await store.fetchUsers();
	await store.fetchPendingInvitations();
};

const addMember = async (email: string, role_id: number) => {
	await store.sendInvitation({ email, role_id });
};

const deleteInvitation = async (invitation_id: string) => {
	await store.deleteInvitation({ invitation_id });
};

const editMember = async (user_id: number, role_id: number) => {
	await store.editMember({ user_id, role_id });
};

const deleteMember = async (user_id: number) => {
	await store.deleteMember({ user_id });
};

// const companies = computed(() => store.getCompanies);

// const selectOption = ref(null);
const getUserSubscriptionName = (subscription: any) => {
	let product = usePaymentsStore().products.find(
		(p) => p.id === subscription.attributes.stripe_product
	);

	return product?.attributes.name;
};

const hasTrial = (date?: string) => {
	if (date == undefined) return false;

	let now = new Date();
	let then = new Date(date);

	if (then > now) return true;
	else return false;
};

const getCreatorSubscription = (subscriptions: any[]) => {
	console.log(subscriptions);

	if (subscriptions == null || subscriptions.length < 1) return undefined;

	let sub = subscriptions.find(
		(s) =>
			s.subscription.attributes.subscription?.attributes.billable.billing_addressable_id ===
			resource.value.id
	);

	if (sub == undefined) sub = subscriptions[0];

	let product = usePaymentsStore().products.find(
		(p) => p.id === sub.subscription.attributes.stripe_product
	);

	return product?.attributes.name;
};
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
