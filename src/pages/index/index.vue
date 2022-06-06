<template>
	<T2Page>
		<template #header>
			<h3>{{ $t("all_projects") }}</h3>
		</template>

		<div class="groups bs-scroll s-purple">
			<GroupContainer
				v-for="item of companies"
				:key="item.id"
				:mainText="item.attributes.designation"
				:secondText="
					$t('last_update', {
						time: timeToText(item.attributes.updated_at),
					})
				"
			>
				<Card
					v-for="project of companyProjects(item.id)"
					:key="project.id"
					:id="project.id"
					:title="project.attributes.designation"
					:mainText="$t('task_overview')"
					:secondText="`${project.attributes.bugsDone} / ${project.attributes.bugsTotal}`"
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
					:routeTo="{ name: 'project', params: { id: project.id } }"
				/>
			</GroupContainer>
		</div>
	</T2Page>
</template>

<script setup>
import timeToText from "src/util/timeToText";
import { useMainStore } from "src/stores/main";

let store = useMainStore();

const companies = computed(() => {
	return store.getCompanyWithProjects.sort((a, b) =>
		a.attributes.updated_at < b.attributes.updated_at ? 1 : -1
	);
});

const companyProjects = (company_id) => {
	return store.getCompanyProjects(company_id);
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
</script>

<style lang="scss" scoped>
h3 {
	font-weight: bold;
	padding: 20px;
	height: 100%;
	display: flex;
	align-items: center;
}

.groups {
	width: 100%;
	height: 100%;
}
</style>
<route lang="yaml">
name: home
</route>
