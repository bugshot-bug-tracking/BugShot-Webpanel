import { defineStore } from "pinia";

import axios from "axios";

import { Status } from "~/models/Status";
import { Bug } from "~/models/Bug";
import { useProjectStore } from "./project";
import { useHookStore } from "./hooks";
import { useBugStore } from "./bug";
import dateFix from "~/util/dateFixISO";

export const useReportsStore = defineStore("reports", {
	state: () => ({
		project: useProjectStore().project,

		statuses: undefined as Status[] | undefined,

		archived: undefined as Bug[] | undefined,

		filter: {
			creators: [] as number[],
			assignees: [] as number[],
			priority: undefined as undefined | number,
		},
	}),

	actions: {
		async init(id: string) {
			try {
				this.$reset();

				await this.fetchStatuses(id);

				useHookStore().hookKanban();
			} catch (error) {
				console.log(error);
				throw error;
			}

			return true;
		},

		async refresh() {
			try {
				await this.fetchStatuses();
			} catch (error) {
				console.log(error);
				throw error;
			}
		},

		async fetchStatuses(id?: string) {
			let response = (
				await axios.get(`projects/${id ?? this.project.id}/statuses`, {
					headers: {
						"include-statuses": true,
						"include-bugs": true,
					},
				})
			).data.data;

			this.statuses = response;
		},

		async createStatus({
			designation,
			order_number = 0,
		}: {
			designation: string;
			order_number?: number;
		}) {
			await axios.post(`projects/${this.project.id}/statuses`, {
				designation: designation,
				order_number: order_number,
			});

			await this.refresh();

			this.message.success(this.i18n.t("messages.status_created"));
		},

		async updateStatus({
			id,
			changes = {},
		}: {
			id: string;
			changes: {
				designation?: string;
				order_number?: number;
			};
		}) {
			// get a reference to the status
			const status = this.statuses?.find((x) => x.id === id);
			if (!status) throw "Status not found in memory";

			let newStatus = (
				await axios.put(`projects/${this.project.id}/statuses/${status.id}`, {
					...{ designation: changes.designation ?? status.attributes.designation },

					...{
						order_number: changes.order_number ?? status.attributes.order_number,
					},
				})
			).data.data as Status;

			const oldStatus = status;

			this.message.success(this.i18n.t("messages.status_updated"));

			if (oldStatus.attributes.order_number === newStatus.attributes.order_number)
				return Object.assign(oldStatus.attributes, newStatus.attributes);

			this.statuses?.forEach((status) => {
				if (status.id === oldStatus.id) return;

				// if the move was to the right (ex. status 1 was moved after 4), all the statuses in interval (1, 4] or [2, 4] should be -1
				if (oldStatus!.attributes.order_number < newStatus.attributes.order_number) {
					if (
						status.attributes.order_number > oldStatus!.attributes.order_number &&
						status.attributes.order_number <= newStatus.attributes.order_number
					) {
						status.attributes.order_number--;
					}

					// else if the move was to the left (ex. status 6 was moved before 1), all the statuses in interval [1, 6) or [1, 5] should be +1
				} else {
					if (
						status.attributes.order_number >= newStatus.attributes.order_number &&
						status.attributes.order_number < oldStatus!.attributes.order_number
					) {
						status.attributes.order_number++;
					}
				}
			});

			Object.assign(oldStatus.attributes, newStatus.attributes);
		},

		async deleteStatus({ id, move }: { id: string; move: string | undefined }) {
			await axios.delete(`projects/${this.project.id}/statuses/${id}`, {
				headers: {
					...(move ? { move: move } : {}),
				},
			});

			this.refresh();

			this.message.info(this.i18n.t("messages.status_deleted"));
		},

		async createBug({
			designation,
			description,
			deadline,
			priority_id,
			images,
			attachments,
			time_estimation,
			time_estimation_type,
		}: {
			designation: string;
			description: string;
			deadline?: string | number;
			priority_id: number;
			images?: { base64: string }[];
			attachments?: { designation: string; base64: string }[];
			time_estimation?: number;
			time_estimation_type?: "m" | "h" | "d" | "w";
		}) {
			let status = this.getBacklogStatus;

			if (!status) return;

			let response = (
				await axios.post(`statuses/${status.id}/bugs`, {
					designation: designation,
					description: description,
					priority_id: priority_id,
					...{
						deadline: deadline ? new Date(deadline).toISOString().slice(0, -1) : null,
					},

					time_estimation,
					time_estimation_type,
				})
			).data.data;

			if (images)
				// using the bug id send screenshots one-by-one
				for (const image of images) {
					await axios.post(`bugs/${response.id}/screenshots`, image);
				}

			if (attachments)
				// using the bug id send screenshots one-by-one
				for (const attachment of attachments) {
					await axios.post(`bugs/${response.id}/attachments`, attachment);
				}

			this.refresh();

			this.message.success(this.i18n.t("messages.bug_created"));

			return response;
		},

		async moveBug({
			bug_id,
			changes,
		}: {
			bug_id: string;
			changes: { status_id: string; order_number: number };
		}) {
			let bug = this.getBugById(bug_id);
			if (!bug) throw "Bug not found!";

			const newBug = (
				await axios.put(`statuses/${bug.attributes.status_id}/bugs/${bug.id}`, {
					ai_id: bug.attributes.ai_id,

					designation: bug.attributes.designation,

					description: bug.attributes.description,

					url: bug.attributes.url,
					operating_system: bug.attributes.operating_system,
					browser: bug.attributes.browser,
					selector: bug.attributes.selector,
					resolution: bug.attributes.resolution,

					...{ status_id: changes.status_id ?? bug.attributes.status_id },

					priority_id: bug.attributes.priority.id,

					...{
						order_number: changes.order_number ?? bug.attributes.order_number,
					},

					deadline: dateFix(bug.attributes.deadline)?.slice(0, -1),
				})
			).data.data;

			// vvv--- update status orders in memory so we don't need to make and wait for an update request for all bugs ---vvv

			const oldBug = bug;

			const oldStatus = this.getStatusById(bug.attributes.status_id);
			const newStatus = this.getStatusById(changes.status_id);

			let sameStatus = oldStatus?.id === newStatus?.id;

			// if they are the same status but different order, update just the bugs in that status
			if (sameStatus) {
				oldStatus?.attributes.bugs?.forEach((bug) => {
					// if the move was to the right (ex. bug 1 was moved after 4), all the bugs in interval (1, 4] or [2, 4] should be -1
					if (oldBug!.attributes.order_number < newBug.attributes.order_number) {
						if (
							bug.attributes.order_number > oldBug!.attributes.order_number &&
							bug.attributes.order_number <= newBug.attributes.order_number
						) {
							bug.attributes.order_number--;
						}

						// else if the move was to the left (ex. bug 6 was moved before 1), all the bugs in interval [1, 6) or [1, 5] should be +1
					} else {
						if (
							bug.attributes.order_number >= newBug.attributes.order_number &&
							bug.attributes.order_number < oldBug!.attributes.order_number
						) {
							bug.attributes.order_number++;
						}
					}
				});
			} else {
				// remove old bug
				let oldIndex = oldStatus?.attributes.bugs?.findIndex((x) => x.id === newBug.id);

				if (oldIndex != undefined && oldIndex != -1)
					oldStatus?.attributes.bugs?.splice(oldIndex, 1);

				// decrease all the bugs with order_number greater than the one removed
				oldStatus?.attributes.bugs?.forEach((bug) => {
					if (bug.attributes.order_number > oldBug!.attributes.order_number)
						bug.attributes.order_number--;
				});

				let newBugFoundInNewStatus = false;

				// increase all the bugs with order_number the same or greater than the one who will be pushed
				newStatus?.attributes.bugs?.forEach((bug) => {
					// in case external factors added the newBug to the newStatus set the flag and continue iterating
					if (bug.id === newBug.id) return (newBugFoundInNewStatus = true);

					if (bug.attributes.order_number >= newBug.attributes.order_number)
						bug.attributes.order_number++;
				});

				// if the flag was not raised add the bug to the new status
				if (!newBugFoundInNewStatus) newStatus?.attributes.bugs?.push(newBug);
			}

			// update the bug in this store
			Object.assign(oldBug.attributes, newBug.attributes);

			// update the bug in the status list also
			let activeBug = useBugStore().bug;
			if (activeBug && activeBug.id === newBug.id) useBugStore().refreshBug();

			this.message.info(this.i18n.t("messages.bug_moved"));
		},

		async fetchArchivedBugs() {
			if (!this.project?.id) throw new Error("No active project!");

			let response = (await axios.get(`projects/${this.project.id}/archived-bugs`)).data.data;

			this.archived = response;
		},

		async moveBugs(list: string[], target: string) {
			if (!this.project?.id) throw new Error("No active project!");

			let response = (
				await axios.post(`/projects/${this.project.id}/bugs/move-to-new-project`, {
					target_project_id: target,
					bugs: list.map((s) => ({ id: s })),
				})
			).data.data;

			this.statuses?.forEach((s) => {
				s.attributes.bugs = s.attributes.bugs?.filter((b) => !list.includes(b.id));
			});

			this.message.success(this.i18n.t("messages.bug_moved", 2));

			return response;
		},
	},

	getters: {
		getStatuses: (state) =>
			state.statuses?.sort((a, b) => a.attributes.order_number - b.attributes.order_number),

		getStatusById: (state) => (id: string) => state.statuses?.find((x) => x.id === id),

		getBugById: (state) => (id: string) => {
			if (!state.statuses) return null;

			for (const status of state.statuses)
				for (const bug of status.attributes.bugs ?? []) if (bug.id === id) return bug;

			return null;
		},

		getBugsByStatusId: (state) => (id: string) => {
			let status = state.statuses?.find((x) => x.id === id);

			if (status)
				return status.attributes.bugs?.sort((a, b) => {
					if (a.attributes.order_number < b.attributes.order_number) return -1;
					else if (a.attributes.order_number > b.attributes.order_number) return 1;
					return 0;
				});
			else return [];
		},

		getArchivedBugs: (state) => state.archived,
		getArchivedBugById: (state) => (id: string) => state.archived?.find((b) => b.id === id),

		getBacklogStatus: (state) =>
			state.statuses?.find((s) => s.attributes.permanent === "backlog"),
		getDoneStatus: (state) => state.statuses?.find((s) => s.attributes.permanent === "done"),

		getFilteredStatusBugs: (state) => (status: Status) =>
			status.attributes.bugs?.filter((bug) => {
				let value = true;

				if (state.filter.priority)
					value = value && bug.attributes.priority.id === state.filter.priority;

				if (state.filter.creators.length > 0)
					value =
						value &&
						state.filter.creators.some((id) => id === bug.attributes.creator.id);

				if (state.filter.assignees.length > 0)
					value =
						value &&
						state.filter.assignees.some((id) =>
							bug.attributes.assigned_users?.some((user_id) => user_id === id)
						);

				return value;
			}),
	},
});
