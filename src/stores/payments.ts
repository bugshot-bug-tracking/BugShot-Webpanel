import { defineStore } from "pinia";
import { Price, Product } from "~/models/payment/Plan";
import axios from "axios";
import { useOrganizationStore } from "./organization";
import { useAuthStore } from "./auth";

export const usePaymentsStore = defineStore("payments", {
	state: () => ({
		products: [] as Product[],
	}),

	actions: {
		async init() {
			try {
				let response = await axios.get("stripe/products");

				this.products = response.data.data;
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async createCheckout({ price, quantity }: { price: Price; quantity: number }) {
			/**
			 * 1. create the customer -
			 * 2. get the customer id and add it to the checkout session -
			 * 	2.1. include data collection and full agreement in the checkout (auto accept payment method collection) -
			 * 3. the success link should contain the org to be redirected to it -
			 * 4. check if the subscription was created ( idea: check using the subs route)
			 * 5. redirect to the org overview page
			 *
			 */
			let customer = await this.getOrSetCustomer();

			let successUrl = `${window.location.origin}/payment?status=success&org_id=${
				useOrganizationStore().getOrganization!.id
			}`;

			let response = await axios.post("/stripe/checkout/create-session", {
				line_items: [
					{
						price: price.id,
						quantity: quantity,
					},
				],
				mode: "subscription",

				success_url: successUrl,
				cancel_url: window.location.href,

				customer: customer.attributes.stripe_customer_id,

				automatic_tax: { enabled: true },

				billing_address_collection: "required",

				consent_collection: { terms_of_service: "required" },

				customer_update: {
					address: "auto",
					name: "auto",
				},

				payment_method_collection: "if_required",

				tax_id_collection: { enabled: true },
			});

			console.log(response);

			window.location.href = response.data.checkout_session.url;
		},

		async getOrSetCustomer() {
			let organization = useOrganizationStore().getOrganization;

			if (organization == undefined)
				throw {
					code: 0,
					message: "Organization not initialized/found!",
				};

			let response = undefined;

			try {
				response = (await axios.get(`/billing-addresses/organization/${organization.id}`))
					.data.data;
			} catch (error) {
				response = (
					await axios.post(`/billing-addresses/organization/${organization.id}`, {
						street: "0",
						housenumber: "0",
						city: "0",
						state: "0",
						zip: "0",
						country: "0",
						tax_id: "0",
					})
				).data.data;
			}

			if (response.attributes["stripe_customer_id"] == null) {
				let response2 = (
					await axios.post(`/billing-addresses/${response.id}/stripe/customer`)
				).data.data;

				console.log(response2);

				response.attributes["stripe_customer_id"] = response2.id;
			}

			return response;
		},

		async check(value: any) {},

		async startTrial() {
			let user = useAuthStore().user;

			try {
				let response = (await axios.get(`/users/${user.id}/start-trial`)).data.data;
				console.log(response);

				await useAuthStore().refresh();
			} catch (error) {
				console.log(error);
			}
		},
	},

	getters: {
		getProducts: (state) => state.products,

		getActiveProducts: (state) =>
			state.products.filter(
				(p) => p.attributes.active === true && p.attributes.metadata.hidden !== "true"
			),
	},
});
