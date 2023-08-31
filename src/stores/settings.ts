import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useSettingsStore = defineStore("settings", {
	state: () => ({
		organizationsOrder: useStorage("organizationsOrder", 11),
		companiesOrder: useStorage("companiesOrder", 11),
		projectsOrder: useStorage("projectsOrder", 11),

		preferredOrganization: useStorage("pref-org", ""),

		extensionInstallHint: useStorage("extensionInstallHint", 1),
	}),

	actions: {
		setOrganizationsOrder(value: number) {
			if (isNaN(value)) {
				let n = parseInt("" + value);

				if (isNaN(n)) throw new Error("Value for organizations sort is NaN");

				this.organizationsOrder = n;
			} else this.organizationsOrder = value;
		},

		setCompaniesOrder(value: number) {
			if (isNaN(value)) {
				let n = parseInt("" + value);

				if (isNaN(n)) throw new Error("Value for companies sort is NaN");

				this.companiesOrder = n;
			} else this.companiesOrder = value;
		},

		setProjectsOrder(value: number) {
			if (isNaN(value)) {
				let n = parseInt("" + value);

				if (isNaN(n)) throw new Error("Value for projects sort is NaN");

				this.projectsOrder = n;
			} else this.projectsOrder = value;
		},

		setPreferredOrganization(id: string) {
			this.preferredOrganization = id;
		},

		setExtensionInstallHint(value: boolean) {
			console.log(value);
			this.extensionInstallHint = value ? 1 : 0;
		},
	},

	getters: {
		getOrganizationsOrder: (state) => state.organizationsOrder,
		getCompaniesOrder: (state) => state.companiesOrder,
		getProjectsOrder: (state) => state.projectsOrder,
		getPreferredOrganization: (state) => state.preferredOrganization,

		getExtensionInstallHint: (state) => {
			if (state.extensionInstallHint === 1) return true;
			else return false;
		},
	},
});
