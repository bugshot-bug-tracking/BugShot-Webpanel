<template>
	<a class="input-image" cursor-pointer @click="modal.open">
		<img
			src="/src/assets/icons/edit.svg"
			alt="edit"
			class="black-to-purple"
		/>
		<b> {{ t("change_language") }} </b>
	</a>

	<MyModal
		v-model="modal.show"
		:close="modal.close"
		@before-enter="radio = locale"
	>
		<ModalTemplate @close="modal.close" w-48>
			<template #header-text>
				{{ t("change_interface_language") }}
			</template>

			<form
				@submit.prevent="submit"
				@reset.prevent="cancel"
				class="bs-form"
			>
				<p>
					{{ t("language_change_will_affect") }}
				</p>

				<div class="form-group">
					<h5>{{ t("chose_desired_language") }}</h5>

					<div class="bs-input2" v-for="loc of locales">
						<label class="bs-radio">
							<input
								type="radio"
								name="language"
								:value="loc"
								v-model="radio"
								hidden
							/>

							<i class="radio" />

							<b>{{ t(`location.${loc}`) }}</b>
						</label>
					</div>
				</div>

				<div class="form-buttons">
					<button class="bs-btn green" type="submit">
						{{ t("save") }}
					</button>

					<button class="bs-btn green empty" type="reset">
						{{ t("cancel") }}
					</button>
				</div>
			</form>
		</ModalTemplate>
	</MyModal>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.clear"
		@onSuccess="modal.close()"
	/>
</template>

<script setup lang="ts">
import { useI18nStore } from "~/stores/i18n";

const { t } = useI18n();

const language = useI18nStore();

const locale = computed(() => language.getLocale);
const locales = computed(() => ["auto", ...language.getSupportedLocales]);

const radio = ref("");

const modal = reactive({
	show: false,
	open: () => {
		modal.show = true;
	},
	close: () => {
		modal.show = false;
	},
});

const submit = async () => {
	try {
		loadingModal.show = true;

		language.setLocale(radio.value);

		loadingModal.state = 1;
		loadingModal.message = t("language_changed");
	} catch (error: any) {
		// console.log(error);

		let data = error.response.data;

		loadingModal.state = 2;
		loadingModal.message = data.message;
	}
};

const cancel = () => {
	modal.close();
};

const loadingModal = reactive({
	show: false,
	state: 0,
	message: "",
	clear: () => {
		loadingModal.show = false;
		loadingModal.state = 0;
		loadingModal.message = "";
	},
});
</script>

<style scoped lang="scss"></style>
