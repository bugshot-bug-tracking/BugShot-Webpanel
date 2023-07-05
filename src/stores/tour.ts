import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import Shepherd from "shepherd.js";
import { RouteLocationRaw } from "vue-router";
import { Tours, useTours } from "~/tours/tours";

export const useTourStore = defineStore("tour", {
	state: () => ({
		tour: undefined as undefined | Shepherd.Tour,

		tour_type: useStorage<Tours | "">("sh-tour-type", ""),
		step: useStorage<string>("sh-tour-step", ""),
		tour_state: useStorage<"canceled" | "completed" | "">("sh-tour-state", ""),
	}),

	actions: {
		/**
		 * Start a tour that was created.
		 * @param tour The tour key from enum Tours
		 */
		StartTour(tour: Tours) {
			// if a tour is in progress exit
			if (this.tour != undefined) return;

			if (!Object.values(Tours).includes(tour))
				throw Error("'tour' is not a valid value; check the Tours enum.");

			if (this.tour_type !== tour) {
				this.tour_type = tour;
				this.step = "";
				this.tour_state = "";
			}

			let tours = useTours();
			this.tour = tours[tour]({
				next: this.NextStep,
				prev: this.PreviousStep,
				cancel: this.CancelTour,
				complete: this.CompleteTour,
				show: this.ShowStep,
				pushRoute: this.PushRoute,
			});

			this.tour.start();

			// if (this.step !== "") this.tour.show(this.step);
		},

		// The return type should always be true, it is used as a confirmation signal that the tour can be canceled
		CancelTour(): boolean {
			// if no tour in progress exit
			if (this.tour == undefined) return true;

			this.tour_state = "canceled";

			this.tour = undefined;

			return true;
		},
		NextStep() {
			// if no tour in progress exit
			if (this.tour == undefined) return;

			this.tour.next();
			this.step = this.tour.getCurrentStep()?.id ?? "";
		},
		PreviousStep() {
			// if no tour in progress exit
			if (this.tour == undefined) return;

			this.tour.back();
			this.step = this.tour.getCurrentStep()?.id ?? "";
		},
		CompleteTour() {
			// if no tour in progress exit
			if (this.tour == undefined) return;

			this.tour.complete();
			this.tour_state = "completed";
		},
		ShowStep(id: string) {
			// if no tour in progress exit
			if (this.tour == undefined) return;

			this.tour.show(id);
			this.step = this.tour.getCurrentStep()?.id ?? "";
		},
		async PushRoute(to: RouteLocationRaw) {
			// if no tour in progress exit
			if (this.tour == undefined) return;

			await this.router.push(to);
		},
	},

	getters: {},
});
