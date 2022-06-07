<template>
	<div class="home-layout" :class="{ minimized: minimized }">
		<section name="sidebar">
			<TSidebar @minimize="toggle">
				<template #header>
					<h3>{{ $t("company", 2) }}</h3>
				</template>

				<template #main class="bs-scroll s-purple">
					<div class="companies bs-scroll s-purple">
						<ul>
							<li
								v-for="[, company] of companies"
								:key="company.id"
							>
								<div class="company">
									<router-link
										@click="linkOpen"
										:to="{
											name: 'company',
											params: { id: company.id },
										}"
									>
										{{ company.attributes.designation }}
									</router-link>

									<img
										src="/src/assets/icons/icn_left_arrow.svg"
										v-if="
											companyProjects(company.id)
												?.length > 0
										"
										@click="collapse"
									/>
								</div>

								<ul
									v-if="
										companyProjects(company.id)?.length > 0
									"
									class="proj-list"
								>
									<router-link
										v-for="project of companyProjects(
											company.id
										)"
										:key="project.id"
										class="project"
										:to="{
											name: 'project',
											params: { id: project.id },
										}"
									>
										<div
											class="dot"
											:style="{
												'background-color': project
													.attributes.color_hex
													? project.attributes
															.color_hex
													: '#7a2de6',
											}"
										/>

										{{ project.attributes.designation }}
									</router-link>
								</ul>
							</li>
						</ul>
					</div>
				</template>

				<template #footer>
					<CreateDataModal
						:dataType="'Company'"
						:postPath="'companies'"
					/>
				</template>
			</TSidebar>
		</section>

		<section name="page">
			<RouterView />
		</section>
	</div>
</template>

<script setup lang="ts">
import { useMainStore } from "src/stores/main";

let store = useMainStore();
store.init();

const companies = computed(() => store.getCompanies);

const companyProjects = (company_id) => store.getCompanyProjects(company_id);

const collapse = (event) => {
	if (event.target.parentNode.classList.contains("open"))
		event.target.parentNode.classList.remove("open");
	else event.target.parentNode.classList.add("open");
};

const linkOpen = (event) => {
	event.target.parentNode.classList.add("open");
};

const minimized = ref(false);
const toggle = (value) => {
	minimized.value = value;
};
</script>

<style lang="scss" scoped>
.home-layout {
	display: grid;
	grid-template-columns: 0.25fr 1.75fr;
	grid-template-rows: 1fr;
	gap: 0px 0px;
	grid-auto-flow: row;
	grid-template-areas: "sidebar page";
	width: 100%;
	height: 100vh;
	max-height: 100vh;
	overflow: hidden;

	&.minimized {
		grid-template-columns: auto 1.75fr;
	}
}

section[name="sidebar"] {
	grid-area: sidebar;

	h3 {
		padding: 20px;
		text-align: left;
	}

	.companies {
		padding: 10px 0px 10px 10px;
		font-size: 16px;
		overflow: auto;
		height: 100%;
		width: 100%;

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

section[name="page"] {
	grid-area: page;
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
