<template>
	<MyModal :modelValue="props.show" :close="modal.close" z-100>
		<ModalTemplate @close="modal.close">
			<template #header-text>{{ t("move_bug", 2) }}</template>

			<div flex flex-col>
				<n-text my-4>
					Plaese select the bugs you want to move over to another project:
				</n-text>

				<n-transfer
					ref="transfer"
					v-model:value="transfer_selected"
					:options="transfer_options"
					source-filterable
				/>

				<n-text my-4> Please select the target project for the selected bugs: </n-text>

				<n-cascader
					v-model:value="cascader_value"
					placeholder="Select a project"
					:options="cascader_options"
					check-strategy="child"
					filterable
				/>
			</div>
		</ModalTemplate>
	</MyModal>
</template>

<script setup lang="ts">
import { TransferOption, CascaderOption } from "naive-ui";
import { useReportsStore } from "~/stores/reports";

const props = defineProps({
	show: {
		type: Boolean,
		required: true,
	},

	submit: {
		type: Function,
		required: false,
		default: undefined,
	},
});

defineEmits(["update:show"]);

const { t } = useI18n();

const store = useReportsStore();

const modal = reactive({
	show: props.show,
	loading: false,
	open: async () => {
		modal.show = true;
		modal.loading = false;
	},
	close: async () => {
		modal.show = false;
		modal.loading = false;
	},
});

const onSubmit = async () => {
	try {
		loading.value = true;

		if (props.submit != undefined) await props.submit();

		modal.close();
	} catch (error: any) {
		console.log(error);
	} finally {
		loading.value = false;
	}
};

const loading = ref(false);

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

const cascader_value = ref("");
const cascader_options = computed(() => {
	return [] as CascaderOption[];
});
</script>
