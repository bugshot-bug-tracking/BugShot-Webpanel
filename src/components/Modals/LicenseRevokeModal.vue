<template>
	<MyModal v-model="modal.show" :close="modal.close" v-bind="$attrs">
		<ModalTemplate @close="modal.close" w-48>
			<template #header-text>
				<slot name="header-text">
					{{ t("revoke_license_from_user", 2) }}
				</slot>
			</template>

			<form class="bs-form" pl-2>
				<div v-if="license_name">
					<p text-4>{{ t("license") }}:</p>

					<p text-6>
						<b>{{ license_name }}</b>
					</p>
				</div>

				<p>{{ t("select_n_to_revoke_licenses", quantity) }}:</p>

				<n-checkbox-group v-model:value="checkbox" v-if="items" :max="quantity">
					<n-list-item v-for="item of items" :key="item.id">
						<div flex gap-4 items-baseline>
							<n-checkbox :value="item.id" />

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
											t(
												'roles.' +
													item.role?.attributes.designation.toLocaleLowerCase()
											)
										"
										:preset="'pe'"
										v-if="item.role"
									/>

									<Badge v-else :text="t('owner')" :preset="'gf'" />
								</div>

								<p style="color: var(--bs-gray)">{{ item.attributes.email }}</p>
							</div>
						</div>
					</n-list-item>
				</n-checkbox-group>

				<div class="form-buttons">
					<n-button
						strong
						type="success"
						round
						@click="submit"
						:loading="loading"
						:disabled="loading"
					>
						<slot name="button-text">
							{{ t("revoke_license", 2) }}
						</slot>
					</n-button>
				</div>
			</form>
		</ModalTemplate>
	</MyModal>
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
		required: false,
		default: undefined,
	},
	items: {
		type: Array as PropType<User[]>,
		required: false,
		default: [],
	},

	quantity: {
		type: Number,
		required: true,
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

const checkbox = ref(undefined as undefined | string[]);

const submit = async () => {
	return emit("submit", checkbox.value);
};

watchEffect(() => {
	modal.show = props.modelValue;
	checkbox.value = undefined;
});
</script>

<style scoped lang="scss">
:deep(.n-list-item) {
	list-style-type: none;
}
</style>
