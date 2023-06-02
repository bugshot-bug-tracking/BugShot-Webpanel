<template>
	<MyModal :modelValue="props.show" :close="close" z-100>
		<ModalTemplate @close="close">
			<template #header-text>{{ t("move_bug", 2) }}</template>

			<div flex flex-col w-200>
				<n-text my-4>
					{{ t("select_bugs_to_move") }}
				</n-text>

				<n-transfer
					ref="transfer"
					v-model:value="transfer_selected"
					:options="transfer_options"
					source-filterable
					:render-source-list="transfer_renderSourceList"
					:disabled="loading"
				/>

				<n-text my-4>{{ t("select_target_project") }} </n-text>

				<n-cascader
					v-model:value="cascader_value"
					:placeholder="t('select_a_project')"
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
						:disabled="
							loading || transfer_selected.length < 1 || cascader_value === undefined
						"
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
import {
	TransferOption,
	CascaderOption,
	NTree,
	TreeOption,
	NText,
	TransferRenderSourceList,
} from "naive-ui";
import { Company } from "~/models/Company";
import { Project } from "~/models/Project";
import { useMainStore } from "~/stores/main";
import { useReportsStore } from "~/stores/reports";

const props = defineProps({
	show: {
		type: Boolean,
		required: true,
	},
});

const emit = defineEmits(["update:show"]);

const { t } = useI18n();

const store = useReportsStore();

const close = () => {
	emit("update:show", false);
};

const loading = ref(false);

const onSubmit = async () => {
	try {
		loading.value = true;

		if (cascader_value.value == undefined) return;

		await store.moveBugs(transfer_selected.value, cascader_value.value);

		close();
	} catch (error: any) {
		console.log(error);
	} finally {
		loading.value = false;
	}
};

const transfer_selected = ref([]);

const transfer_options = computed(() => {
	let list = [] as TransferOption[];
	store.getStatuses?.forEach((s) => {
		let result = s.attributes.bugs?.map(
			(b): TransferOption => ({
				label: b.attributes.designation,
				value: b.id,
			})
		);

		if (result) list.push(...result);
	});
	return list;
});

const transfer_renderSourceList: TransferRenderSourceList = ({ onCheck, pattern }) => {
	const data: TreeOption[] = store.getStatuses
		?.filter((s) => s.attributes.bugs?.length ?? 0 > 0)
		.map((status) => ({
			key: status.id,
			label: status.attributes.designation,
			isLeaf: false,
			children: status.attributes.bugs?.map((bug) => ({
				key: bug.id,
				label: bug.attributes.designation,
				isLeaf: true,
				prefix: () =>
					h(
						NText,
						{
							type: "primary",
							strong: true,
							style: "font-size: 0.875rem; word-break: keep-all;",
						},
						{ default: () => `#${bug.attributes.ai_id}` }
					),
			})) as TreeOption[],
		})) as TreeOption[];

	return h(NTree, {
		style: "margin: 0 4px;",
		checkable: true,
		selectable: false,
		blockLine: true,
		checkOnClick: true,
		data,
		pattern,
		checkStrategy: "child",
		checkedKeys: transfer_selected.value,
		expandOnClick: true,
		showIrrelevantNodes: false,
		disabled: loading.value,

		onUpdateCheckedKeys: (checkedKeys: Array<string | number>) => {
			onCheck(checkedKeys);
		},
	});
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
	if (option.type === "organization") {
		let response = (
			await axios.get(`organizations/${option.value}/companies`, {
				headers: {
					"include-company-role": "true",
				},
			})
		).data.data;

		let list = (response as Company[]).map((c) => ({
			label: c.attributes.designation,
			value: c.id,
			type: "company",
			depth: 2,
			isLeaf: false,

			role: c.attributes.role?.id,
			parent_role: option.role,
		}));

		option.children = list;
	} else if (option.type === "company") {
		let response = (
			await axios.get(`companies/${option.value}/projects`, {
				headers: {
					"include-project-role": "true",
				},
			})
		).data.data;

		let list = (response as Project[])
			.filter(
				(v) =>
					// don't show current project as an option
					v.id !== store.project?.id &&
					// test the project role
					((v.attributes.role?.id != undefined && v.attributes.role?.id < 2) ||
						// test the company role
						(option.role != undefined && option.role < 2) ||
						// test the organization role
						(option.parent_role != undefined && option.parent_role < 2))
			)
			.map((p) => ({
				label: p.attributes.designation,
				value: p.id,
				type: "project",
				depth: 3,
				isLeaf: true,
			}));

		option.children = list;
	}
};
</script>

<style scoped lang="scss">
:deep(.n-tree-node-content) {
	align-items: baseline;
}
</style>
