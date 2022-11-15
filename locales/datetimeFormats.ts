import { I18nOptions } from "vue-i18n";

const datetimeformat: I18nOptions["datetimeFormats"] = {
	en: {
		short: {
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: false,
		},
		long: {
			year: "numeric",
			month: "short",
			day: "numeric",
			weekday: "short",
			hour: "numeric",
			minute: "numeric",
		},
	},
	de: {
		short: {
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: false,
		},
		long: {
			year: "numeric",
			month: "short",
			day: "numeric",
			weekday: "short",
			hour: "numeric",
			minute: "numeric",
		},
	},
};

export default datetimeformat;
