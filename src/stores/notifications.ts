import { defineStore } from "pinia";

import { useAuthStore } from "./auth";
import axios from "axios";
import { echo } from "~/composables/listeners";
import { Invitation } from "~/models/Invitation";
import { useDiscreteApi } from "~/composables/DiscreteApi";
import { useGlobalI18n } from "~/composables/GlobalI18n";

export const useNotificationStore = defineStore("notification", {
	state: () => ({
		user: useAuthStore().user,

		notifications: [] as Invitation[],
	}),

	actions: {},

	getters: {},
});
