import { defineStore } from "pinia";
import axios from "axios";
import { Bug } from "~/models/Bug";
import { User } from "~/models/User";

export const useApprovalsStore = defineStore("approvals", {
	state: () => ({
		user: undefined as User | undefined,

		bugs: undefined as Bug[] | undefined,
	}),

	actions: {
		async init(token: string) {
			try {
				await this.getUser(token);
			} catch (error) {
				console.log(error);
				// throw error;
			}

			this.bugs = [
				{
					id: "668daccb-1af5-4092-8229-d8167d0e1134",
					type: "Bug",
					attributes: {
						state: "pending",
						project_id: "7077f39d-bb4a-4002-ad7f-ae123605e71d",
						creator: {
							id: 4,
							type: "User",
							attributes: {
								first_name: "Radu",
								last_name: "Memetea",
								email: "r@r.ro",
								trial_end_date: "2033-03-21",
							},
						},
						designation: "test",
						description: null,
						url: "https://www.youtube.com/",
						status_id: "145d7da2-4a0f-47cc-8f49-5293e3c6146b",
						order_number: 0,
						ai_id: 0,
						client_id: null,
						priority: {
							id: 2,
							type: "Priority",
							attributes: {
								designation: "Normal",
							},
						},
						operating_system: "Windows",
						browser: "Chrome 105",
						selector:
							"html > body > ytd-app > div#content.style-scope.ytd-app > ytd-page-manager#page-manager.style-scope.ytd-app > ytd-browse.style-scope.ytd-page-manager > ytd-two-column-browse-results-renderer.style-scope.ytd-browse.grid-disabled > div#primary.style-scope.ytd-two-column-browse-results-renderer > ytd-rich-grid-renderer.style-scope.ytd-two-column-browse-results-renderer > div#contents.style-scope.ytd-rich-grid-renderer > ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer > div#contents.style-scope.ytd-rich-grid-row > ytd-rich-item-renderer.style-scope.ytd-rich-grid-row > div#content.style-scope.ytd-rich-item-renderer > ytd-rich-grid-media.style-scope.ytd-rich-item-renderer > div#dismissible.style-scope.ytd-rich-grid-media > ytd-thumbnail.style-scope.ytd-rich-grid-media > a#thumbnail.yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail > div#hover-overlays.style-scope.ytd-thumbnail > ytd-thumbnail-overlay-hover-text-renderer.style-scope.ytd-thumbnail > yt-icon.style-scope.ytd-thumbnail-overlay-hover-text-renderer",
						resolution: "2560x1440",
						deadline: null,
						done_at: null,
						archived_at: null,
						created_at: "2022-10-10T11:11:29.000000Z",
						updated_at: "2023-05-03T13:32:52.000000Z",
						deleted_at: null,
						time_estimate: 5,
					},
				},
				{
					id: "657b1ecb-b3b0-486c-bbb9-b3bc1feb005f",
					type: "Bug",
					attributes: {
						state: "approved",
						project_id: "7077f39d-bb4a-4002-ad7f-ae123605e71d",
						creator: {
							id: 4,
							type: "User",
							attributes: {
								first_name: "Radu",
								last_name: "Memetea",
								email: "r@r.ro",
								trial_end_date: "2033-03-21",
							},
						},
						designation: "2",
						description: null,
						url: "https://www.youtube.com/",
						status_id: "145d7da2-4a0f-47cc-8f49-5293e3c6146b",
						order_number: 1,
						ai_id: 2,
						client_id: null,
						priority: {
							id: 4,
							type: "Priority",
							attributes: {
								designation: "Normal",
							},
						},
						operating_system: "Windows",
						browser: "Chrome 105",
						selector:
							"html > body > ytd-app > div#content.style-scope.ytd-app > ytd-page-manager#page-manager.style-scope.ytd-app > ytd-browse.style-scope.ytd-page-manager > ytd-two-column-browse-results-renderer.style-scope.ytd-browse.grid-disabled > div#primary.style-scope.ytd-two-column-browse-results-renderer > ytd-rich-grid-renderer.style-scope.ytd-two-column-browse-results-renderer > div#contents.style-scope.ytd-rich-grid-renderer > ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer > div#contents.style-scope.ytd-rich-grid-row > ytd-rich-item-renderer.style-scope.ytd-rich-grid-row > div#content.style-scope.ytd-rich-item-renderer > ytd-rich-grid-media.style-scope.ytd-rich-item-renderer > div#dismissible.style-scope.ytd-rich-grid-media > ytd-thumbnail.style-scope.ytd-rich-grid-media > a#thumbnail.yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail > div#hover-overlays.style-scope.ytd-thumbnail > ytd-thumbnail-overlay-hover-text-renderer.style-scope.ytd-thumbnail > span.style-scope.ytd-thumbnail-overlay-hover-text-renderer",
						resolution: "2560x1440",
						deadline: "2023-05-05 13:32:58",
						done_at: null,
						archived_at: null,
						created_at: "2022-10-10T11:12:10.000000Z",
						updated_at: "2023-05-03T13:32:59.000000Z",
						deleted_at: null,
					},
				},
				{
					id: "65c0c177-2f60-4745-a1ee-bfc0c34edf14",
					type: "Bug",
					attributes: {
						state: "pending",
						project_id: "7077f39d-bb4a-4002-ad7f-ae123605e71d",
						creator: {
							id: 4,
							type: "User",
							attributes: {
								first_name: "Radu",
								last_name: "Memetea",
								email: "r@r.ro",
								trial_end_date: "2033-03-21",
							},
						},
						designation: "3",
						description: null,
						url: "https://www.youtube.com/",
						status_id: "145d7da2-4a0f-47cc-8f49-5293e3c6146b",
						order_number: 2,
						ai_id: 3,
						client_id: null,
						priority: {
							id: 1,
							type: "Priority",
							attributes: {
								designation: "Normal",
							},
						},
						operating_system: "Windows",
						browser: "Chrome 105",
						selector:
							"html > body > ytd-app > div#content.style-scope.ytd-app > ytd-page-manager#page-manager.style-scope.ytd-app > ytd-browse.style-scope.ytd-page-manager > ytd-two-column-browse-results-renderer.style-scope.ytd-browse.grid-disabled > div#primary.style-scope.ytd-two-column-browse-results-renderer > ytd-rich-grid-renderer.style-scope.ytd-two-column-browse-results-renderer > div#contents.style-scope.ytd-rich-grid-renderer > ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer > div#contents.style-scope.ytd-rich-grid-row > ytd-rich-item-renderer.style-scope.ytd-rich-grid-row > div#content.style-scope.ytd-rich-item-renderer > ytd-rich-grid-media.style-scope.ytd-rich-item-renderer > div#dismissible.style-scope.ytd-rich-grid-media > ytd-thumbnail.style-scope.ytd-rich-grid-media > a#thumbnail.yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail > yt-img-shadow.style-scope.ytd-thumbnail.no-transition > img#img.style-scope.yt-img-shadow",
						resolution: "2560x1440",
						deadline: "2023-05-06 13:33:05",
						done_at: null,
						archived_at: null,
						created_at: "2022-10-10T11:12:28.000000Z",
						updated_at: "2023-05-03T13:33:06.000000Z",
						deleted_at: null,
					},
				},
				{
					id: "dc518e67-f1ee-45c7-9af3-3d2c78ceacce",
					type: "Bug",
					attributes: {
						state: "rejected",
						project_id: "7077f39d-bb4a-4002-ad7f-ae123605e71d",
						creator: {
							id: 4,
							type: "User",
							attributes: {
								first_name: "Radu",
								last_name: "Memetea",
								email: "r@r.ro",
								trial_end_date: "2033-03-21",
							},
						},
						designation: "11",
						description: null,
						url: "https://www.youtube.com/",
						status_id: "145d7da2-4a0f-47cc-8f49-5293e3c6146b",
						order_number: 3,
						ai_id: 4,
						client_id: null,
						priority: {
							id: 3,
							type: "Priority",
							attributes: {
								designation: "Important",
							},
						},
						operating_system: "Windows",
						browser: "Chrome 105",
						selector:
							"html > body > ytd-app > div#content.style-scope.ytd-app > ytd-page-manager#page-manager.style-scope.ytd-app > ytd-browse.style-scope.ytd-page-manager > ytd-two-column-browse-results-renderer.style-scope.ytd-browse.grid-disabled > div#primary.style-scope.ytd-two-column-browse-results-renderer > ytd-rich-grid-renderer.style-scope.ytd-two-column-browse-results-renderer > div#contents.style-scope.ytd-rich-grid-renderer > ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer > div#contents.style-scope.ytd-rich-grid-row > ytd-rich-item-renderer.style-scope.ytd-rich-grid-row > div#content.style-scope.ytd-rich-item-renderer > ytd-rich-grid-media.style-scope.ytd-rich-item-renderer > div#dismissible.style-scope.ytd-rich-grid-media > ytd-thumbnail.style-scope.ytd-rich-grid-media > a#thumbnail.yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail > div#hover-overlays.style-scope.ytd-thumbnail > ytd-thumbnail-overlay-hover-text-renderer.style-scope.ytd-thumbnail",
						resolution: "2560x1440",
						deadline: "2023-04-22 13:33:18",
						done_at: null,
						archived_at: null,
						created_at: "2022-10-10T11:15:37.000000Z",
						updated_at: "2023-05-03T13:33:18.000000Z",
						deleted_at: null,
					},
				},
				{
					id: "ffaa5b9c-8e5d-4340-889b-b6b8b87256e1",
					type: "Bug",
					attributes: {
						state: "pending",
						project_id: "7077f39d-bb4a-4002-ad7f-ae123605e71d",
						creator: {
							id: 4,
							type: "User",
							attributes: {
								first_name: "Radu",
								last_name: "Memetea",
								email: "r@r.ro",
								trial_end_date: "2033-03-21",
							},
						},
						designation: "12",
						description: null,
						url: "https://www.youtube.com/",
						status_id: "145d7da2-4a0f-47cc-8f49-5293e3c6146b",
						order_number: 4,
						ai_id: 5,
						client_id: null,
						priority: {
							id: 2,
							type: "Priority",
							attributes: {
								designation: "Normal",
							},
						},
						operating_system: "Windows",
						browser: "Chrome 105",
						selector:
							"html > body > ytd-app > div#content.style-scope.ytd-app > ytd-page-manager#page-manager.style-scope.ytd-app > ytd-browse.style-scope.ytd-page-manager > ytd-two-column-browse-results-renderer.style-scope.ytd-browse.grid-disabled > div#primary.style-scope.ytd-two-column-browse-results-renderer > ytd-rich-grid-renderer.style-scope.ytd-two-column-browse-results-renderer > div#contents.style-scope.ytd-rich-grid-renderer > ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer > div#contents.style-scope.ytd-rich-grid-row > ytd-rich-item-renderer.style-scope.ytd-rich-grid-row > div#content.style-scope.ytd-rich-item-renderer > ytd-rich-grid-media.style-scope.ytd-rich-item-renderer > div#dismissible.style-scope.ytd-rich-grid-media > ytd-thumbnail.style-scope.ytd-rich-grid-media > a#thumbnail.yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail > div#hover-overlays.style-scope.ytd-thumbnail > ytd-thumbnail-overlay-hover-text-renderer.style-scope.ytd-thumbnail",
						resolution: "2560x1440",
						deadline: "2023-04-21 13:33:31",
						done_at: null,
						archived_at: null,
						created_at: "2022-10-10T11:17:10.000000Z",
						updated_at: "2023-05-03T13:33:32.000000Z",
						deleted_at: null,
					},
				},
			];
		},

		async getUser(token: string) {
			// let response = await axios.get("auth/user", {
			// 	headers: {
			// 		token: token,
			// 	},
			// });

			// this.user = response.data.data;

			this.user = {
				id: 4,
				type: "User",
				attributes: {
					first_name: "Radu",
					last_name: "Memetea",
					email: "r@r.ro",
					trial_end_date: "2033-03-21",
				},
			};
		},
	},

	getters: {},
});
