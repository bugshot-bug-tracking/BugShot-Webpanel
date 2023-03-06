<template>
	<article class="bs-scroll" v-if="!loading">
		<header>
			<p>
				<b>{{ $t("choose_the_plan") }}</b>
			</p>

			<p text-5 flex gap-1 items-baseline>
				<b
					class="month-opt"
					:class="{ 'selected-opt': isMonthly }"
					@click="isMonthly = true"
				>
					{{ $t("monthly") }}
				</b>

				<n-switch size="small" @click="isMonthly = !isMonthly" :value="!isMonthly" />

				<b
					class="year-opt"
					:class="{ 'selected-opt': !isMonthly }"
					@click="isMonthly = false"
				>
					{{ $t("yearly") }}

					<span>{{ $t("n_months_free", 2) }}</span>
				</b>
			</p>
		</header>

		<div class="main bs-scroll">
			<ul>
				<li v-for="product in processedProducts" :key="product.id">
					<PlanCard
						:title="product.name"
						:description="product.value.attributes.metadata.description"
						:features="product.features"
						:type="isMonthly ? 'month' : 'year'"
						:price="
							isMonthly
								? (product.prices.monthly.unit_amount ?? 0) / 100
								: (product.prices.yearly.unit_amount ?? 0) / 100
						"
						:extra_price="
							isMonthly
								? (product.prices.monthly.extra_unit_amount ?? 0) / 100
								: (product.prices.yearly.extra_unit_amount ?? 0) / 100
						"
						@submit="onSubmit($event, product)"
						:loading="cardLoading === product.id"
					>
					</PlanCard>
				</li>
			</ul>
		</div>

		<div></div>
	</article>

	<article v-else justify-center>
		<img src="/src/assets/animations/loading.svg" alt="loading" />
	</article>
</template>

<script setup lang="ts">
import { usePaymentsStore } from "~/stores/payments";

let store = usePaymentsStore();

const loading = ref(true);

onMounted(async () => {
	try {
		loading.value = true;

		await store.init();
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
});

const isMonthly = ref(true);

const products = computed(() => store.getActiveProducts);

const processedProducts = computed(() =>
	products.value
		.map((prod) => ({
			value: prod,
			id: prod.id,
			name: prod.attributes.name,
			prices: {
				monthly: {
					price: prod.attributes.prices.find(
						(x) => x.attributes.recurring.interval === "month"
					),
					unit_amount: prod.attributes.prices
						.find((x) => x.attributes.recurring.interval === "month")
						?.attributes.tiers?.find((t) => t.up_to === 1)?.unit_amount,

					extra: prod.attributes.prices
						.find((x) => x.attributes.recurring.interval === "month")
						?.attributes.tiers?.find((t) => t.up_to == null),

					extra_unit_amount: prod.attributes.prices
						.find((x) => x.attributes.recurring.interval === "month")
						?.attributes.tiers?.find((t) => t.up_to == null)?.unit_amount,
				},

				yearly: {
					price: prod.attributes.prices.find(
						(x) => x.attributes.recurring.interval === "year"
					),

					unit_amount: prod.attributes.prices
						.find((x) => x.attributes.recurring.interval === "year")
						?.attributes.tiers?.find((t) => t.up_to === 1)?.unit_amount,

					extra: prod.attributes.prices
						.find((x) => x.attributes.recurring.interval === "year")
						?.attributes.tiers?.find((t) => t.up_to == null),

					extra_unit_amount: prod.attributes.prices
						.find((x) => x.attributes.recurring.interval === "year")
						?.attributes.tiers?.find((t) => t.up_to == null)?.unit_amount,
				},
			},

			features: prod.attributes.metadata.feature_list?.split(";"),

			image: prod.attributes.metadata.image,
		}))
		.sort((a, b) => (a.prices.monthly?.unit_amount ?? 0) - (b.prices.monthly?.unit_amount ?? 0))
);

const onSubmit = (value: number, product: typeof processedProducts.value[0]) => {
	cardLoading.value = product.id;

	// just a safety measure
	if (value < 1) value = 1;

	let mainPrice = isMonthly.value ? product.prices.monthly.price : product.prices.yearly.price;

	store.createCheckout({
		price: mainPrice!,
		quantity: value,
	});
};

const cardLoading = ref("");
</script>

<style lang="scss" scoped>
h3 {
	font-weight: bold;
	padding: 1rem;
	height: 100%;
	display: flex;
	align-items: center;
}

article {
	display: flex;
	width: calc(100% - 5rem);
	height: 100%;
	padding: 2.5rem;
	flex-wrap: wrap;
	flex-direction: column;
	max-height: 100vh;
	column-gap: 1rem;
	align-items: center;
	justify-content: space-evenly;

	position: relative;
}

header {
	font-size: 2rem;
	display: flex;
	width: 100%;
	justify-content: space-around;
	align-items: center;

	position: sticky;
	left: 0;
	right: 0;
}

.main {
	max-width: 100%;

	ul {
		display: flex;
		padding: 4rem 0;
		gap: 2rem;
	}
}
.month-opt {
	cursor: pointer;
}

.year-opt {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	cursor: pointer;

	span {
		font-size: 1.125rem;
		color: white;
		background: #18d992;
		padding: 0.25rem;
		border-radius: 0.5rem;
		position: relative;

		&::before {
			content: "";
			position: absolute;
			top: calc(50% - 0.25rem);
			left: -0.25rem;
			width: 0.5rem;
			height: 0.5rem;
			transform: rotate(45deg);
			background-color: #18d992;
			border: 1px solid #18d992;
			z-index: -1;
		}
	}
}

.selected-opt {
	color: var(--bs-purple);
}

:deep(.n-card) {
	border-radius: 0.5rem;
}
</style>

<route lang="yaml">
name: organization-payments-plans
</route>
