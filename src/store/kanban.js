import axios from "axios";

export default {
	namespaced: true,

	state: {
		project_id: null,

		statuses: new Map(),
		bugs: new Map(),

		// status id is the key for the entry; variable used for linking statuses and bugs
		links: new Map(),

		// last update timestamp
		statusesInitDT: 0,
		bugsInitDT: 0,
	},

	mutations: {
		CLEAR: (state) => {
			state.project_id = null;
			state.statuses = new Map();
			state.bugs = new Map();
			state.links = new Map();
			state.statusesInitDT = 0;
			state.bugsInitDT = 0;
		},

		SET_PROJECT_ID: (state, payload) => {
			state.project_id = payload;
		},

		SET_STATUS: (state, payload) => {
			state.statuses.set(payload.id, payload);
		},

		SET_BUG: (state, payload) => {
			state.bugs.set(payload.id, payload);
		},

		SET_LINK: (state, payload) => {
			state.links.set(payload.status_id, payload);
		},

		SET_STATUSES_INITDT: (state, payload) => {
			state.statusesInitDT = payload;
		},

		SET_BUGS_INITDT: (state, payload) => {
			state.bugsInitDT = payload;
		},

		ADD_LINK: (state, payload) => {
			if (
				state.links
					.get(payload.status_id)
					.bug_ids.includes(payload.bug_id)
			)
				return;

			state.links.get(payload.status_id).bug_ids.push(payload.bug_id);
		},

		REMOVE_LINK: (state, payload) => {
			let link = state.links.get(payload.status_id);
			let index = link.bug_ids.indexOf(payload.bug_id);
			link.bug_ids.splice(index, 1);
		},

		SET_BUG_SCREENSHOTS: (state, payload) => {
			state.bugs.get(payload.id).screenshots = payload.list;
		},

		SET_BUG_ATTACHMENTS: (state, payload) => {
			state.bugs.get(payload.id).attachments = payload.list;
		},

		SET_BUG_COMMENTS: (state, payload) => {
			state.bugs.get(payload.id).comments = payload.list;
		},

		DELETE_BUG: (state, id) => {
			state.bugs.delete(id);
		},
	},

	actions: {
		clear: (state) => {
			state.commit("CLEAR");
		},

		setProjectId: async (state, payload) => {
			state.commit("CLEAR");
			state.commit("SET_PROJECT_ID", payload);

			await state.dispatch("loadStatuses");
			await state.dispatch("loadBugs");
		},

		loadStatuses: async (state, payload) => {
			try {
				// get the most recent timestamp or update or 0 for initial
				const dt = payload?.force ? 0 : state.getters.getStatusesDT;
				const params = { dt };

				// if its an update request get the last local update timestamp
				if (dt && state.state.statusesInitDT)
					params.idt = state.state.initDT;

				// fetch the project statuses
				let statuses = (
					await axios.get(
						`projects/${state.state.project_id}/statuses`,
						{ params }
					)
				).data.data;

				// TODO update this with timestamp from response
				if (!dt) state.commit("SET_STATUSES_INITDT", Date.now());

				for (const status of statuses) {
					state.commit("SET_STATUS", status);

					state.commit("SET_LINK", {
						status_id: status.id,
						bug_ids: [],
					});
				}
			} catch (error) {
				console.log(error);
			}
		},

		loadBugs: async (state, payload) => {
			try {
				// get the most recent timestamp or update or 0 for initial
				const dt = payload?.force ? 0 : state.getters.getBugsDT;
				const params = { dt };

				// if its an update request get the last local update timestamp
				if (dt && state.state.bugsInitDT)
					params.idt = state.state.bugsInitDT;

				let bugs = (
					await axios.get(`projects/${state.state.project_id}/bugs`, {
						params,
					})
				).data.data;

				// TODO update this with timestamp from response
				if (!dt) state.commit("SET_BUGS_INITDT", Date.now());

				for (const bug of bugs) {
					state.commit("SET_BUG", bug);

					state.commit("ADD_LINK", {
						status_id: bug.attributes.status_id,
						bug_id: bug.id,
					});
				}
			} catch (error) {
				console.log(error);
			}
		},

		syncBug: async (state, payload) => {
			try {
				//get a refference to the bug
				const bug = state.getters.getBugById(payload.id);

				let response = await axios.put(
					`statuses/${bug.attributes.status_id}/bugs/${bug.id}`,
					{
						ai_id: bug.attributes.ai_id,
						designation: bug.attributes.designation,
						description: bug.attributes.description,
						url: bug.attributes.url,
						operating_system: bug.attributes.operating_system,
						browser: bug.attributes.browser,
						selector: bug.attributes.selector,
						resolution: bug.attributes.resolution,

						...(payload.changes.status_id
							? { status_id: payload.changes.status_id }
							: { status_id: bug.attributes.status_id }),

						...(payload.changes.priority_id
							? { priority_id: payload.changes.priority_id }
							: { priority_id: bug.attributes.priority.id }),

						...(payload.changes.order_number
							? { order_number: payload.changes.order_number }
							: { order_number: bug.attributes.order_number }),

						...(payload.changes.deadline
							? {
									deadline: new Date(payload.changes.deadline)
										.toISOString()
										.slice(0, -1),
							  }
							: {}),
					}
				);

				//! TODO remove when live update works
				state.commit("SET_BUG", response.data.data);
			} catch (error) {
				console.log(error);
			}
		},

		fetchScreenshots: async (state, id) => {
			try {
				// fetch bug screenshots
				let screenshots = (await axios.get(`bugs/${id}/screenshots`))
					.data.data;

				for (const screenshot of screenshots) {
					// fetch each status bugs

					screenshot.attributes.base64 = atob(
						screenshot.attributes.base64
					);
				}

				// store the status in memory
				state.commit("SET_BUG_SCREENSHOTS", {
					id: id,
					list: screenshots,
				});
			} catch (error) {
				console.log(error);
			}
		},

		fetchAttachments: async (state, id) => {
			try {
				// fetch bug screenshots
				let attachments = (await axios.get(`bugs/${id}/attachments`))
					.data.data;

				// store the status in memory
				state.commit("SET_BUG_ATTACHMENTS", {
					id: id,
					list: attachments,
				});
			} catch (error) {
				console.log(error);
			}
		},

		fetchComments: async (state, id) => {
			try {
				// fetch bug screenshots
				let comments = (await axios.get(`bugs/${id}/comments`)).data
					.data;

				// store the status in memory
				state.commit("SET_BUG_COMMENTS", {
					id: id,
					list: comments,
				});
			} catch (error) {
				console.log(error);
			}
		},
	},

	getters: {
		getStatuses: (state) => Array.from(state.statuses, (x) => x[1]),
		getStatusById: (state) => (id) => state.statuses.get(id),

		getBugs: (state) => state.bugs,
		getBugById: (state) => (id) => state.bugs.get(id),
		getBugsByStatusId: (state) => (id) => state.links.get(id).bug_ids,

		getLinks: (state) => state.links,

		getStatusesDT: (state) => {
			let max = 0;
			state.statuses.forEach((status) => {
				max = Math.max(
					max,
					new Date(status.attributes.updated_at).valueOf()
				);
			});

			return max;
		},

		getBugsDT: (state) => {
			let max = 0;
			state.bugs.forEach((bug) => {
				max = Math.max(
					max,
					new Date(bug.attributes.updated_at).valueOf()
				);
			});

			return max;
		},

		getFirstStatus: (state) =>
			[...state.statuses].find(
				(x) => x[1].attributes.order_number === 0
			)[1],
	},
};
