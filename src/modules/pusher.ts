import { UserModule } from "~/types";
import { pusher } from "~/composables/pusher";

export const install: UserModule = ({ app, router }) => {
	app.provide("pusher", pusher);
};
