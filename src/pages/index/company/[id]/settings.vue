<template>
	<T2Page v-if="company.id">
		<template #header>
			<T2Header>
				<template #l-top>
					{{ $t("company_settings") }}
				</template>

				<template #l-bottom>
					{{ company.id ? company.attributes.designation : $t("loading") }}
				</template>
			</T2Header>
		</template>

		<article class="bs-scroll" p-8 content-start>
			<div class="component-group" max-w-128>
				<div class="group-header">
					{{ $t("company_settings") }}
				</div>
				<div class="group-content">
					<CompanyResourceSettings
						:company_name="company.attributes.designation"
						:organization_name="''"
						:image="company.attributes.image?.attributes.base64"
						:color="company.attributes.color_hex"
						:editFunction="editCompany"
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
									:list="store.getUsers"
									:pending_list="pendingMembers"
									:add="addMember"
									:edit="editMember"
									:delete="deleteMember"
									:deleteInvitation="deleteInvitation"
									:preOpenCall="preCall"
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

						<template #item="{ item }: { item: User }">
							<UserHeader
								:first_name="item.attributes.first_name"
								:last_name="item.attributes.last_name"
								:email="item.attributes.email"
								:role_text="item.role?.attributes.designation"
								:owner="company.attributes.creator?.id === item.id"
								py-4
								:removable="false"
								:current_user="user.id === item.id"
							/>

							<AssignedToList :list="bugs" @remove="" :type="'Project'" />
						</template>
					</AssignmentTable>
				</div>
			</div>

			<div class="component-group" max-w-128 v-if="false">
				<div class="group-header">
					{{ $t("resource_token") }}
				</div>
				<div class="group-content">
					<span>token</span>
				</div>
			</div>

			<div class="component-group" max-w-128>
				<div class="group-header">
					{{ $t("actions") }}
				</div>
				<div class="group-content">
					<div class="delete-project" flex flex-col gap-2 p-6 py-8>
						<a class="text-to-red" underline @click="openDelete">
							{{ t("delete_company_and_projects") }}?
						</a>

						<p>({{ t("operation_cant_be_reverted") }})</p>
					</div>
				</div>
			</div>
		</article>
	</T2Page>

	<DeleteModal
		v-if="deleteAction.visible"
		:text="deleteAction.text"
		:callback="deleteAction.execute"
		@close="deleteAction.reset"
	/>
</template>

<script setup lang="ts">
import { User } from "~/models/User";
import { useAuthStore } from "~/stores/auth";
import { useCompanyStore } from "~/stores/company";

const props = defineProps({
	id: {
		required: true,
		type: String,
		description: "Company ID",
	},
});

const { t } = useI18n();
let router = useRouter();

const user = computed(() => useAuthStore().getUser);

const store = useCompanyStore();

store.init(props.id);

watch(
	props,
	() => {
		store.init(props.id);
	},
	{ deep: true }
);

const isAuthorized = computed(() => {
	if (!company.value.id) return;

	// temp code replace with proper ?global? logic
	return (
		company.value?.attributes.role?.id === 1 ||
		company.value?.attributes.creator?.id === user.value.id
	);
});

const company = computed(() => store.getCompany);

const members = computed(() => {
	let users = [...store.getUsers];

	if (store.getCreator) users.unshift(store.getCreator);

	return users;
});

const pendingMembers = computed(() => {
	return store.getPendingInvitations;
});

const bugs = computed(() => {
	// const st = store.getFirstStatus;

	// let b = store.getBugsByStatusId(st?.id);
	// return b ?? [];
	return [];
});

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

const editCompany = async (data: { designation: string; color_hex: string; base64: string }) => {
	await store.updateCompany(data);
};

const deleteAction = reactive({
	visible: false,
	text: "",
	execute: () => {},
	reset: () => {
		deleteAction.visible = false;
		deleteAction.text = "";
		deleteAction.execute = () => {};
	},
});

const openDelete = () => {
	deleteAction.text = company.value.attributes.designation;
	deleteAction.execute = async () => {
		await store.deleteCompany();

		router.push({
			name: "home",
		});
	};
	deleteAction.visible = true;
};
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
