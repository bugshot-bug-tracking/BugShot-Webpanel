import { defineStore } from "pinia";

import axios from "axios";
import { useMainStore } from "./main";

export const useOrganizationStore = defineStore("organization", {
	state: () => ({}),

	actions: {
		async createOrganization({ designation }: { designation: string }) {
			let response = await axios.post("organizations", { designation });
			console.log(response);

			useMainStore().organizations.push(response.data.data);
		},
	},

	getters: {},
});
