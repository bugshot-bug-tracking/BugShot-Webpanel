<template>
	<Single flex-1 flex>
		<main class="main-loading" v-if="loading">
			<img src="/src/assets/animations/loading.svg" alt="loading circle" />
		</main>

		<main flex-1 max-h-100vh v-else>
			<n-scrollbar>
				<div flex flex-col items-center gap-12 justify-center py-8>
					<div>
						<n-h1>
							<n-text type="primary" font-bold>
								{{ t("welcome_page.header") }}
							</n-text>
						</n-h1>
						<n-p max-w-66ch text-balance>{{ t("welcome_page.subheader") }} </n-p>
					</div>

					<n-list
						flex
						gap-8
						style="background-color: transparent"
						:show-divider="false"
						items-start
						justify-center
						flex-wrap
						px-4
						py-2
					>
						<n-list-item>
							<PlanCard2
								:value="trialCard"
								@action="startTrial"
								:disabled="buttonLoading !== undefined"
								:loading="buttonLoading === 'trial'"
							/>
						</n-list-item>

						<n-list-item v-for="item in processedProducts">
							<PlanCard2
								:value="{
									type: item.type,
									price: item.prices.monthly.unit_amount,
									features: item.features,
									multiple: item.prices.monthly.extra_unit_amount ? true : false,
									extra_price: item.prices.monthly.extra_unit_amount,
									color:
										item.type === 'individual'
											? 'var(--bs-green)'
											: item.type === 'team'
											? 'var(--bs-yellow)'
											: undefined,
								}"
								@action="buyLicense(item, $event)"
								:disabled="buttonLoading !== undefined"
								:loading="buttonLoading === item.type"
							/>
						</n-list-item>
					</n-list>
				</div>
			</n-scrollbar>
		</main>
	</Single>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useMainStore } from "~/stores/main";
import { useOrganizationStore } from "~/stores/organization";
import { usePaymentsStore } from "~/stores/payments";

const { t } = useI18n();

const user = computed(() => useAuthStore().getUser!);

const router = useRouter();

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

const buttonLoading = ref<string | undefined>(undefined);

const startTrial = async () => {
	buttonLoading.value = "trial";
	await store.startTrial();

	router.push({ name: "organization-index" });
};

const buyLicense = async (item: (typeof processedProducts.value)[0], quantity: number) => {
	buttonLoading.value = item.type;

	// just a safety measure
	if (quantity < 1) quantity = 1;

	let main = useMainStore();

	let org = main.organizations?.find((o) => o.attributes.creator?.id === user.value.id)!;

	await useOrganizationStore().init(org.id);

	let mainPrice = item.prices.monthly.price;

	await store.createCheckout({
		price: mainPrice!,
		quantity,
	});

	buttonLoading.value = undefined;
};

const trialCard = {
	type: "trial",
	price: 0,
	features: ["f_1", "f_2", "f_3", "f_4", "f_5", "f_6", "f_7"],
};

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
					unit_amount:
						prod.attributes.prices
							.find((x) => x.attributes.recurring.interval === "month")
							?.attributes.tiers?.find((t) => t.up_to === 1)?.unit_amount ||
						prod.attributes.prices.find(
							(x) => x.attributes.recurring.interval === "month"
						)?.attributes.unit_amount,

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

					unit_amount:
						prod.attributes.prices
							.find((x) => x.attributes.recurring.interval === "year")
							?.attributes.tiers?.find((t) => t.up_to === 1)?.unit_amount ||
						prod.attributes.prices.find(
							(x) => x.attributes.recurring.interval === "year"
						)?.attributes.unit_amount,

					extra: prod.attributes.prices
						.find((x) => x.attributes.recurring.interval === "year")
						?.attributes.tiers?.find((t) => t.up_to == null),

					extra_unit_amount: prod.attributes.prices
						.find((x) => x.attributes.recurring.interval === "year")
						?.attributes.tiers?.find((t) => t.up_to == null)?.unit_amount,
				},
			},

			features: prod.attributes.metadata.feature_list?.split(";"),

			type: prod.attributes.metadata.type,

			image: prod.attributes.metadata.image,
		}))
		.sort((a, b) => (a.prices.monthly?.unit_amount ?? 0) - (b.prices.monthly?.unit_amount ?? 0))
);
</script>

<style scoped lang="scss"></style>

<route lang="yaml">
name: welcome
</route>
