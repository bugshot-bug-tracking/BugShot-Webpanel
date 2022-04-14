import axios from "axios";

export default {
	namespaced: true,

	state: {
		project_id: null,
		project: null,

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

		SET_PROJECT: (state, payload) => {
			state.project = payload;
		},

		SET_STATUS: (state, payload) => {
			state.statuses.set(payload.id, payload);
		},

		DELETE_STATUS: (state, payload) => {
			state.statuses.delete(payload);
		},

		SET_BUG: (state, payload) => {
			state.bugs.set(payload.id, payload);
		},

		DELETE_BUG: (state, id) => {
			state.bugs.delete(id);
		},

		SET_LINK: (state, payload) => {
			state.links.set(payload.status_id, payload);
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

		DELETE_LINK: (state, id) => {
			state.links.delete(id);
		},

		SET_STATUSES_INITDT: (state, payload) => {
			state.statusesInitDT = payload;
		},

		SET_BUGS_INITDT: (state, payload) => {
			state.bugsInitDT = payload;
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

		SET_BUG_USERS: (state, payload) => {
			state.bugs.get(payload.id).users = payload.list;
		},
	},

	actions: {
		clear: (state) => {
			state.commit("CLEAR");
		},

		setProjectId: async (state, payload) => {
			state.commit("CLEAR");
			state.commit("SET_PROJECT_ID", payload);

			await state.dispatch("loadProject");
			await state.dispatch("loadStatuses");
			await state.dispatch("loadBugs");
		},

		loadProject: async (state) => {
			try {
				let main_project = state.rootGetters.getProjectById(
					state.state.project_id
				);
				if (!main_project) return;

				let project = (
					await axios.get(
						`companies/${main_project.attributes.company.id}/projects/${state.state.project_id}`,
						{
							headers: {
								"include-project-users": true,
							},
						}
					)
				).data.data;

				state.commit("SET_PROJECT", project);
			} catch (error) {
				console.log(error);
			}
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

					//! this can be a problem for when updating statuses
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

						...(payload.changes.order_number != null
							? { order_number: payload.changes.order_number }
							: { order_number: bug.attributes.order_number }),

						// if undefined it means that no change was made; if null it means reseting the deadline;
						...(payload.changes.deadline === undefined
							? { deadline: bug.attributes.deadline }
							: payload.changes.deadline === null
							? { deadline: null }
							: {
									deadline: payload.changes.deadline.slice(
										0,
										-1
									),
							  }),
					}
				);

				//! TODO remove when live update works
				await state.dispatch("loadStatuses");
				await state.dispatch("loadBugs");
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

		fetchBugUsers: async (state, id) => {
			try {
				// fetch bug screenshots
				let users = (await axios.get(`bugs/${id}/users`)).data.data;

				// store the status in memory
				state.commit("SET_BUG_USERS", {
					id: id,
					list: users,
				});
			} catch (error) {
				console.log(error);
			}
		},

		createStatus: async (state, payload) => {
			console.log(payload);
			let r = await axios.post(
				`projects/${state.state.project_id}/statuses`,
				{
					designation: payload.designation,
					order_number: payload.order_number,
				}
			);

			// TODO update to not need to dispatch loadBugs
			await state.dispatch("loadStatuses");
			await state.dispatch("loadBugs");
		},

		syncStatus: async (state, payload) => {
			try {
				//get a refference to the status
				const status = state.getters.getStatusById(payload.id);

				let response = await axios.put(
					`projects/${state.state.project_id}/statuses/${status.id}`,
					{
						...(payload.changes.designation
							? { designation: payload.changes.designation }
							: { designation: status.attributes.designation }),

						...(payload.changes.order_number != null
							? { order_number: payload.changes.order_number }
							: { order_number: status.attributes.order_number }),
					}
				);

				//! TODO remove when live update works
				await state.dispatch("loadStatuses");
				await state.dispatch("loadBugs");
			} catch (error) {
				console.log(error);
			}
		},

		deleteStatus: async (state, payload) => {
			await axios.delete(
				`projects/${state.state.project_id}/statuses/${payload.id}`,
				{
					headers: {
						move: payload.move,
					},
				}
			);

			//! TODO remove when live update works
			await state.dispatch("loadStatuses");
			await state.dispatch("loadBugs");
			await state.commit("DELETE_STATUS", payload.id);
			await state.commit("DELETE_LINK", payload.id);
		},
	},

	getters: {
		getProject: (state) => state.project,

		getStatuses: (state) =>
			Array.from(state.statuses, (x) => x[1]).sort((a, b) =>
				a.attributes.order_number < b.attributes.order_number ? -1 : 1
			),
		getStatusById: (state) => (id) => state.statuses.get(id),

		getBugs: (state) => state.bugs,
		getBugById: (state) => (id) => state.bugs.get(id),
		getBugsByStatusId: (state) => (id) => {
			if (state.links.get(id)) {
				let list = state.links.get(id).bug_ids;

				list = list.sort((a, b) => {
					return state.bugs.get(a).attributes.order_number <
						state.bugs.get(b).attributes.order_number
						? -1
						: 1;
				});

				return list;
			} else {
				return [];
			}
		},

		getLinks: (state) => Array.from(state.links, (x) => x[1]),

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

		getFirstStatus: (state) => {
			if (state.statuses.size < 1) return null;

			return [...state.statuses].find(
				(x) => x[1].attributes.order_number === 0
			)[1];
		},

		getProjectUsers: (state) => state.project.attributes.users,
	},
};
