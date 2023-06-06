<template>
	<section name="actions" p-8 class="" text-left>
		<header flex flex-col items-start gap-2 mb-8>
			<n-h2 m-0>
				{{ t("available_actions") }}
			</n-h2>
			<span order--1>
				{{ t("want_to_change_subscription") }}
			</span>
		</header>

		<div flex flex-col gap-4 style="width: 100%">
			<n-card flex-row items-center :bordered="false" class="bs-b" v-if="false">
				<template #header>
					<img src="/src/assets/icons/star_search.svg" alt="" w-14 h-14 />
				</template>

				<n-h4 m-0>
					{{ t("change_subscription_text") }}
				</n-h4>

				<p>
					{{ t("change_subscription_subtext") }}
				</p>
				<template #footer>
					<n-button strong type="primary"> {{ t("change_subscription") }} </n-button>
				</template>
			</n-card>

			<n-card flex-row items-center :bordered="false" class="bs-b">
				<template #header>
					<img src="/src/assets/icons/do_not_disturb.svg" alt="" w-14 h-14 />
				</template>

				<n-h4 m-0>
					{{ t("cancel_subscription_text") }}
				</n-h4>

				<p>
					{{ t("cancel_subscription_subtext") }}
				</p>

				<template #footer>
					<n-button
						ghost
						strong
						type="tertiary"
						:disabled="isSubscriptionCanceled()"
						@click="redirectToCancel"
					>
						{{ t("cancel_subscription") }}
					</n-button>
				</template>
			</n-card>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useOrganizationStore } from "~/stores/organization";

const props = defineProps({
	id: String,
	subscription_id: String,
});

const { t } = useI18n();

const router = useRouter();

const isSubscriptionCanceled = () => {
	let subscription = useOrganizationStore().getSubscriptionById(props.subscription_id);

	let canceled = subscription.attributes.cancel_at_period_end;

	if (canceled) return true;
	return false;
};

const redirectToCancel = () => {
	router.push({
		name: "organization-payments-subscription-cancel",
		params: { id: props.id, subscription_id: props.subscription_id },
	});
};
</script>

<style scoped lang="scss">
h2 {
	font-weight: bold;
}

h4 {
	font-weight: bold;
}

section {
	width: 100%;
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
name: organization-payments-subscription-index
</route>
