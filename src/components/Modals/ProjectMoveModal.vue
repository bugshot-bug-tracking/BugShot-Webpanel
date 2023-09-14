<template>
	<MyModal :modelValue="props.show" :close="close" z-100>
		<ModalTemplate @close="close">
			<template #header-text>{{ t("project_page.more_options.move_project") }}</template>

			<div flex flex-col max-w-72ch>
				<n-text my-4>{{ t("project_page.more_options.select_target_group") }} </n-text>

				<n-cascader
					v-model:value="cascader_value"
					:placeholder="t('project_page.more_options.select_group')"
					:options="cascader_options"
					check-strategy="child"
					filterable
					remote
					:on-load="fetchNextChild"
					:disabled="loading"
				/>

				<div flex justify-around my-4>
					<n-button
						type="success"
						round
						@click="onSubmit"
						:disabled="loading || cascader_value === undefined"
						:loading="loading"
					>
						{{ t("confirm") }}
					</n-button>

					<n-button type="success" ghost round @click="close" :disabled="loading">
						{{ t("cancel") }}
					</n-button>
				</div>
			</div>
		</ModalTemplate>
	</MyModal>
</template>

<script setup lang="ts">
import axios from "axios";
import { CascaderOption, NText } from "naive-ui";
import { Company } from "~/models/Company";
import { useMainStore } from "~/stores/main";
import { useProjectStore } from "~/stores/project";

const props = defineProps({
	show: {
		type: Boolean,
		required: true,
	},
});

const emit = defineEmits(["update:show", "success"]);

const { t } = useI18n();

const store = useProjectStore();

const close = () => {
	emit("update:show", false);
};

const loading = ref(false);

const onSubmit = async () => {
	try {
		loading.value = true;

		if (cascader_value.value == undefined) return;

		await store.moveProject(cascader_value.value);

		close();

		emit("success");
	} catch (error: any) {
		console.log(error);
	} finally {
		loading.value = false;
	}
};

const cascader_value = ref(undefined);
const cascader_options = ref<CascaderOption[]>([]);

onMounted(() => {
	let org = useMainStore().getOrganizations?.map((org) => ({
		label: org.attributes.designation,
		value: org.id,
		type: "organization",
		isLeaf: false,
		depth: 1,

		role: org.attributes.role?.id,
	}));

	cascader_options.value = org as CascaderOption[];
});

const fetchNextChild = async (option: CascaderOption) => {
	let response = (
		await axios.get(`organizations/${option.value}/companies`, {
			headers: {
				"include-company-role": "true",
			},
		})
	).data.data as Company[];

	if (response.length > 0)
		response = response.filter(
			(c) =>
				c.id !== store.company?.id &&
				((c.attributes.role?.id != undefined && c.attributes.role.id < 2) ||
					(option.role != undefined && option.role < 2))
		);

	if (response.length < 1) return (option.disabled = true);

	let list = response.map((c) => ({
		label: c.attributes.designation,
		value: c.id,
		type: "company",
		depth: 2,
		isLeaf: true,

		role: c.attributes.role?.id,
	}));

	option.children = list;
};
</script>

<style scoped lang="scss">
:deep(.n-tree-node-content) {
	align-items: baseline;
}
</style>
