import Shepherd from "shepherd.js";
import Step from "shepherd.js/src/types/step";
import { useGlobalI18n } from "~/composables/GlobalI18n";

// @ts-ignore
const { t } = useGlobalI18n();

const findElementBeforeShow = (selector: string) =>
	new Promise<void>((resolve) => {
		let count = 60;

		const int = setInterval(() => {
			if (document.querySelector(selector) != undefined || count-- === 0) {
				clearInterval(int);
				return resolve();
			}
		}, 1000);
	});

const useOverviewTour = ({
	next,
	prev,
	cancel,
	complete,
	show,
}: {
	next: () => void;
	prev: () => void;
	cancel: () => boolean;
	complete: () => void;
	show: (id: string) => void;
}) => {
	const tour = new Shepherd.Tour({
		tourName: "overview",

		stepsContainer: document.querySelector("#sh-tour") as HTMLElement,
		modalContainer: document.querySelector("#sh-tour") as HTMLElement,
		useModalOverlay: true,

		defaultStepOptions: {
			classes: "shadow-md bg-purple-dark",
			scrollTo: true,
		},

		exitOnEsc: false,
		confirmCancel: cancel,
	});

	tour.addSteps([
		{
			cancelIcon: { enabled: true },
			canClickTarget: false,

			attachTo: {
				element: ".sh-navbar-list .sh-organization-nav-overview.router-link-active ",
				on: "right",
			},
			classes: "mx-1",

			id: "sh-overview-1",
			title: t("tours.overview.step_1.title"),
			text: t("tours.overview.step_1.text"),

			buttons: [
				{
					text: t("next"),
					action: next,
				},
			],
		},

		{
			cancelIcon: { enabled: true },
			canClickTarget: false,

			attachTo: {
				element:
					".sh-navbar-list .sh-organization-nav-overview.router-link-active~.sh-organization-nav-settings ",
				on: "right",
			},
			classes: "mx-1",

			id: "sh-overview-2",
			title: t("tours.overview.step_2.title"),
			text: t("tours.overview.step_2.text"),

			buttons: [
				{
					text: t("back"),
					action: prev,
					classes: "sh-back-button",
				},
				{
					text: t("next"),
					action: next,
				},
			],
		},

		{
			cancelIcon: { enabled: true },
			canClickTarget: false,

			attachTo: { element: ".sh-organization-settings", on: "bottom" },
			classes: "my-1",
			modalOverlayOpeningPadding: 2,
			modalOverlayOpeningRadius: 8,

			id: "sh-overview-3",
			title: t("tours.overview.step_3.title"),
			text: t("tours.overview.step_3.text"),

			buttons: [
				{
					text: t("back"),
					action: prev,
					classes: "sh-back-button",
				},
				{
					text: t("next"),
					action: next,
				},
			],
		},

		{
			cancelIcon: { enabled: true },
			canClickTarget: false,

			attachTo: { element: ".sh-organization-create", on: "top" },
			classes: "my--1",
			modalOverlayOpeningPadding: 2,
			modalOverlayOpeningRadius: 20,

			id: "sh-overview-4",
			title: t("tours.overview.step_4.title"),
			text: t("tours.overview.step_4.text"),

			buttons: [
				{
					text: t("back"),
					action: prev,
					classes: "sh-back-button",
				},
				{
					text: t("next"),
					action: next,
				},
			],
		},

		{
			cancelIcon: { enabled: true },

			attachTo: { element: ".sh-user-menu", on: "right-end" },
			classes: "mx-1",
			modalOverlayOpeningPadding: 8,
			modalOverlayOpeningRadius: 28,

			id: "sh-overview-5",
			title: t("tours.overview.step_5.title"),
			text: t("tours.overview.step_5.text"),

			buttons: [
				{
					text: t("back"),
					action: prev,
					classes: "sh-back-button",
				},
			],

			advanceOn: { selector: ".sh-user-avatar", event: "click" },
		},

		{
			cancelIcon: { enabled: true },
			canClickTarget: false,

			attachTo: { element: ".sh-user-settings", on: "right-end" },
			classes: "mx-1",

			id: "sh-overview-6",
			title: t("tours.overview.step_6.title"),
			text: t("tours.overview.step_6.text"),

			buttons: [
				{
					text: t("back"),
					action: prev,
					classes: "sh-back-button",
				},
				{
					text: t("next"),
					action: next,
				},
			],
		},

		{
			cancelIcon: { enabled: true },
			canClickTarget: false,

			attachTo: { element: ".sh-user-organizations", on: "right-end" },
			classes: "mx-1",

			id: "sh-overview-7",
			title: t("tours.overview.step_7.title"),
			text: t("tours.overview.step_7.text"),

			buttons: [
				{
					text: t("back"),
					action: prev,
					classes: "sh-back-button",
				},
				{
					text: t("next"),
					action: next,
				},
			],
		},

		{
			cancelIcon: { enabled: true },

			attachTo: { element: ".sh-user-apps", on: "right-end" },
			classes: "mx-1",

			id: "sh-overview-8",
			title: t("tours.overview.step_8.title"),
			text: t("tours.overview.step_8.text"),

			buttons: [
				{
					text: t("back"),
					action: prev,
					classes: "sh-back-button",
				},
			],

			advanceOn: { selector: ".sh-user-apps", event: "click" },
		},

		{
			cancelIcon: { enabled: true },

			attachTo: { element: ".sh-extensions", on: "left" },
			classes: "mx--1",
			modalOverlayOpeningPadding: 2,
			modalOverlayOpeningRadius: 20,

			id: "sh-overview-9",
			title: t("tours.overview.step_9.title"),
			text: t("tours.overview.step_9.text"),

			buttons: [
				{
					text: t("next"),
					action: next,
				},
			],

			beforeShowPromise: () => findElementBeforeShow(".sh-extensions"),
		},

		{
			cancelIcon: { enabled: true },

			attachTo: { element: ".sh-home-logo", on: "right-start" },
			classes: "mx-1",
			modalOverlayOpeningPadding: 12,
			modalOverlayOpeningRadius: 16,

			id: "sh-overview-10",
			title: t("tours.overview.step_10.title"),
			text: t("tours.overview.step_10.text"),

			buttons: [
				{
					text: t("back"),
					classes: "sh-back-button",
				},
			],
			advanceOn: { selector: ".sh-home-logo", event: "click" },
		},

		{
			cancelIcon: { enabled: true },
			canClickTarget: false,

			attachTo: { element: ".sh-organization-switcher", on: "left-start" },
			classes: "mx-1",

			id: "sh-overview-11",
			title: t("tours.overview.step_11.title"),
			text: t("tours.overview.step_11.text"),

			buttons: [
				{
					text: t("back"),
					action: prev,
					classes: "sh-back-button",
				},
				{
					text: t("next"),
					action: next,
				},
			],

			beforeShowPromise: () => findElementBeforeShow(".sh-organization-switcher"),
		},

		{
			cancelIcon: { enabled: true },

			attachTo: { element: ".sh-notifications-button", on: "right" },
			classes: "mx-1",
			modalOverlayOpeningPadding: 8,
			modalOverlayOpeningRadius: 28,

			id: "sh-overview-12",
			title: t("tours.overview.step_12.title"),
			text: t("tours.overview.step_12.text"),

			advanceOn: { selector: ".sh-notifications-button", event: "click" },
		},

		{
			cancelIcon: { enabled: true },
			canClickTarget: false,

			attachTo: { element: ".sh-notifications-popup", on: "right" },
			classes: "mx-2",

			id: "sh-overview-13",
			title: t("tours.overview.step_13.title"),
			text: t("tours.overview.step_13.text"),

			buttons: [
				{
					text: t("back"),
					action: prev,
					classes: "sh-back-button",
				},
				{
					text: t("next"),
					action: next,
				},
			],

			beforeShowPromise: () => findElementBeforeShow(".sh-notifications-popup"),
		},

		{
			cancelIcon: { enabled: true },

			attachTo: { element: ".sh-feedback-button", on: "left" },
			classes: "mx--1",
			modalOverlayOpeningPadding: 2,
			modalOverlayOpeningRadius: { topLeft: 20, bottomLeft: 20, bottomRight: 0, topRight: 0 },

			id: "sh-overview-14",
			title: t("tours.overview.step_14.title"),
			text: t("tours.overview.step_14.text"),

			buttons: [
				{
					text: t("back"),
					action: prev,
					classes: "sh-back-button",
				},
				{
					text: "Finish",
					action: complete,
				},
			],
		},
	] as Step.StepOptions[]);

	return tour;
};

export default useOverviewTour;
