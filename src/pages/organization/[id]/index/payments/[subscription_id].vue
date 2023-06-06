<template>
	<T2Page v-if="subscription">
		<template #header>
			<T3Header>
				<template #l-top>
					{{ getSubscriptionName() }}
				</template>

				<template #l-bottom>
					{{ resource.attributes.designation }}
				</template>

				<template #center>
					<SearchBar />
				</template>
			</T3Header>
		</template>

		<article class="bs-scroll">
			<section name="info" p-8 class="bs-br" text-left>
				<header flex flex-col items-start gap-2 mb-8>
					<n-h2 m-0 font-bold>
						{{ getSubscriptionName() }}
					</n-h2>

					<span order--1>{{ t("you_are_using") }}</span>
				</header>

				<div flex flex-col gap-12>
					<div>
						<n-h6 p-1 mb-4>
							{{ t("billing_and_payments") }}
						</n-h6>

						<div grid gap-4 style="grid-template-columns: 1fr 2fr">
							<b>
								{{ t("paid_with") }}
							</b>

							<p style="color: var(--bs-gray)">Stripe</p>
						</div>

						<hr my-2 />

						<div grid gap-4 style="grid-template-columns: 1fr 2fr">
							<b>
								{{ t("payment", 2) }}
							</b>

							<div style="color: var(--bs-gray)">
								<p>
									<b> {{ n(getSubscriptionPrice()) }} € </b>
								</p>

								<p v-if="!isSubscriptionCanceled()">
									{{ $t("next_payment_on_s", [getSubscriptionNextPayment()]) }}
								</p>

								<p v-else style="color: var(--bs-red)">
									{{
										$t("subscription_wil_end_at_s", [
											getSubscriptionNextPayment(),
										])
									}}
								</p>
								<p>
									{{
										getSubscriptionPaymentType() === "month"
											? $t("monthly_payment_prepaid")
											: $t("yearly_payment_prepaid")
									}}
								</p>
							</div>
						</div>
					</div>

					<div>
						<n-h6 p-1 mb-4>
							{{ t("number_of_licenses_n", [getLicenseTotalQuantity()]) }}
						</n-h6>

						<div grid style="grid-template-columns: 1fr 2fr">
							<p>
								<b>{{ $t("license", 2) }} </b>
							</p>

							<div flex flex-col gap-2 mb-2 style="color: var(--bs-gray)">
								<p>
									<b>
										{{ t("n_licenses_used", getLicenseStatistics().used) }}
									</b>
								</p>
								<p>
									{{ t("n_licenses_available", getLicenseStatistics().unused) }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<RouterView />
		</article>
	</T2Page>
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";
import { usePaymentsStore } from "~/stores/payments";

const props = defineProps({
	subscription_id: {
		type: String,
		required: true,
	},
});

const { t, d, n } = useI18n();

const store = useOrganizationStore();

const resource = computed(() => store.getOrganization!);

const subscription = computed(() => store.getSubscriptionById(props.subscription_id!));

const getSubscriptionName = () => {
	let id = subscription.value.attributes.plan.product;

	let product = usePaymentsStore().products.find((p) => p.id === id);

	return product?.attributes.name;
};

const getSubscriptionPrice = () => {
	let id = subscription.value.attributes.plan.product;
	let price_id = subscription.value.attributes.plan.id;
	let quantity = subscription.value.attributes.quantity;

	let product = usePaymentsStore().products.find((p) => p.id === id);

	let price = product?.attributes.prices.find((price) => price.id === price_id);
	let tiers = price?.attributes.tiers;

	let total = 0;

	tiers?.forEach((tier) => {
		if (tier.up_to === 1) total += tier.unit_amount;
		else total += tier.unit_amount * (quantity - 1);
	});

	return total / 100;
};

const getSubscriptionNextPayment = () => {
	let end = subscription.value.attributes.current_period_end;

	let date = new Date(end * 1000);

	return d(date);
};

const getSubscriptionPaymentType = () => {
	let interval = subscription.value.attributes.plan.interval;

	return interval;
};

const isSubscriptionCanceled = () => {
	let canceled = subscription.value.attributes.cancel_at_period_end;

	let period_end = subscription.value.attributes.current_period_end;

	if (canceled) return new Date(period_end * 1000);
	return undefined;
};

const getLicenseStatistics = () => {
	return {
		used: subscription.value.attributes.items.data[0].assigned,
		unused:
			subscription.value.attributes.items.data[0].quantity -
			subscription.value.attributes.items.data[0].assigned,
	};
};

const getLicenseTotalQuantity = () => {
	return subscription.value.attributes.items.data[0].quantity;
};
</script>

<style scoped lang="scss">
article {
	display: flex;

	width: 100%;
	height: 100%;
}

section[name="info"] {
	width: 30rem;
}

h6 {
	font-weight: bold;
	background-color: var(--bs-purple-light);
}

:deep(.n-card) {
	padding: 2rem;
	border-radius: 0.5rem;

	.n-card__content,
	.n-card__footer {
		padding-bottom: 0;
	}
}
</style>

<route lang="yaml">
name: organization-payments-subscription
</route>
