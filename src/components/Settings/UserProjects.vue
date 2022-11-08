<template>
	<div class="bs-container" style="max-height: 100%">
		<div class="bs-bb" pb4>
			<span flex justify-between style="width: 100%">
				<p font-bold>{{ t("company", 2) }}</p>

				<p class="black-to-gray" style="font-size: 0.875rem">
					<b>{{ t("assigned_to") }}</b> {{ projectsCount }} projects
					for {{ companies.size }} clients
				</p>
			</span>
		</div>

		<ul class="bs-scroll" style="height: 100%">
			<li class="bs-bb" pb4 v-for="[, company] of companies">
				<div class="header">
					<div class="company">
						<div
							class="dot"
							:style="{
								background: company.attributes.color_hex,
							}"
						/>

						<RouterLink
							:to="{
								name: 'company',
								params: { id: company.id },
							}"
						>
							<b>{{ company.attributes.designation }}</b>
						</RouterLink>

						<div
							class="role"
							:class="{
								owner:
									company.attributes.creator?.id === user.id,
							}"
						>
							{{
								company.attributes.creator?.id === user.id
									? "Owner"
									: company.attributes.role?.attributes
											.designation
							}}
						</div>
					</div>

					<a
						class="remove"
						@click="deleteCompany(company)"
						v-if="
							!(company.attributes.creator?.id === user.id) &&
							companyProjects(company.id).length === 0
						"
					>
						<img
							src="/src/assets/icons/delete.svg"
							alt="delete"
							class="black-to-red"
							h-4
						/>
						{{ t("remove_from_this_client") }}
					</a>
				</div>

				<div class="content">
					<span class="black-to-gray">
						<b>{{ t("assigned_to") }}</b>
						({{ companyProjects(company.id).length }}
						{{ t("project", companyProjects(company.id).length) }})
					</span>

					<div my4 gap-2 flex flex-wrap max-w-40vw>
						<div
							class="item"
							v-for="project of companyProjects(company.id)"
						>
							<RouterLink
								:to="{
									name: 'project',
									params: {
										id: company.id,
										project_id: project.id,
									},
								}"
							>
								{{ project.attributes.designation }}
							</RouterLink>

							<img
								src="/src/assets/icons/close_2.svg"
								alt="x"
								class="black-to-white"
								@click="deleteProject(project)"
								v-if="
									project.attributes.creator?.id !== user.id
								"
							/>
						</div>
					</div>
				</div>
			</li>
		</ul>

		<div v-if="false">
			<hr />

			<a class="remove" @click="deleteModal.show = true">
				<img
					src="/src/assets/icons/delete.svg"
					alt="delete"
					class="black-to-red"
					h-4
				/>
				{{ t("remove_from_all_clients_and_projects") }}
			</a>
		</div>
	</div>

	<DeleteModal2
		:show="deleteModal.show"
		:header="deleteModal.header"
		:text="deleteModal.text"
		:callback="deleteModal.callback"
		@close="deleteModal.clear"
	/>
</template>

<script setup lang="ts">
import { Company } from "~/models/Company";
import { Project } from "~/models/Project";
import { useAuthStore } from "~/stores/auth";
import { useMainStore } from "~/stores/main";

const { t } = useI18n();

let store = useMainStore();
let user = computed(() => useAuthStore().getUser);

const companies = computed(() => store.getCompanies);
const companyProjects = (id: string) => store.getCompanyProjects(id);
const projectsCount = computed(() => store.getProjectsCount);

const deleteModal = reactive({
	show: false,
	text: "test",
	header: t("want_to_leave"),
	callback: null,
	clear: () => {
		deleteModal.show = false;
		deleteModal.text = "";
		deleteModal.callback = null;
	},
});

const deleteCompany = async (company: Company) => {
	console.log(company);

	deleteModal.show = true;
	deleteModal.text = company.attributes.designation;
	deleteModal.callback = async () => {
		await store.removeCompanyUser(company.id, user.value.id);
	};
};

const deleteProject = (project: Project) => {
	console.log(project);

	deleteModal.show = true;
	deleteModal.text = project.attributes.designation;
	deleteModal.callback = async () => {
		store.removeProjectUser(project.id, user.value.id);
	};
};
</script>

<style lang="scss" scoped>
a.remove {
	font-size: 0.75rem;
	font-weight: bold;
	display: flex;
	justify-content: end;
	align-content: center;
	margin: 0 1rem;
	cursor: pointer;
	user-select: none;
	gap: 0.25rem;
}

ul {
	list-style: none;
	padding: 1rem 0.75rem;
	margin: unset;
	max-height: 100%;
	overflow: auto;
}

li {
	&:last-of-type {
		border: unset;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin: 1rem 0 0 0;

		> .company {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 0.5rem;
		}
	}

	.content {
		width: 100%;
		text-align: left;

		span {
			font-size: 0.875rem;
		}
	}
}

.item {
	background: #9ba5d7;
	border-radius: 0.25rem;
	padding: 0.25rem 0.5rem;
	color: white;
	white-space: nowrap;
	font-size: 0.75rem;
	width: fit-content;
	display: flex;
	align-items: center;
	gap: 0.25rem;
	cursor: pointer;

	> img {
		width: 1rem;

		&:hover {
			color: #f23838;
			filter: brightness(0) saturate(1) invert(46%) sepia(28%)
				saturate(5216%) hue-rotate(331deg) brightness(87%)
				contrast(121%);
		}
	}

	a {
		color: inherit;

		&:hover {
			color: #1a2040;
			font-weight: bold;
		}
	}
}

.role {
	border: 0.0625rem solid #7a2ee6;
	border-radius: 0.25rem;
	padding: 0.25rem;
	color: #7a2ee6;
	font-weight: bold;
	font-size: 0.75rem;

	&.owner {
		color: #ffffff;
		border: 0.0625rem solid #18d992;
		background-color: #18d992;
		font-weight: normal;
	}
}
</style>
