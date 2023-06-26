<template>
	<MyModal :modelValue="modal.show" :close="modal.close" z-100>
		<ModalTemplate @close="modal.close" style="min-width: 0">
			<template #header-text>
				<slot name="modal-header">
					{{ t("tours.overview.introduction.title") }}
				</slot>
			</template>

			<div flex flex-col justify-center w-a>
				<n-text style="white-space: pre-line; text-indent: balance">
					{{ t("tours.overview.introduction.text") }}
				</n-text>

				<iframe
					src="https://www.youtube.com/embed/lic5Nq5EUCk"
					width="560"
					height="320"
					allowfullscreen
					m-a
					my-4
				/>
			</div>

			<div flex flex-1 justify-center gap-8 mt-4>
				<n-button type="success" round @click="onStart">{{ t("start_tour") }}</n-button>
				<n-button type="success" round ghost @click="onClose">{{ t("close") }}</n-button>
			</div>
		</ModalTemplate>
	</MyModal>
</template>

<script setup lang="ts">
import { useTourStore } from "~/stores/tour";
import { Tours } from "~/tours/tours";

const emit = defineEmits(["close"]);

const { t } = useI18n();

const modal = reactive({
	show: true,
	open: async () => {
		modal.show = true;
	},
	close: async () => {
		modal.show = false;

		emit("close");
	},
});

const onStart = () => {
	emit("close");

	nextTick(() => {
		useTourStore().StartTour(Tours.overview);
	});
};

const onClose = () => {
	emit("close");
};
</script>

<style scoped lang="scss"></style>
