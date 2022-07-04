import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useSettingsStore = defineStore("settings", {
	state: () => ({
		companiesOrder: useStorage("companiesOrder", 0),
	}),

	actions: {
		async setCompaniesOrder(value: number) {
			if (isNaN(value)) {
				let n = parseInt("" + value);

				if (isNaN(n))
					throw new Error("Value for companies sort is NaN");

				this.companiesOrder = n;
			} else this.companiesOrder = value;
		},
	},

	getters: {
		getCompaniesOrder: (state) => state.companiesOrder,
	},
});
