<template>
	<T2Page>
		<template #header>
			<T2Header>
				<template #l-top>
					{{ $t("company_settings") }}
				</template>

				<template #l-bottom>
					{{ company.attributes.designation }}
				</template>

				<template #center>
					<SearchBar w-160 />
				</template>
			</T2Header>
		</template>

		<article class="bs-scroll" p-8 content-start>
			<div class="component-group" max-w-128>
				<div class="group-header">
					{{ $t("company_settings") }}
				</div>
				<div class="group-content">
					<CompanySettings
						:company_name="company.attributes.designation"
						:organization_name="company.attributes.organization.attributes.designation"
						:image="company.attributes.image?.attributes.base64"
						:color="company.attributes.color_hex"
					/>
				</div>
			</div>

			<div class="component-group" max-w-176 min-w-160>
				<div class="group-header">
					{{ $t("team_members") }}
				</div>

				<div class="group-content">
					<AssignmentTable :title="$t('team_members')" :list="members">
						<template #after-title>
							<div ml-a>
								<ManageMembers
									v-if="isAuthorized"
									:list="store.getMembers"
									:pending_list="pendingMembers"
									:add="addMember"
									:edit="editMember"
									:delete="deleteMember"
									:deleteInvitation="deleteInvitation"
									:preOpenCall="preCall"
									:suggestOptions="suggestOptions"
								>
									<template #button="{ loading }">
										<img
											src="/src/assets/icons/gear.svg"
											alt="gear"
											:title="
												!loading
													? t('manage_members')
													: $t('loading') + '...'
											"
											w-8
											h-8
											class="manage-button"
											:class="{ loading: loading }"
										/>
									</template>
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
										v-if="company.attributes.creator?.id === item.id"
										:text="$t('owner')"
										:preset="'gf'"
									/>

									<Badge
										v-else-if="item.role?.attributes.designation"
										:text="
											$t(
												'roles.' +
													item.role?.attributes.designation.toLocaleLowerCase()
											)
										"
										:preset="'pe'"
									/>
								</template>
							</UserHeader>

							<AssignedToList :list="[]" @remove="" :type="'Project'" />
						</template>
					</AssignmentTable>
				</div>
			</div>

			<div v-if="false" class="component-group" max-w-128 :style="{ 'min-height': 'auto' }">
				<div class="group-header">
					{{ $t("resource_token") }}
				</div>
				<div class="group-content">
					<ResourceToken :type="'Company'" :id="company.id" />
				</div>
			</div>

			<div class="component-group" max-w-128 :style="{ 'min-height': 'auto' }">
				<div class="group-header">
					{{ $t("actions") }}
				</div>
				<div class="group-content">
					<div class="delete-project" flex flex-col gap-2 p-6 py-8>
						<a class="text-to-red" underline @click="deleteModal.open">
							{{ t("delete_company_and_projects") }}?
						</a>

						<p>({{ t("operation_cant_be_reverted") }})</p>
					</div>
				</div>
			</div>
		</article>
	</T2Page>

	<DeleteModal2
		:show="deleteModal.show"
		:header="deleteModal.header"
		:text="deleteModal.text"
		:callback="deleteModal.callback"
		@close="deleteModal.clear"
	/>
</template>

<script setup lang="ts">
import { User } from "~/models/User";
import { useAuthStore } from "~/stores/auth";
import { useCompanyStore } from "~/stores/company";
import { useOrganizationStore } from "~/stores/organization";

const props = defineProps({
	organization_id: {
		type: String,
		required: true,
		description: "Organization ID",
	},

	company_id: {
		required: true,
		type: String,
		description: "Company ID",
	},
});

const { t } = useI18n();
let router = useRouter();

const user = computed(() => useAuthStore().getUser);

const store = useCompanyStore();

const isAuthorized = computed(() => {
	if (!company.value.id) return;

	// temp code replace with proper ?global? logic
	return (
		company.value?.attributes.role?.id === 1 ||
		company.value?.attributes.creator?.id === user.value.id
	);
});

const company = computed(() => store.getCompany!);

const members = computed(() => {
	let users = [...(store.getMembers ?? [])];

	if (store.getCreator) users.unshift(store.getCreator);

	return users;
});

const pendingMembers = computed(() => store.getPendingInvitations);

const preCall = async () => {
	await store.fetchUsers();

	await store.fetchInvitations();
};

const addMember = async (email: string, role_id: number) => {
	await store.sendInvitation({ email, role_id });
};

const editMember = async (user_id: number, role_id: number) => {
	await store.editMember({ user_id, role_id });
};

const deleteMember = async (user_id: number) => {
	await store.deleteMember({ user_id });
};

const deleteInvitation = async (invitation_id: string) => {
	await store.deleteInvitation({ invitation_id });
};

const deleteModal = reactive({
	show: false,
	text: "test",
	header: t("want_to_delete"),
	callback: null as Function | null,
	clear: () => {
		deleteModal.show = false;
		deleteModal.text = "";
		deleteModal.callback = null;
	},

	open: () => {
		deleteModal.text = company.value.attributes.designation;
		deleteModal.callback = async () => {
			await store.deleteResource();

			router.push({
				name: "organization-home",
				params: { organization_id: props.organization_id },
			});
		};
		deleteModal.show = true;
	},
});

const suggestOptions = computed(() => {
	const all = useOrganizationStore().getMembers ?? [];
	const inside = store.getMembers ?? [];

	const diffArray = all.filter((am) => !inside.some((im) => am.id === im.id));

	return diffArray.map((m) => m.attributes.email);
});
</script>

<style lang="scss" scoped>
article {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	max-height: 100%;
	column-gap: 3rem;
}

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

.delete-project {
	background: #fcebeb;
	box-shadow: 0 0.125rem 0.25rem #00000029;
	border: 1px solid #ffbbbb;
	border-radius: 0.5rem;

	a {
		cursor: pointer;

		&:hover {
			font-weight: bold;
			color: #f23838;
		}
	}
}

.component-group {
	min-height: 80vh;
}
</style>

<route lang="yaml">
name: company-settings
</route>
