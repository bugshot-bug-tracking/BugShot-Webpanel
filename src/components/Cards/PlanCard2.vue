<template>
	<n-card
		:bordered="false"
		:segmented="{
			content: true,
			footer: true,
		}"
		class="plan-card"
		:style="{ '--before-color': value.color }"
		text-left
	>
		<template #header>
			<div flex flex-col items-start gap-4>
				<n-h2 mb-0> {{ $t(`welcome_page.plans.${value.type}.title`) }} </n-h2>

				<div>
					<n-p text-12 m-0>
						{{ value.price ? value.price / 100 : 0 }}

						<n-text text-6> € </n-text>
						<n-text text-6 font-normal v-if="value.price && value.price > 0">
							/ {{ $t("month") }}
						</n-text>
					</n-p>
					<n-p m-0 v-if="value.multiple" font-normal>
						{{
							$t("welcome_page.extra_licenses", [
								value.extra_price ? value.extra_price / 100 : 0,
							])
						}}
					</n-p>
				</div>

				<NumberInput
					v-if="value.multiple"
					:lowerLimit="1"
					v-model.number="quantity"
					:labelText="$t('license', quantity)"
					size="M"
				/>

				<n-button
					type="primary"
					size="large"
					@click="emit('action', quantity)"
					:loading="loading"
					:disabled="disabled"
				>
					{{ $t("welcome_page.select_button") }}
				</n-button>
			</div>
		</template>

		<template #default>
			<n-text strong> {{ $t(`welcome_page.plans.${value.type}.highlight`) }} </n-text>
		</template>

		<template #footer>
			<n-ul list-disc max-w-38ch flex flex-col gap-4>
				<n-li v-for="item in value.features">
					{{ $t(`welcome_page.plans.${value.type}.${item.trim()}`) }}
				</n-li>
			</n-ul>
		</template>
	</n-card>
</template>

<script setup lang="ts">
defineProps({
	value: {
		type: Object as PropType<{
			type?: string;
			price?: number;
			extra_price?: number;
			multiple?: boolean;
			features?: string[];
			color?: string;
		}>,
		required: true,
	},

	loading: {
		type: Boolean,
		required: false,
		default: false,
	},
	disabled: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const emit = defineEmits(["action"]);

const quantity = ref(1);
</script>

<style scoped lang="scss">
.plan-card {
	--before-color: var(--bs-purple);

	border-radius: 0.5rem;

	&::before {
		content: "";
		z-index: -1;
		background-color: var(--before-color);
		position: absolute;
		top: -0.5rem;
		left: 0;
		right: 0;
		width: 100%;
		height: 2rem;
		border-radius: 0.5rem;
	}
}

:deep(.n-card__content),
:deep(.n-card__footer) {
	border-width: 2px !important;
}
</style>
