<template>
	<n-popover trigger="click" placement="bottom-end" @update:show="isButtonActive = $event">
		<template #trigger>
			<n-button text :class="{ 'active-button': isButtonActive }" class="order-button">
				<template #icon>
					<Icon-Order />
				</template>
			</n-button>
		</template>

		<div p-2 flex flex-col>
			<n-h6 class="bs-bb" pb-2 m-0>
				<n-text strong> Order Projects </n-text>
			</n-h6>

			<n-radio-group v-model:value="value" name="radiogroup">
				<n-list>
					<n-list-item>
						<div flex flex-col gap-2>
							<n-text style="font-size: 0.875rem"> {{ t("alphabetical") }} </n-text>

							<div flex flex-1 gap-4>
								<n-radio :value="11" label="A-Z" />
								<n-radio :value="12" label="Z-A" />
							</div>
						</div>
					</n-list-item>

					<n-list-item>
						<div flex flex-col gap-2>
							<n-text style="font-size: 0.875rem"> {{ t("creation") }} </n-text>

							<div flex flex-1 gap-4>
								<n-radio :value="21" :label="t('newest_first')" />
								<n-radio :value="22" :label="t('oldest_first')" />
							</div>
						</div>
					</n-list-item>
					<n-list-item>
						<div flex flex-col gap-2>
							<n-text style="font-size: 0.875rem"> {{ t("last_updated") }} </n-text>

							<div flex flex-1 gap-4>
								<n-radio :value="31" :label="t('ascending')" />
								<n-radio :value="32" :label="t('descending')" />
							</div>
						</div>
					</n-list-item>
				</n-list>
			</n-radio-group>

			<n-button type="success" round mx-a mt-4 mb-2>{{ t("apply_ordering") }}</n-button>
		</div>
	</n-popover>
</template>

<script setup lang="ts">
enum OrderType {
	"alpha_asc" = 11,
	"alpha_desc" = 12,
	"created_new" = 21,
	"created_old" = 22,
	"update_asc" = 31,
	"update_desc" = 32,
}

const props = defineProps({
	value: {
		required: false,
		type: Number as PropType<OrderType>,
		default: 11,
	},
});
const emit = defineEmits(["update:value"]);

const value = computed({
	get() {
		return props.value;
	},
	set(value) {
		emit("update:value", value);
	},
});

const { t } = useI18n();

const isButtonActive = ref(false);
</script>

<style scoped lang="scss">
:deep(.n-radio__dot-wrapper) {
	display: none;
}

:deep(.n-radio__label) {
	border: 1px solid var(--bs-purple);
	border-radius: 0.25rem;
	color: var(--bs-purple);
	font-size: 0.75rem;
	padding: 0.25rem 0.5rem;
}

:deep(.n-radio--checked) {
	.n-radio__label {
		background-color: var(--bs-purple);

		color: white;
	}
}

.order-button {
	padding: 0.75rem;
	border-radius: 100%;

	&.active-button,
	&:hover {
		color: white !important;
		background-color: var(--bs-purple) !important;
	}
}
</style>
