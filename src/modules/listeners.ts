import { UserModule } from "~/types";
import { echo } from "~/composables/listeners";

export const install: UserModule = ({ app, router }) => {
	app.provide("echo", echo);
};
