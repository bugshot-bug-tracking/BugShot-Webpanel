<template>
	<div class="sidebar">
		<h3>{{ $t("company", 2) }}</h3>

		<!-- <div class="search">
			<Search />
		</div> -->

		<div class="companies c-scroll s-purple">
			<ul>
				<li v-for="[, company] of companies" :key="company.id">
					<div class="company">
						<router-link
							@click="linkOpen"
							:to="{
								name: 'CompanyProjects',
								params: { id: company.id },
							}"
						>
							{{ company.attributes.designation }}
						</router-link>

						<img
							src="@/assets/icons/icn_left_arrow.svg"
							v-if="company.projects?.length > 0"
							@click="collapse"
						/>
					</div>

					<ul v-if="company.projects?.length > 0" class="proj-list">
						<router-link
							@change="clg"
							v-for="project of companyProjects(company.id)"
							:key="project.id"
							class="project"
							:to="{
								name: 'Project',
								params: { id: project.id },
							}"
						>
							<div
								class="dot"
								:style="{
									'background-color': project.attributes
										.color_hex
										? project.attributes.color_hex
										: '#7a2de6',
								}"
							/>

							{{ project.attributes.designation }}
						</router-link>
					</ul>
				</li>
			</ul>
		</div>

		<div class="add-company">
			<CreateDataModal :dataType="'Company'" :postPath="'companies'" />
		</div>
	</div>
</template>

<script>
import { computed } from "@vue/runtime-core";
import Search from "../../../components/Search.vue";
import store from "../../../store";
import CreateDataModal from "../../../components/CreateDataModal.vue";

export default {
	components: { Search, CreateDataModal },
	name: "CompanySidebar",
	setup() {
		const companies = computed(() => {
			return store.getters.getCompanies;
		});

		const companyProjects = (company_id) => {
			return store.getters.getCompanyProjects(company_id);
		};

		const collapse = (event) => {
			if (event.target.parentNode.classList.contains("open")) {
				event.target.parentNode.classList.remove("open");
			} else {
				event.target.parentNode.classList.add("open");
			}
		};

		const linkOpen = (event) => {
			event.target.parentNode.classList.add("open");
		};

		const clg = (event) => {
			console.log(event);
		};
		return {
			companies,
			companyProjects,
			collapse,
			linkOpen,
			clg,
		};
	},
};
</script>

<style lang="scss" scoped>
.sidebar {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;

	> h3:first-child {
		padding: 20px;
		text-align: left;
	}
	> .search {
		margin: 15px 5px;
	}

	.companies {
		padding: 10px 0px 10px 10px;
		font-size: 16px;
		border-top: 1px solid #ede4fc;
		overflow: auto;
		height: 100%;

		ul {
			list-style-type: none;
			padding: 0;
			text-align: left;
			display: flex;
			flex-direction: column;

			> li {
				padding: 4px 4px 8px 4px;
			}
		}

		a {
			text-decoration: none;
			color: black;
		}

		.company {
			display: flex;
			justify-content: space-between;
			font-weight: 600;
			margin-bottom: 4px;
			padding: 6px;

			&:hover {
				background-color: hsl(263, 79%, 94%);
				width: 100%;
				border-radius: 6px;
			}

			> img {
				transform: rotateZ(-90deg);
				cursor: pointer;
				transition: 0.3s;
				user-select: none;
			}

			&.open {
				> img {
					transform: rotateZ(90deg);
				}
			}

			> a.router-link-exact-active {
				color: #7a2de6;
			}
		}

		.company.open + .proj-list {
			display: flex;
		}
		.company > a.router-link-exact-active + .proj-list {
			display: flex;
		}

		.proj-list {
			display: none;
			overflow: hidden;
		}

		.project {
			display: inline-flex;
			align-items: center;
			padding: 10px 10px 10px 10px;

			&:hover {
				background-color: hsl(263, 79%, 94%);
				width: 100%;
				border-radius: 6px;
			}
			> .dot {
				border-radius: 100%;
				background-color: red;
				padding: 7px;
				margin: 0 10px 0 0;
			}
			&.router-link-exact-active {
				border-radius: 6px;
				background: hsl(158, 79%, 87%);
			}
		}
	}
}

.add-company {
	height: 8vh;
	min-height: 60px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #ede4fc;
	padding: 10px 0;
}
</style>
