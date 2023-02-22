<template>
	<T2Page>
		<template #header>
			<T2Header>
				<template #l-top>
					{{ subscription.name }}
				</template>

				<template #l-bottom>
					{{ resource.attributes.designation }}
				</template>
			</T2Header>
		</template>

		<article class="bs-scroll">
			<section name="info" p-8 class="bs-br" text-left>
				<header flex flex-col items-start gap-2 mb-8>
					<h3>
						{{ subscription.name }}
					</h3>

					<span order--1>{{ t("you_are_using") }}</span>
				</header>

				<div>
					<div>
						<h6 py-1 mb-4>
							{{ t("billing_and_payments") }}
						</h6>

						<div grid gap-4 style="grid-template-columns: 1fr 2fr">
							<b>
								{{ t("paid_with") }}
							</b>

							<p style="color: var(--bs-gray)">[PH] Stripe</p>
						</div>

						<hr my-2 />

						<div grid gap-4 style="grid-template-columns: 1fr 2fr">
							<b>
								{{ t("payment", 2) }}
							</b>

							<div style="color: var(--bs-gray)">
								<p><b>[PH] 12$</b></p>

								<p>[PH] Next payment on 15.23</p>
								<p>[PH] Monthly payment, prepaid</p>
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

defineProps({
	subscription_id: String,
});

const { t } = useI18n();

const store = useOrganizationStore();

const resource = computed(() => store.getOrganization!);

const subscription = {
	name: "[PH] subscription #1",
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

h3 {
	font-weight: bold;
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
