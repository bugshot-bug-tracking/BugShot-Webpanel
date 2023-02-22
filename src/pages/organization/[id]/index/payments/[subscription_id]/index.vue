<template>
	<section name="actions" p-8 class="" text-left>
		<header flex flex-col items-start gap-2 mb-8>
			<h3>
				{{ t("available_actions") }}
			</h3>
			<span order--1>
				{{ t("want_to_change_subscription") }}
			</span>
		</header>

		<div flex flex-col gap-4>
			<n-card flex-row items-center :bordered="false" hoverable class="bs-b">
				<template #header>
					<img src="/src/assets/icons/starter.svg" alt="" w-14 h-14 />
				</template>

				<h5>
					{{ t("change_subscription_text") }}
				</h5>

				<p>
					{{ t("change_subscription_subtext") }}
				</p>
				<template #footer>
					<n-button strong type="primary"> {{ t("change_subscription") }} </n-button>
				</template>
			</n-card>

			<n-card flex-row items-center :bordered="false" hoverable class="bs-b">
				<template #header>
					<img src="/src/assets/icons/enterprise.svg" alt="" w-14 h-14 />
				</template>

				<h5>
					{{ t("cancel_subscription_text") }}
				</h5>

				<p>
					{{ t("cancel_subscription_subtext") }}
				</p>

				<template #footer>
					<RouterLink
						:to="{
							name: 'organization-payments-subscription-cancel',
							params: { subscription_id },
						}"
					>
						<n-button ghost strong type="tertiary">
							{{ t("cancel_subscription") }}
						</n-button>
					</RouterLink>
				</template>
			</n-card>
		</div>
	</section>
</template>

<script setup lang="ts">
defineProps({
	subscription_id: String,
});

const { t } = useI18n();
</script>

<style scoped lang="scss">
h3 {
	font-weight: bold;
}

h5 {
	font-weight: bold;
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
