<template>
	<div class="user-menu" ref="root">
		<Avatar
			:first_name="user.attributes.first_name"
			:last_name="user.attributes.last_name"
			@click="menu.toggle"
		/>

		<section class="popup" v-if="menu.visible">
			<header>
				<Avatar
					class="avatar"
					:first_name="user.attributes.first_name"
					:last_name="user.attributes.last_name"
				/>

				<div class="user">
					<span class="name">{{ user.attributes.first_name }}</span>
					<span class="email">{{ user.attributes.email }}</span>
				</div>
			</header>

			<ul @click.capture="menu.toggle">
				<hr />
				<RouterLink :to="{ name: 'settings' }">
					{{ $t("account_settings") }}
				</RouterLink>

				<hr v-if="false" />
				<RouterLink to="/webhook" v-if="false">
					My Webhooks
				</RouterLink>

				<hr />
				<RouterLink to="/settings"> {{ $t("the_apps") }} </RouterLink>
				<hr />

				<a :style="{ color: '#5916b9' }" @click="logout">
					{{ $t("log_out") }}
				</a>
			</ul>
		</section>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const store = useAuthStore();
const router = useRouter();

const user = computed(() => store.getUser);

const root = ref(null);

const menu = reactive({
	visible: false,
	toggle: () => {
		menu.visible = !menu.visible;
	},
});

const logout = () => {
	store.logout();
	router.push({ name: "Login" });
};

const autoClose = (event: MouseEvent) => {
	// event.path for chromium but composedPath is the standard method (ex. firefox)
	let path: EventTarget[] = event.composedPath && event.composedPath();

	// if clicking outside of this root close the popup
	if (path.find((element) => element == root.value) == null) {
		menu.visible = false;
	}
};

addEventListener("click", autoClose);
onUnmounted(() => {
	document.removeEventListener("click", autoClose);
});
</script>

<style lang="scss" scoped>
.user-menu {
	position: relative;
}

.popup {
	background: white;
	position: absolute;
	bottom: 0;
	left: 4.5rem;
	z-index: 20;
	min-width: 16rem;
	box-shadow: 0px 4px 8px #00000021;
	border: 1px solid #eee5fc;
	border-radius: 0.5rem;
}

header {
	display: grid;
	grid-template-columns: 0.5fr 1.5fr;
	gap: 0.75rem;
	grid-template-areas: "avatar user";
	text-align: left;
	margin: 1rem;

	.avatar {
		grid-area: avatar;
	}
	.user {
		grid-area: user;
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;

		.name {
			font-weight: bold;
		}
		.email {
			color: #9ba5d7;
			white-space: nowrap;
		}
	}
}

ul {
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	text-align: left;

	a {
		text-decoration: none;
		color: #1a2040;
		padding: 0.5rem 1.5rem;
		font-weight: bold;
		margin: 0.5rem 0;
		transition: 0.3s;
		cursor: pointer;

		&:last-of-type {
			border: none;
		}

		&:hover {
			background: #f8f8fc;
		}

		img {
			width: 24px;
			height: 24px;
		}
	}

	hr {
		margin: 0 1rem;
	}
}
</style>
