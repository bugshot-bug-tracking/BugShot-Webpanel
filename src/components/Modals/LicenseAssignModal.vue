<template>
	<MyModal v-model="modal.show" :close="modal.close">
		<ModalTemplate @close="modal.close" w-48>
			<template #header-text>
				{{ t("assign_license_to_user") }}
			</template>

			<form class="bs-form">
				<div>
					<p text-4>{{ t("license") }}:</p>
					<p text-6>
						<b>{{ license_name }}</b>
					</p>
				</div>

				<div class="form-group">
					<div class="bs-input" v-for="item of items">
						<label class="bs-radio">
							<input type="radio" :value="item" v-model="radio" hidden />

							<i class="radio" mb-5 />

							<Avatar
								:first_name="item.attributes.first_name"
								:last_name="item.attributes.last_name"
								size="XS"
								mt-0
								self-start
								mr--2
							/>

							<div flex flex-col>
								<div flex gap-2 items-center>
									<b style="font-size: 1.125rem">
										{{ item.attributes.first_name }}
										{{ item.attributes.last_name }}
									</b>

									<Badge
										:text="
											$t(
												'roles.' +
													item.role?.attributes.designation.toLocaleLowerCase()
											)
										"
										:preset="'pe'"
										v-if="item.role"
									/>

									<Badge v-else :text="$t('owner')" :preset="'gf'" />
								</div>

								<p style="color: var(--bs-gray)">{{ item.attributes.email }}</p>
							</div>
						</label>
					</div>
				</div>

				<div class="form-buttons">
					<n-button
						strong
						type="success"
						round
						@click="submit"
						:loading="loading"
						:disabled="loading"
					>
						{{ t("assign_license") }}
					</n-button>
				</div>
			</form>
		</ModalTemplate>
	</MyModal>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.clear"
		@onSuccess="modal.close"
	/>
</template>

<script setup lang="ts">
import { User } from "~/models/User";

const props = defineProps({
	modelValue: {
		type: Boolean,
		required: true,
		default: false,
	},
	license_name: {
		type: String,
		required: true,
		default: "-",
	},
	items: {
		type: Array as PropType<User[]>,
		required: false,
		default: [],
	},

	loading: Boolean,
});

const emit = defineEmits(["update:modelValue", "submit"]);

const { t } = useI18n();

const modal = reactive({
	show: false,

	close: () => {
		emit("update:modelValue", false);
	},
});

watchEffect(() => {
	modal.show = props.modelValue;
});

const radio = ref(undefined as undefined | User);

const submit = async () => {
	return emit("submit", radio.value);

	try {
		loadingModal.show = true;

		loadingModal.state = 1;
		loadingModal.message = t("language_changed");
	} catch (error: any) {
		// console.log(error);

		let data = error.response.data;

		loadingModal.state = 2;
		loadingModal.message = data.message;
	}
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
