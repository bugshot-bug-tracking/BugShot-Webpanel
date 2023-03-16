<template>
	<T2Page>
		<template #header>
			<T2Header>
				<template #l-top>
					{{ t("payments_and_plans") }}
				</template>

				<template #l-bottom>
					{{ resource.attributes.designation }}
				</template>

				<template #center>
					<SearchBar w-160 />
				</template>
			</T2Header>
		</template>

		<article class="bs-scroll" p-8 content-start flex gap-16>
			<div class="component-group" min-w-172 max-w-172>
				<div class="group-content">
					<Container text-left>
						<template #title>
							<h3>
								<b>{{ t("subscription", 2) }}</b>
							</h3>
						</template>

						<template #after-title>
							<p text-5 flex gap-1 items-baseline ml-a>
								<b
									class="month-opt"
									:class="{ 'selected-opt': isMonthly }"
									@click="isMonthly = true"
								>
									{{ $t("monthly") }}
								</b>

								<n-switch
									size="small"
									@click="isMonthly = !isMonthly"
									:value="!isMonthly"
								/>

								<b
									class="year-opt"
									:class="{ 'selected-opt': !isMonthly }"
									@click="isMonthly = false"
								>
									{{ $t("yearly") }}
								</b>
							</p>
						</template>

						<n-list
							class="bs-scroll"
							v-if="(subscriptions?.length ?? 0) > 0"
							flex
							flex-col
							gap-4
						>
							<n-list-item v-for="subscription of subscriptions">
								<div class="plan-item">
									<h4>
										{{ getSubscriptionName(subscription) }}
									</h4>

									<div grid grid-cols-2 gap-4 mt-6>
										<div flex flex-col>
											<h6>{{ t("billing_and_payments") }}</h6>

											<div grid grid-cols-2 gap-4>
												<b>
													{{ t("paid_with") }}
												</b>

												<p style="color: var(--bs-gray)">Stripe</p>
											</div>

											<hr my-2 />

											<div grid grid-cols-2 gap-4>
												<b>
													{{ t("payment", 2) }}
												</b>
												<div style="color: var(--bs-gray)">
													<p>
														<b>
															{{ getSubscriptionPrice(subscription) }}
															€
														</b>
													</p>

													<p v-if="!isSubscriptionCanceled(subscription)">
														{{
															$t("next_payment_on_s", [
																getSubscriptionNextPayment(
																	subscription
																),
															])
														}}
													</p>

													<p v-else style="color: var(--bs-red)">
														{{
															$t("subscription_wil_end_at_s", [
																getSubscriptionNextPayment(
																	subscription
																),
															])
														}}
													</p>

													<p>
														{{
															getSubscriptionPaymentType(
																subscription
															) === "month"
																? $t("monthly_payment_prepaid")
																: $t("yearly_payment_prepaid")
														}}
													</p>
												</div>
											</div>

											<RouterLink
												:to="{
													name: 'organization-payments-subscription-index',
													params: { subscription_id: subscription.id },
												}"
												mt-8
												mx-a
											>
												<n-button strong ghost round type="success">
													{{ t("manage_subscription") }}
												</n-button>
											</RouterLink>
										</div>

										<div flex flex-col>
											<h6>
												{{
													t(
														"number_of_licenses_n",
														getLicenseTotalQuantity(subscription)
													)
												}}
											</h6>

											<n-list show-divider>
												<n-list-item>
													<div
														grid
														style="grid-template-columns: 1fr 2fr"
													>
														<p>
															<b>{{ $t("license", 2) }} </b>
														</p>

														<div
															flex
															flex-col
															gap-2
															mb-2
															style="color: var(--bs-gray)"
														>
															<p>
																<b>
																	{{
																		t(
																			"n_licenses_used",
																			getLicenseStatistics(
																				subscription
																			).used
																		)
																	}}
																</b>
															</p>
															<p>
																{{
																	t(
																		"n_licenses_available",
																		getLicenseStatistics(
																			subscription
																		).unused
																	)
																}}
															</p>
														</div>
													</div>
												</n-list-item>
											</n-list>

											<RouterLink
												:to="{
													name: 'organization-payments-subscription-licenses',
													params: { subscription_id: subscription.id },
												}"
												mt-a
												mx-a
											>
												<n-button strong ghost round type="success">
													{{ t("manage_licenses") }}
												</n-button>
											</RouterLink>
										</div>
									</div>
								</div>
							</n-list-item>
						</n-list>

						<n-empty
							v-else
							:description="
								isMonthly
									? $t('no_monthly_subscriptions')
									: $t('no_yearly_subscriptions')
							"
						/>

						<div flex justify-around my-8>
							<n-button
								type="success"
								@click="startTrial"
								strong
								round
								v-if="user.attributes.trial_end_date == null"
							>
								{{ $t("start_trial") }}
							</n-button>

							<RouterLink
								:to="{
									name: 'organization-payments-plans',
									params: { id: id },
								}"
							>
								<n-button strong round type="primary">
									{{ $t("buy_a_subscription") }}
								</n-button>
							</RouterLink>
						</div>
					</Container>
				</div>
			</div>
		</article>
	</T2Page>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useOrganizationStore } from "~/stores/organization";
import { usePaymentsStore } from "~/stores/payments";

const user = computed(() => useAuthStore().getUser);

// const props =
defineProps({
	id: {
		type: String,
		required: true,
		description: "Organization ID",
	},
});

const { t } = useI18n();

const store = useOrganizationStore();

const resource = computed(() => store.getOrganization!);

const isMonthly = ref(true);

const subscriptions = computed(() => {
	let s = store.getSubscriptions;
	console.log(s);

	return s?.filter((s) => s.attributes.plan.interval === (isMonthly.value ? "month" : "year"));
});

const getSubscriptionName = (subscription: any) => {
	let id = subscription.attributes.plan.product;

	let product = usePaymentsStore().products.find((p) => p.id === id);

	return product?.attributes.name;
};

const getSubscriptionPrice = (subscription: any) => {
	let id = subscription.attributes.plan.product;
	let price_id = subscription.attributes.plan.id;
	let quantity = subscription.attributes.quantity;

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

const getSubscriptionNextPayment = (subscription: any) => {
	let end = subscription.attributes.current_period_end;

	let date = new Date(end * 1000);

	return date.toLocaleDateString();
};

const getSubscriptionPaymentType = (subscription: any) => {
	let interval = subscription.attributes.plan.interval;

	return interval;
};

const getLicenseTotalQuantity = (subscription: any) => {
	return subscription.attributes.items.data[0].quantity;
};

const getLicenseStatistics = (subscription: any) => {
	return {
		used: subscription.attributes.items.data[0].assigned,
		unused:
			subscription.attributes.items.data[0].quantity -
			subscription.attributes.items.data[0].assigned,
	};
};

const isSubscriptionCanceled = (subscription: any) => {
	let canceled = subscription.attributes.cancel_at_period_end;

	let period_end = subscription.attributes.current_period_end;

	if (canceled) return new Date(period_end * 1000);
	return undefined;
};

const startTrial = async () => {
	await usePaymentsStore().startTrial();

	useOrganizationStore().refresh();
};
</script>

<style scoped lang="scss">
article {
	max-height: 100%;
}

h6 {
	background-color: var(--bs-purple-light);
	font-weight: bold;
	margin-bottom: 1rem;
	padding: 0.25rem 0.25rem;
}

:deep(.bs-container) {
	header {
		border-bottom: unset;
	}
}

:deep(.n-list) {
	padding-right: 0.5rem;

	.n-list-item {
		.n-list-item {
			padding: 0;
		}
		.n-list-item__prefix {
			margin-right: 0.5rem;
		}
	}
}

.dot {
	width: 0.375rem;
	height: 0.375rem;
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
</style>

<route lang="yaml">
name: organization-payments
</route>
