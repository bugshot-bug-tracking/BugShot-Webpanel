<template>
	<T2Page>
		<template #header>
			<T3Header>
				<template #l-top>
					{{ $t("project_settings") }}
				</template>

				<template #l-bottom>
					{{ project.attributes.designation }}
				</template>

				<template #center>
					<SearchBar />
				</template>
			</T3Header>
		</template>

		<article class="bs-scroll" p-8 content-start>
			<div class="component-group" max-w-128>
				<div class="group-header">
					{{ $t("project_settings") }}
				</div>
				<div class="group-content">
					<ProjectSettings
						:project_name="project.attributes.designation"
						:company_name="project.attributes.company.attributes.designation"
						:url="project.attributes.url ?? ''"
						:image="project.attributes.image?.attributes.base64"
						:color="project.attributes.color_hex"
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
									:list="manageableMembers"
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
										v-if="project.attributes.creator?.id === item.id"
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

							<AssignedToList :list="[]" @remove="" :type="'Bug'" />
						</template>
					</AssignmentTable>
				</div>
			</div>

			<div class="component-group" max-w-128 :style="{ 'min-height': 'auto' }">
				<div class="group-header">
					{{ $t("resource_token") }}
				</div>
				<div class="group-content">
					<ResourceToken :type="'Project'" :id="project.id" />
				</div>
			</div>

			<div class="component-group" max-w-128 :style="{ 'min-height': 'auto' }">
				<div class="group-header">
					{{ $t("actions") }}
				</div>
				<div class="group-content">
					<div class="delete-project" flex flex-col gap-2 p-6 py-8>
						<a class="text-to-red" underline @click="deleteModal.open">
							{{ t("delete_project_and_bugs") }}?
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
import { useProjectStore } from "~/stores/project";

const props = defineProps({
	organization_id: {
		type: String,
		required: true,
		description: "Organization ID",
	},

	company_id: {
		type: String,
		required: true,
		description: "Company ID",
	},

	project_id: {
		type: String,
		required: true,
		description: "Project ID",
	},
});

const { t } = useI18n();
let router = useRouter();

const user = computed(() => useAuthStore().getUser);

const store = useProjectStore();

const project = computed(() => store.getProject!);

const isAuthorized = computed(() => {
	// temp code replace with proper ?global? logic
	return (
		project.value?.attributes.role?.id === 1 ||
		project.value?.attributes.creator?.id === user.value.id ||
		useCompanyStore().getCompany!.attributes.role?.id === 1
	);
});

const members = computed(() => {
	let users = [...(store.getMembers ?? [])];

	if (store.getCreator) users.unshift(store.getCreator);

	return users;
});

const preCall = async () => {
	await store.fetchUsers();

	await store.fetchInvitations();
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
		deleteModal.text = project.value.attributes.designation;
		deleteModal.callback = async () => {
			await store.deleteResource();

			router.push({
				name: "company",
				params: {
					organization_id: props.organization_id,
					company_id: props.company_id,
				},
			});
		};
		deleteModal.show = true;
	},
});

//TODO replace this with members when ManageMember component ignores owner actions
const manageableMembers = computed(() => store.getMembers);

const pendingMembers = computed(() => store.getPendingInvitations);

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
name: project-settings
</route>
