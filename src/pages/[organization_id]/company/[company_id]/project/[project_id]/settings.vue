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

		<article p-8 content-start>
			<div class="component-group">
				<div class="group-header">
					{{ $t("project_settings") }}
				</div>
				<div class="group-content">
					<ProjectSettings
						:project_name="project.attributes.designation"
						:company_name="project.attributes.company.attributes.designation"
						:url="project.attributes.url ?? ''"
						:extra_urls="store.extra_urls ?? []"
						:image="project.attributes.image?.attributes.url"
						:color="project.attributes.color_hex"
					/>
				</div>
			</div>

			<div class="component-group">
				<div class="group-header">
					{{ $t("team_members") }}
				</div>

				<div class="group-content">
					<AssignmentTable :title="$t('team_members')" :list="store.getMembers">
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
									infoKey="tooltips.project_roles"
								>
									<template #button="{ loading }">
										<div class="manage-button" :class="{ loading: loading }">
											<Icon-Settings
												size="1.5rem"
												:title="$t('setting', 2)"
												vertical-middle
											/>
										</div>
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

			<div>
				<div class="component-group">
					<div class="group-header">
						{{ $t("project_page.settings.guest_token") }}
					</div>

					<div class="group-content">
						<GuestToken />
					</div>
				</div>

				<div class="component-group">
					<div class="group-header">
						{{ $t("resource_token") }}
					</div>
					<div class="group-content">
						<ResourceToken :type="'Project'" :id="project.id" />
					</div>
				</div>

				<div class="component-group">
					<div class="group-header">
						{{ $t("actions") }}
					</div>
					<div class="group-content">
						<div class="delete-project" flex flex-col gap-2 p-6 py-8>
							<a style="color: var(--bs-red)" underline @click="deleteModal.open">
								{{ t("delete_project_and_bugs") }}?
							</a>

							<p>({{ t("operation_cant_be_reverted") }})</p>
						</div>
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
		project.value?.attributes.creator?.id === user.value?.id ||
		useCompanyStore().getCompany!.attributes.role?.id === 1
	);
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
	callback: undefined as Function | undefined,
	clear: () => {
		deleteModal.show = false;
		deleteModal.text = "";
		deleteModal.callback = undefined;
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

const pendingMembers = computed(() => store.getPendingInvitations);

const suggestOptions = computed(() => {
	const allMembers = store.getAssignableMembers;
	const insideMemberIds = store.getMembers.map((member) => member.id);

	const difference = allMembers.filter((allMember) => !insideMemberIds.includes(allMember.id));

	return difference.map((member) => member.attributes.email);
});
</script>

<style lang="scss" scoped>
article {
	display: grid;
	grid-template-columns: 32rem minmax(40rem, 60rem) 32rem;
	grid-auto-flow: dense;
	padding: 2.5rem;
	padding-right: 1.5rem;
	gap: 3rem;
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
</style>

<route lang="yaml">
name: project-settings
</route>
