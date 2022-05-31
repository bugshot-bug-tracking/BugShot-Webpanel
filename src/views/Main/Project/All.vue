<template>
	<Layout>
		<template v-slot:title>{{ $t("all_projects") }}</template>

		<!-- <template v-slot:top>
			<Search />
		</template> -->

		<GroupContainer
			v-for="item of companies"
			:key="item.id"
			:mainText="item.attributes.designation"
			:secondText="
				$t('last_update', {
					time: passedTime(item.attributes.updated_at),
				})
			"
		>
			<Card
				v-for="project of companyProjects(item.id)"
				:key="project.id"
				:id="project.id"
				:title="project.attributes.designation"
				:mainText="$t('task_overview')"
				:secondText="
					bugsStats(
						project.attributes.bugsDone,
						project.attributes.bugsTotal
					)
				"
				:color="
					project.attributes.color_hex
						? project.attributes.color_hex
						: '#7A2EE6'
				"
				:image="project.attributes.image"
				:lastEdit="
					project.attributes.updated_at
						? project.attributes.updated_at
						: null
				"
				:routeTo="{ name: 'Project', params: { id: project.id } }"
			/>
		</GroupContainer>
	</Layout>
</template>

<script setup>
import Card from "../../../components/Card.vue";
import GroupContainer from "../../../components/GroupContainer.vue";
import Layout from "../Layout.vue";
import { useMainStore } from "/src/stores/main";
import Search from "../../../components/Search.vue";
import timeToText from "/src/util/timeToText";

let store = useMainStore();

const companies = computed(() => {
	return store.getCompanyWithProjects.sort((a, b) =>
		a.attributes.updated_at < b.attributes.updated_at ? 1 : -1
	);
});

const companyProjects = (company_id) => {
	return store.getCompanyProjects(company_id);
};

const bugsStats = (done, total) => {
	let str = "";
	str += done ? done : "0";
	str += " / ";
	str += total ? total : "0";
	return str;
};

const passedTime = (lastEdit) => {
	return timeToText(lastEdit);
};
</script>
