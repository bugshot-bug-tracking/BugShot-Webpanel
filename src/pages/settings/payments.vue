<template>
	<T2Page>
		<template #header>
			<h3>{{ $t("purchase_plan") }}</h3>
		</template>

		<article class="bs-scroll" v-if="!loading">
			<header>
				<p>
					<b>{{ $t("choosoe_the_plan") }}</b>
				</p>

				<p text-6 uppercase flex gap-1>
					<b
						class="month-opt"
						:class="{ 'selected-opt': isMonthly }"
						@click="isMonthly = true"
					>
						{{ $t("monthly") }}
					</b>

					|

					<b
						class="year-opt"
						:class="{ 'selected-opt': !isMonthly }"
						@click="isMonthly = false"
					>
						{{ $t("yearly") }}

						<span>{{ $t("save_n%", { n: 17 }) }}</span>
					</b>
				</p>
			</header>

			<div class="main">
				<ul>
					<li v-for="plan in filteredPlans" :key="plan.id">
						<Plan
							:name="plan.attributes.name"
							:type="isMonthly ? 'month' : 'year'"
							:price="
								getProductPrice(plan).attributes.unit_amount /
								100
							"
							:features="plan.attributes.description?.split(';')"
							:image="plan.attributes.images[0]"
						>
							<template #button>
								<button
									class="bs-btn green"
									@click="store.check(getProductPrice(plan))"
								>
									{{ $t("choosoe_plan") }}
								</button>
							</template>
						</Plan>
					</li>
				</ul>
			</div>
		</article>

		<article v-else justify-center>
			<img src="/src/assets/animations/loading.svg" alt="loading" />
		</article>
	</T2Page>
</template>

<script setup lang="ts">
import { usePaymentsStore } from "~/stores/payments";

let store = usePaymentsStore();

const loading = ref(true);

onMounted(async () => {
	try {
		let response = await store.init();

		console.log(response);
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
});

const isMonthly = ref(true);

const plans = computed(() => store.getActiveProducts);

const filteredPlans = computed(() => {
	// #1 filter by payment type (monthly / yearly)
	// #2 sort by that payment type

	return plans.value
		?.filter((plan) =>
			plan.attributes.prices?.find(
				(price) =>
					price.attributes.recurring?.interval ===
					(isMonthly.value ? "month" : "year")
			)
		)
		.sort((a, b) => {
			let p1 = a.attributes.prices.find(
				(price) =>
					price.attributes.recurring?.interval ===
					(isMonthly.value ? "month" : "year")
			)?.attributes.unit_amount;

			let p2 = b.attributes.prices.find(
				(price) =>
					price.attributes.recurring?.interval ===
					(isMonthly.value ? "month" : "year")
			)?.attributes.unit_amount;

			return (p1 ?? 0) - (p2 ?? 0);
		});
});

const getProductPrice = (product: any) =>
	product.attributes.prices.find(
		(price: any) =>
			price.attributes.recurring?.interval ===
			(isMonthly.value ? "month" : "year")
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
	width: 100%;
	height: 100%;
	padding: 2.5rem;
	flex-wrap: wrap;
	flex-direction: column;
	max-height: 100vh;
	column-gap: 1rem;
	align-items: center;

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
name: payments
</route>
