import { defineStore } from "pinia";
import { Price, Product } from "~/models/payment/Plan";
import axios from "axios";
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
			let response = await axios.post("/stripe/checkout/create-session", {
				line_items: [
					{
						price: price.id,
						quantity: quantity,
					},
				],
				mode: "subscription",

				success_url: "http://localhost:8080/payment?status=success",
				cancel_url: window.location.href,

				subscription_data: {
					trial_settings: { end_behavior: { missing_payment_method: "create_invoice" } },
					trial_period_days: 14,
				},

				payment_method_collection: "if_required",

				customer_email: useAuthStore().user.attributes.email,

				// consent_collection: {
				// 	terms_of_service: "required",
				// },
			});

			console.log(response);

			window.location.href = response.data.checkout_session.url;
		},

		async stripe() {},

		async check(value: any) {
			console.log(value);

			let customer = await this.getCustomer();

			let response = await axios.post("/stripe/checkout/create-session", {
				line_items: [
					{
						price: value.id,
						quantity: 1,
					},
				],
				mode: "subscription",
				// success_url: "https://app.bugshot.de?status=success",
				success_url: "http://localhost:8080/payment?status=success",
				cancel_url: "https://dev.bugshot.de",
				customer: customer.id,

				billing_address_collection: "required",

				customer_update: {
					address: "auto",
					name: "auto",
				},

				// consent_collection: {
				// 	terms_of_service: "required",
				// },
			});

			console.log(response);

			window.location.href = response.data.checkout_session.url;
		},

		async getCustomer() {
			let user = useAuthStore().getUser;

			let ba = await axios
				.get(`/billing-addresses/user/${user.id}`)
				.catch((error) => {
					return undefined;
				});

			if (!ba) {
				ba = await axios.post(`/billing-addresses/user/${user.id}`, {
					street: "string",
					housenumber: "string",
					city: "string",
					state: "string",
					zip: "string",
					country: "string",
					tax_id: "string",
				});
			}

			// get or create
			let customer = await axios.post(
				`/billing-addresses/${ba.data.data.id}/stripe/customer`
			);

			return customer.data.data;
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
