<template>
	<MyModal :modelValue="show" :close="modalClose" z-100>
		<ModalTemplate @close="modalClose" style="min-width: 0">
			<template #header-text>
				<slot name="modal-header">
					{{ t("tours.overview.introduction.title") + "!" }}
				</slot>
			</template>

			<div flex flex-col justify-center w-a max-w-66ch>
				<n-text style="white-space: pre-line; text-indent: balance">
					{{ t("tours.overview.introduction.text") }}
				</n-text>

				<iframe
					:src="source"
					width="560"
					height="315"
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
					m-a
					my-4
				/>

				<n-checkbox v-model:checked="permanentCloseCheckbox" self-center my-1 mb-3>
					{{ t("dont_show_again") }}
				</n-checkbox>
			</div>

			<div flex flex-1 justify-center gap-8 mt-4>
				<n-button type="success" round @click="onStart">{{ t("start_tour") }}</n-button>
				<n-button type="success" round ghost @click="modalClose">{{ t("close") }}</n-button>
			</div>
		</ModalTemplate>
	</MyModal>
</template>

<script setup lang="ts">
import { useI18nStore } from "~/stores/i18n";
import { useTourStore } from "~/stores/tour";
import { Tours } from "~/tours/tours";

// const props =
defineProps({
	show: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(["permanentClose", "update:show"]);

const { t } = useI18n();

const permanentCloseCheckbox = ref(false);

const modalClose = () => {
	emit("update:show", false);

	if (permanentCloseCheckbox.value === true) emit("permanentClose");
};

const onStart = () => {
	modalClose();

	nextTick(() => {
		useTourStore().StartTour(Tours.overview);
	});
};

const source = computed(() => {
	switch (useI18nStore().getCurrentLocale) {
		default:
		case "en":
			return "https://www.youtube.com/embed/lic5Nq5EUCk";

		case "de":
			return "https://www.youtube.com/embed/kEfZGwPqdNo";
	}
});
</script>

<style scoped lang="scss"></style>
