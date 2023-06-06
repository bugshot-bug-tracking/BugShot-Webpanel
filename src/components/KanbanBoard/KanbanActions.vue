<template>
	<n-popconfirm v-model:show="popover.value" :show-icon="false" m-4>
		<template #trigger>
			<n-button secondary>
				<div flex gap-2 items-center>
					<img src="/src/assets/icons/add.svg" alt="add" class="black-to-gray" />
					<n-text class="black-to-gray" strong>
						{{ $t("add_new_column") }}
					</n-text>
				</div>
			</n-button>
		</template>

		<n-space vertical p-4 flex-1>
			<n-text> {{ $t("enter_new_column_title") }} </n-text>

			<n-input
				v-model:value="newStatusName"
				type="text"
				:placeholder="$t('column_title')"
				minlength="1"
				maxlength="255"
				:disabled="loading"
			/>
		</n-space>

		<template #action>
			<n-space pb-4 pt-2 px-4>
				<n-button
					type="success"
					round
					mr-4
					@click="handleSubmit"
					:disabled="loading"
					:loading="loading"
				>
					{{ $t("add.column") }}
				</n-button>

				<n-button
					type="success"
					ghost
					round
					strong
					@click="popover.close"
					:disabled="loading"
				>
					{{ $t("cancel") }}
				</n-button>
			</n-space>
		</template>
	</n-popconfirm>
</template>

<script setup lang="ts">
import { useReportsStore } from "~/stores/reports";

const store = useReportsStore();

const popover = reactive({
	value: false,
	close: () => {
		popover.value = false;
		newStatusName.value = "";
	},
});

const newStatusName = ref("");

const loading = ref(false);

const handleSubmit = async () => {
	if (newStatusName.value.length < 1) return;

	try {
		loading.value = true;
		await store.createStatus({ designation: newStatusName.value });

		popover.close();
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
};
</script>
