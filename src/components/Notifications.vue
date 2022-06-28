<template>
	<div class="notifications" ref="root">
		<a
			class="bell-button"
			:class="{ active: active }"
			@click="active = !active"
		>
			<img
				src="/src/assets/icons/notification.svg"
				alt="bell"
				class="black-to-white"
			/>

			<div class="badge" v-if="invitations.length > 0">
				{{ invitations.length }}
			</div>
		</a>

		<section class="popup" :class="{ active: active }">
			<header>
				<span>{{ $t("notification", 2) }}</span>
			</header>

			<ul class="main bs-scroll s-purple" v-if="invitations.length > 0">
				<li v-for="invite of invitations" :key="invite.id">
					<Notification :record="invite" />
				</li>
			</ul>

			<div class="nothing" v-else>
				{{ $t("no_new_notifications") }}
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { useNotificationStore } from "~/stores/notifications";

const store = useNotificationStore();

const invitations = computed(() => store.getInvitations);

onMounted(() => store.fetchInvitations());

const active = ref(false);

const root = ref(null);

const autoClose = (event: MouseEvent) => {
	// event.path for chromium but composedPath is the standard method (ex. firefox)
	let path: EventTarget[] = event.composedPath && event.composedPath();

	// if clicking outside of this root close the popup
	if (path.find((element) => element == root.value) == null) {
		active.value = false;
	}
};

addEventListener("click", autoClose);
onUnmounted(() => {
	document.removeEventListener("click", autoClose);
});
</script>

<style lang="scss" scoped>
.notifications {
	position: relative;
}

.bell-button {
	position: relative;
	z-index: 1;
	padding: 0.5rem;
	cursor: pointer;

	img {
		width: 1.5rem;
		height: 1.5rem;
	}

	.badge {
		position: absolute;
		background-color: red;
		width: 1rem;
		height: 1rem;
		border-radius: 100%;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		top: -0.1rem;
		right: -0.1rem;
	}

	&::before {
		background: #7a2ee6;
		content: "";
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: -1;
		top: 0;
		left: 0;
		border-radius: 100%;
		opacity: 0;
		transition: 0.3s;
	}

	&:hover::before {
		opacity: 1;
	}

	&.active::before {
		opacity: 1;
	}
}

.popup {
	position: absolute;
	background: white;
	width: 30rem;
	left: 3rem;
	top: -1rem;
	padding: 1rem;
	border-radius: 0.75rem;
	box-shadow: 0 2px 10px hsla(0, 0%, 0%, 0.11);
	transition: 0.3s;
	user-select: auto;
	z-index: 100;
	opacity: 0;
	visibility: hidden;

	&.active {
		opacity: 1;
		visibility: visible;
	}

	header {
		display: flex;
		justify-content: space-between;
		border-bottom: 2px solid #eee5fc;
		padding: 1rem;

		> span {
			font-weight: bold;
			font-size: 1.125rem;
		}
	}

	.main {
		margin: 0;
		padding: 0;
		max-height: 40rem;

		li {
			list-style: none;
			padding: 0.5rem 0 0.5rem 1rem;
			border-bottom: 1px solid #ede4fc;

			&:last-of-type {
				border: none;
			}
		}
	}

	.nothing {
		color: #9ba5d7;
		text-align: left;
		padding: 1rem;
	}
}
</style>
