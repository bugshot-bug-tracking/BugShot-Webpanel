import Pusher from "pusher-js";
import Echo from "laravel-echo";
import axios from "axios";

export const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
	cluster: import.meta.env.VITE_PUSHER_CLUSTER,
});

export const echo = new Echo({
	broadcaster: "pusher",
	key: import.meta.env.VITE_PUSHER_KEY,
	cluster: import.meta.env.VITE_PUSHER_CLUSTER,
	forceTLS: true,
	authEndpoint: `${import.meta.env.VITE_API_ENDPOINT}/broadcasting/auth`,

	authorizer: (channel, options) => ({
		authorize: (socketId, callback) => {
			axios
				.post("/broadcasting/auth", {
					socket_id: socketId,
					channel_name: channel.name,
				})
				.then((response) => {
					callback(null, response.data);
				})
				.catch((error) => {
					callback(error);
				});
		},
	}),
});
