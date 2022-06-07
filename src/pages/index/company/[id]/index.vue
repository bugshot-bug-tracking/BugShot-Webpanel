<template>
	<T2Page>
		<template #header>
			<T2Header>
				<template #l-top>
					{{ $t("project", 2) }}
				</template>

				<template #l-bottom>
					{{ record ? record.attributes.designation : $t("loading") }}
				</template>

				<InviteModal :dataType="'Company'" :id="id" />

				<CreateDataModal
					:dataType="'Project'"
					:postPath="`companies/${id}/projects`"
					:aditionalBody="{
						company_id: id,
					}"
					:subTitle="`${$t('company')}: ${
						record?.attributes.designation
					}`"
				/>
				<router-link
					:to="{ name: 'company-settings', params: { id: id } }"
					class="bs-btn green empty text-capitalize"
				>
					{{ $t("company_settings") }}
				</router-link>
			</T2Header>
		</template>

		<div v-if="areProjects">
			<GroupContainer
				:mainText="record.attributes.designation"
				:secondText="
					$t('last_update', {
						time: timeToText(record.attributes.updated_at),
					})
				"
			>
				<Card
					v-for="project of companyProjects"
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
					:image="
						project.attributes.image
							? project.attributes.image
							: null
					"
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
import { useMainStore } from "src/stores/main";
import timeToText from "src/util/timeToText";

const props = defineProps({
	id: {
		required: true,
		type: String,
		description: "Company ID",
	},
});

const store = useMainStore();

const record = computed(() => {
	return store.getCompanyById(props.id);
});

const companyProjects = computed(() => {
	return store.getCompanyProjects(props.id);
});

const areProjects = computed(() => {
	if (!record.value) return false;
	if (!record.value.attributes.projects) return false;
	if (!record.value.attributes.projects.length > 0) return false;
	return true;
});
</script>

<route lang="yaml">
name: company
</route>
