import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useSettingsStore = defineStore("settings", {
	state: () => ({
		companiesOrder: useStorage("companiesOrder", 0),
		organizationsOrder: useStorage("organizationsOrder", 0),
	}),

	actions: {
		setCompaniesOrder(value: number) {
			if (isNaN(value)) {
				let n = parseInt("" + value);

				if (isNaN(n)) throw new Error("Value for companies sort is NaN");

				this.companiesOrder = n;
			} else this.companiesOrder = value;
		},

		setOrganizationsOrder(value: number) {
			if (isNaN(value)) {
				let n = parseInt("" + value);

				if (isNaN(n)) throw new Error("Value for organizations sort is NaN");

				this.organizationsOrder = n;
			} else this.organizationsOrder = value;
		},
	},

	getters: {
		getCompaniesOrder: (state) => state.companiesOrder,
		getOrganizationsOrder: (state) => state.organizationsOrder,
	},
});
