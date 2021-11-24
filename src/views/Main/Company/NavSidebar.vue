<template>
	<div class="sidebar">
		<h3>Companies</h3>

		<div class="search">
			<Search />
		</div>

		<div class="companies">
			<ul>
				<li v-for="[, company] of companies" :key="company.company.id">
					<div class="company">
						<router-link
							:to="{
								name: 'CompanyProjects',
								params: { id: company.company.id },
							}"
						>
							{{ company.company.attributes.designation }}
						</router-link>

						<img
							src="@/assets/icons/icn_left_arrow.svg"
							v-if="company.projects?.length > 0"
						/>
					</div>

					<ul v-if="company.projects?.length > 0">
						<li
							v-for="project of companyProjects(
								company.company.id
							)"
							:key="project.id"
							class="project"
						>
							<div class="dot" />

							<router-link
								:to="{
									name: 'Project',
									params: { id: project.id },
								}"
							>
								{{ project.attributes.designation }}
							</router-link>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { computed } from "@vue/runtime-core";
import Search from "../../../components/Search.vue";
import store from "../../../store";

export default {
	components: { Search },
	name: "CompanySidebar",
	setup() {
		const companies = computed(() => {
			return store.getters.getCompanies;
		});

		const companyProjects = (company_id) => {
			return store.getters.getCompanyProjects(company_id);
		};

		return {
			companies,
			companyProjects,
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
		padding: 10px;
		font-size: 20px;

		ul {
			list-style-type: none;
			padding: 0;
			text-align: left;
			display: flex;
			flex-direction: column;

			> li {
				padding: 10px 10px 10px 20px;
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
			margin-bottom: 10px;

			> img {
				transform: rotateZ(-90deg);
				cursor: pointer;
			}

			&.open {
				> img {
					transform: rotateZ(90deg);
				}
			}
		}

		.project {
			display: inline-flex;
			align-items: center;

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
		}
		a.router-link-exact-active {
			text-decoration: underline;
		}
	}
}
</style>
