import Pusher from "pusher-js";
import Echo from "laravel-echo";
import axios from "axios";
import { Channel, ChannelAuthorizationCallback } from "pusher-js";

export const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
	cluster: import.meta.env.VITE_PUSHER_CLUSTER,
});

export const echo = new Echo({
	broadcaster: "pusher",
	key: import.meta.env.VITE_PUSHER_KEY,
	cluster: import.meta.env.VITE_PUSHER_CLUSTER,
	forceTLS: true,
	authEndpoint: `${import.meta.env.VITE_API_ENDPOINT}/broadcasting/auth`,

	authorizer: (channel: Channel) => ({
		authorize: (socketId: string, callback: ChannelAuthorizationCallback) => {
			axios.defaults.headers.common["X-Socket-ID"] = socketId;

			axios
				.post("/broadcasting/auth", {
					socket_id: socketId,
					channel_name: channel.name,
				})
				.then((response) => {
					callback(null, response.data);
				})
				.catch((error) => {
					callback(error, null);
				});
		},
	}),
});
