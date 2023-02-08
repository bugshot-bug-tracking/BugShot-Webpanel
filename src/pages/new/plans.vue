<template>
	<article class="bs-scroll" v-if="!loading">
		<header>
			<p>
				<b>{{ $t("choose_the_plan") }}</b>
			</p>

			<p text-6 flex gap-1 items-baseline>
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
					<Plan
						:name="product.name"
						:type="isMonthly ? 'month' : 'year'"
						:price="
							isMonthly
								? (product.prices.monthly_unit_amount ?? 0) / 100
								: (product.prices.yearly_unit_amount ?? 0) / 100
						"
						:features="product.features"
						:image="`/src/assets/images/stripe/${product.image ?? 'default'}.png`"
					>
						<template #button>
							<button
								class="bs-btn green"
								@click="
									store.check(
										isMonthly ? product.prices.monthly : product.prices.yearly
									)
								"
							>
								{{ $t("choose_plan") }}
							</button>
						</template>
					</Plan>
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
			id: prod.id,
			name: prod.attributes.name,
			prices: {
				monthly: prod.attributes.prices.find(
					(x) => x.attributes.recurring.interval === "month"
				),

				yearly: prod.attributes.prices.find(
					(x) => x.attributes.recurring.interval === "year"
				),

				monthly_unit_amount: prod.attributes.prices
					.find((x) => x.attributes.recurring.interval === "month")
					?.attributes.tiers?.find((t) => t.up_to === 1)?.unit_amount,

				yearly_unit_amount: prod.attributes.prices
					.find((x) => x.attributes.recurring.interval === "year")
					?.attributes.tiers?.find((t) => t.up_to === 1)?.unit_amount,
			},
			features: prod.attributes.metadata.feature_list?.split(";"),
			image: prod.attributes.metadata.image,
		}))
		.sort(
			(a, b) =>
				(a.prices.monthly?.attributes.unit_amount ?? 0) -
				(b.prices.monthly?.attributes.unit_amount ?? 0)
		)
);
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
	color: #9ba5d7;
	cursor: pointer;
}

.year-opt {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	color: #9ba5d7;
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
	color: #1a2040;
}
</style>

<route lang="yaml">
name: new-plans
</route>
