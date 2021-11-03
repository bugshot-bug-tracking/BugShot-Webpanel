<template>
	<div class="sidebar">
		<h3>Companies</h3>

		<Search />

		<div class="companies">
			<ul>
				<li>
					<div>
						<div class="title" @click="getUser">c1</div>
						<div class="projects">
							<ul>
								<li>p1</li>
								<li>p2</li>
								<li>p3</li>
							</ul>
						</div>
					</div>
				</li>
				<li>c2</li>
				<li>c3</li>
				<li
					v-for="item in companies"
					:key="item.company.id"
					@click="setActiveCompany(item)"
				>
					{{ item.company.attributes.designation }}
					<ul v-if="item.company.projects">
						<li
							v-for="project in item.company.projects"
							:key="project.id"
						>
							{{ project.attributes.designation }}
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { computed, onBeforeMount } from "@vue/runtime-core";
import Search from "../../../components/Search.vue";
import store from "../../../store";
export default {
	components: { Search },
	name: "CompanySidebar",
	setup() {
		const companies = computed(() => {
			return store.getters.getCompanies;
		});

		const getUser = () => {
			console.log(companies);
		};
		const setActiveCompany = (item) => {
			store.dispatch("makeActiveCompany", item.company.id);
		};

		onBeforeMount(() => {
			store.dispatch("companies");
		});

		return {
			getUser,
			setActiveCompany,
			companies,
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
}
</style>
