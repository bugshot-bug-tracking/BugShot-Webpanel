import { UserModule } from "~/types";
import { pusher, echo } from "~/composables/pusher";

export const install: UserModule = ({ app, router }) => {
	app.provide("pusher", pusher);
	app.provide("echo", echo);
};
