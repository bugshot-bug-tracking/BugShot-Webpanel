<template>
	<T2Page>
		<template #header>
			<T2Header>
				<template #l-top>
					{{ t("organization") }}
				</template>

				<template #l-bottom>
					{{ organization.attributes.designation }}
				</template>
			</T2Header>
		</template>

		<article>
			<div class="component-group" min-w-128>
				<div class="group-header" flex justify-between>
					<span>{{ t("license", 2) }}</span>

					<div flex gap-4>
						<div
							:class="recurring === 'month' ? 'black-to-purple' : 'black-to-gray'"
							@click="recurring = 'month'"
							cursor-pointer
							font-bold
						>
							{{ $t("monthly") }}
						</div>

						<div
							:class="recurring === 'year' ? 'black-to-green' : 'black-to-gray'"
							@click="recurring = 'year'"
							cursor-pointer
							font-bold
						>
							{{ $t("yearly") }}
						</div>
					</div>
				</div>

				<div class="group-content">
					<ul class="bs-scroll">
						<li v-for="product in products" :key="product.id">
							<PlanTicket
								:owned="organizationStore.getLicense(product.id)?.quantity"
								:name="product.attributes.name"
								:image="product.attributes.images[0]"
								:price="
									(price(product.attributes.prices)?.attributes.unit_amount ??
										0) / 100
								"
								:recurring="recurring"
								:feature_list="getFeatureList(product)"
								:value="
									cart.getItem(product.id, price(product.attributes.prices).id)
										?.quantity ?? 0
								"
								@change="
									cart.update({
										product: product,
										price: price(product.attributes.prices),
										quantity: $event,
									})
								"
							/>
						</li>
					</ul>
				</div>
			</div>

			<div class="component-group" min-w-128 max-w-128>
				<div class="group-header">Summary</div>

				<div class="group-content">
					<Container>
						<template #header>
							<div flex justify-between style="width: 100%">
								<div>Item</div>
								<div>Quantity</div>
								<div>Price</div>
							</div>
						</template>

						<div class="cart">
							<ol>
								<li
									v-for="item in cart.items"
									:key="item.product.id + item.price.id"
								>
									{{ item.product.attributes.name }} : {{ item.quantity }}
								</li>
							</ol>
						</div>

						<template #footer>
							<div flex justify-between>
								<div>Total:</div>
								<div cursor-pointer>1000$</div>
							</div>
						</template>
					</Container>
				</div>
			</div>
		</article>
	</T2Page>
</template>

<script setup lang="ts">
import { Price, Product } from "~/models/payment/Plan";
import { useOrganizationStore } from "~/stores/organization";
import { usePaymentsStore } from "~/stores/payments";

// const props =
defineProps({
	id: {
		type: String,
		required: true,
		description: "Organization ID",
	},
});

const { t } = useI18n();

const organizationStore = useOrganizationStore();

const organization = computed(() => organizationStore.getOrganization!);

const store = usePaymentsStore();

const products = computed(() => store.getActiveProducts);

const recurring = ref("month");

const price = (prices: Price[]) => {
	return prices.find((price: Price) => price.attributes.recurring?.interval === recurring.value)!;
};

const cart = reactive({
	items: [] as {
		product: Product;
		price: Price;
		quantity: number;
	}[],

	update: ({
		product,
		price,
		quantity,
	}: {
		product: Product;
		price: Price;
		quantity: number;
	}) => {
		let existent = cart.items.findIndex(
			(x) => x.product.id === product.id && x.price.id === price.id
		);

		// prevent 0 quantity items in the cart
		if (quantity === 0 && existent !== -1) return cart.items.splice(existent, 1);

		if (existent !== -1) cart.items[existent].quantity = quantity;
		else
			cart.items.push({
				product,
				price,
				quantity,
			});
	},

	getItem: (product_id: string, price_id: string) => {
		return cart.items.find((x) => x.product.id === product_id && x.price.id === price_id);
	},
});

const getFeatureList = (product: Product) => {
	return product.attributes.metadata.feature_list?.split(";") ?? [];
};
</script>

<style lang="scss" scoped>
article {
	height: 99%;
	display: flex;
	justify-content: start;
	gap: 4rem;
	padding: 2rem;
}
ul {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	max-height: 98%;
	padding-right: 1rem;

	li {
	}
}

ol {
	padding: 0.5rem 1rem;
	list-style: number;
	text-align: left;

	li {
	}
}
</style>

<route lang="yaml">
name: organization-payments-buy
</route>
