<template>
	<MyModal :modelValue="props.show" :close="close" z-100>
		<ModalTemplate @close="close">
			<template #header-text>
				{{ t("group_options.move_group") }}
			</template>

			<div flex flex-col max-w-72ch>
				<n-text my-4>
					{{ t("group_options.select_target_organization") }}
				</n-text>

				<n-select
					v-model:value="select_value"
					:placeholder="t('group_options.select_target_organization')"
					:options="select_options"
					check-strategy="child"
					filterable
					remote
					:disabled="loading"
				/>

				<div flex justify-around my-4>
					<n-button
						type="success"
						round
						@click="onSubmit"
						:disabled="loading || select_value === undefined"
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
import { useMainStore } from "~/stores/main";

const props = defineProps({
	show: {
		type: Boolean,
		required: true,
	},
	organization_id: {
		type: String,
		required: true,
	},
	company_id: {
		type: String,
		required: true,
	},
});

const emit = defineEmits(["update:show", "success", "close"]);

const { t } = useI18n();

const close = () => {
	emit("update:show", false);
	emit("close");
};

const loading = ref(false);

const onSubmit = async () => {
	try {
		loading.value = true;

		if (select_value.value == undefined) return;

		await useMainStore().moveGroup(props.organization_id, props.company_id, select_value.value);

		close();

		emit("success");
	} catch (error: any) {
		console.log(error);
	} finally {
		loading.value = false;
	}
};

const select_value = ref(undefined);
const select_options = computed(() => {
	let org = useMainStore()
		.getOrganizations?.filter((o) => o.id !== props.organization_id)
		.map((org) => ({
			label: org.attributes.designation,
			value: org.id,
			type: "organization",

			role: org.attributes.role?.id,
		}));

	return org ?? [];
});
</script>

<style scoped lang="scss"></style>
