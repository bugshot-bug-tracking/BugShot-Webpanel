import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useSettingsStore = defineStore("settings", {
	state: () => ({
		organizationsOrder: useStorage("organizationsOrder", 11),
		companiesOrder: useStorage("companiesOrder", 31),
		projectsOrder: useStorage("projectsOrder", 31),

		preferredOrganization: useStorage("pref-org", ""),

		extensionInstallHint: useStorage("extInstallHint", ""),
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

		setExtensionInstallHint(value: string) {
			this.extensionInstallHint = value;
		},
	},

	getters: {
		getOrganizationsOrder: (state) => state.organizationsOrder,
		getCompaniesOrder: (state) => state.companiesOrder,
		getProjectsOrder: (state) => state.projectsOrder,
		getPreferredOrganization: (state) => state.preferredOrganization,

		getExtensionInstallHint: (state) => {
			try {
				if (state.extensionInstallHint === "") return undefined;

				return new Date(state.extensionInstallHint);
			} catch (error) {
				console.log(error);
				return undefined;
			}
		},
	},
});
