<template>
	<n-card
		hoverable
		:segmented="{
			content: true,
			footer: true,
		}"
		w-100
		m-4
		text-left
	>
		<div flex flex-col gap-2>
			<p text-8>
				<b>{{ title }}</b>
			</p>

			<p>
				{{ $t(description ?? "") }}
			</p>

			<div flex text-7>
				<p font-bold>
					{{ nicePrice(type === "month" ? subTotal : subTotal / 12).toLocaleString() }}
					€
				</p>

				<p ml-2>
					{{ `/ ${$t("month")}` }}
				</p>
			</div>

			<p>
				({{
					$t(
						"extra_for_n_each",
						nicePrice(type === "month" ? extra_price : extra_price / 12)
					)
				}})
			</p>

			<div my-4>
				<NumberInput
					:lowerLimit="1"
					v-model.number="quantity"
					:labelText="$t('license', quantity)"
					size="M"
				/>
			</div>

			<div flex justify-between items-end>
				<n-button @click="onSubmit" :type="'primary'" strong :loading="loading">
					{{ $t("checkout") }}
				</n-button>

				<p text-4 style="color: var(--bs-gray)">
					{{ type === "month" ? "" : $t("s_billed_yearly", [subTotal.toLocaleString()]) }}
				</p>
			</div>
		</div>

		<template #footer v-if="features">
			<b>{{ $t("what_is_included") }}</b>

			<n-list>
				<n-space vertical>
					<n-list-item v-for="feature of features" p-0>
						<template #prefix>
							<div class="dot" style="width: 0.375rem; height: 0.375rem" />
						</template>

						{{ feature ? $t(feature.trim()) : "" }}
					</n-list-item>
				</n-space>
			</n-list>
		</template>
	</n-card>
</template>

<script setup lang="ts">
const props = defineProps({
	title: {
		required: true,
		type: String,
	},
	description: {
		required: false,
		type: String,
	},
	price: {
		type: Number,
		required: true,
	},
	extra_price: {
		type: Number,
		required: true,
	},
	type: String as PropType<"month" | "year">,
	features: {
		type: Array as PropType<string[] | undefined>,
		required: false,
	},
	loading: Boolean,
});

const emit = defineEmits(["submit"]);

const quantity = ref(1);

const subTotal = computed(() => props.price + (quantity.value - 1) * props.extra_price);

const nicePrice = (value: number) => {
	if (value % 1 > 0) return Number(value.toPrecision(3));
	else return value;
};

const onSubmit = () => {
	emit("submit", quantity.value);
};
</script>

<style lang="scss" scoped>
:deep(.n-list) {
	margin-top: 1rem;

	li {
		padding: 0;

		list-style-type: disc;

		.n-list-item__prefix {
			margin-right: 0.5rem;
		}
	}
}
</style>
