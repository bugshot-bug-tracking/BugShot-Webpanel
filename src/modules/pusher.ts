import { UserModule } from "~/types";
import Pusher from "pusher-js";

export const install: UserModule = ({ app, router }) => {
	let pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
		cluster: import.meta.env.VITE_PUSHER_CLUSTER,
	});
};
