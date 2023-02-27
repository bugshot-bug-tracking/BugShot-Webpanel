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
			</T2Header>
		</template>

		<article class="bs-scroll" p-8 content-start flex gap-16>
			<div class="component-group" min-w-128 max-w-128>
				<div class="group-content">
					<Container text-left>
						<template #title>
							<h3>
								<b>{{ t("subscription", 2) }}</b>
							</h3>
						</template>

						<n-list class="bs-scroll" v-if="subscriptions">
							<n-list-item
								v-for="subscription in subscriptions"
								:key="subscription.id"
							>
								<div class="plan-item">
									<h4>
										{{ subscription.attributes.name }}
									</h4>

									<div grid grid-cols-2 gap-4 mt-6>
										<div>
											<h6>{{ t("what_is_included") }}</h6>

											<n-list :show-divider="false">
												<n-space vertical>
													<n-list-item
														v-for="feature of subscription.features"
													>
														<template #prefix>
															<div class="dot" />
														</template>

														{{ feature }}
													</n-list-item>
												</n-space>
											</n-list>
										</div>

										<div>
											<h6>{{ t("billing_and_payments") }}</h6>
											<div grid grid-cols-2 gap-4>
												<b>
													{{ t("paid_with") }}
												</b>

												<p style="color: var(--bs-gray)">[PH] stripe</p>
											</div>

											<hr my-2 />

											<div grid grid-cols-2 gap-4>
												<b>
													{{ t("payment", 2) }}
												</b>
												<div style="color: var(--bs-gray)">
													<p>[PH] 12$</p>

													<p>[PH] Next payment on 15.23</p>

													<p>[PH] Monthly payment, prepaid</p>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div flex justify-between items-center px-4>
									<RouterLink
										:to="{
											name: 'organization-payments-subscription-index',
											params: { subscription_id: '55gfg' },
										}"
										mt-8
									>
										<n-button strong ghost round type="success">
											{{ t("manage_subscription") }}
										</n-button>
									</RouterLink>

									<RouterLink
										:to="{
											name: 'organization-payments-subscription-index',
											params: { subscription_id: '55gfg' },
										}"
										mt-8
									>
										<n-button text strong type="tertiary" underline>
											{{ t("view_billing_history") }}
										</n-button>
									</RouterLink>
								</div>
							</n-list-item>
						</n-list>
					</Container>
				</div>
			</div>

			<div class="component-group" min-w-128 max-w-128>
				<div class="group-content">
					<Container text-left>
						<template #title>
							<h3>
								<b> {{ t("license", 2) }} </b>
							</h3>
						</template>

						<n-list class="bs-scroll" v-if="licenses">
							<n-list-item v-for="license in licenses" :key="license.id">
								<div class="plan-item">
									<h4>
										{{ license.attributes.name }}
									</h4>

									<div grid grid-cols-2 gap-4 mt-6>
										<div>
											<h6>
												{{
													t(
														"number_of_licenses_n",
														license.attributes.quantity
													)
												}}
											</h6>

											<n-list show-divider>
												<n-list-item my-4>
													<div
														grid
														style="grid-template-columns: 1fr 2fr"
													>
														<p>
															<b>{{ t("monthly") }}</b>
														</p>

														<div
															flex
															flex-col
															gap-2
															mb-2
															style="color: var(--bs-gray)"
														>
															<p><b>[PH] 10 used licenses </b></p>
															<p>[PH] 5 unused</p>
														</div>
													</div>
												</n-list-item>

												<n-list-item my-4>
													<div
														grid
														style="grid-template-columns: 1fr 2fr"
													>
														<p>
															<b>{{ t("yearly") }}</b>
														</p>

														<div
															flex
															flex-col
															gap-2
															mb-2
															style="color: var(--bs-gray)"
														>
															<p><b>[PH] 8 used licenses</b></p>

															<p>[PH] 2 unused</p>
														</div>
													</div>
												</n-list-item>
											</n-list>
										</div>

										<div>
											<h6>{{ t("billing_and_payments") }}</h6>
											<div grid grid-cols-2 gap-4>
												<b>
													{{ t("paid_with") }}
												</b>

												<p style="color: var(--bs-gray)">[PH] stripe</p>
											</div>

											<hr my-2 />

											<div grid grid-cols-2 gap-4>
												<b>
													{{ t("payment", 2) }}
												</b>
												<div style="color: var(--bs-gray)">
													<p>[PH] 12$</p>

													<p>[PH] Next payment on 15.23</p>

													<p>[PH] Monthly payment, prepaid</p>
												</div>
											</div>
										</div>
									</div>
								</div>

								<!-- <RouterLink
									:to="{
										name: 'organization-payments-license-index',
									}"
									mt-8
								> -->
								<n-button strong ghost round type="success">
									{{ t("manage_licenses") }}
								</n-button>
								<!-- </RouterLink> -->
							</n-list-item>
						</n-list>
					</Container>
				</div>
			</div>
		</article>
	</T2Page>
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";

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

const subscriptions = computed(() => store.getSubscriptions);

const licenses = computed(() => store.getLicenses);
</script>

<style scoped lang="scss">
article {
	max-height: 100%;
}

h6 {
	background-color: var(--bs-purple-light);
	font-weight: bold;
	margin-bottom: 1rem;
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
</style>

<route lang="yaml">
name: organization-payments
</route>
