import vSelect from "vue-select";
import Datepicker from "@vuepic/vue-datepicker";

export const install = (app, router) => {
	app.component("v-select", vSelect);
	app.component("Datepicker", Datepicker);
};
