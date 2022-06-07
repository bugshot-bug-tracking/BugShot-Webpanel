<template>
	<nav class="nav-bar">
		<ul class="verticle-menu">
			<div class="top-buttons">
				<router-link :to="{ name: 'home' }" class="home-logo">
					<img src="/src/assets/extern/m-1.svg" alt="" />
				</router-link>

				<li class="notification">
					<a>
						<img src="/src/assets/extern/m-2.svg" alt="" />
					</a>

					<div class="badge" v-if="invitations.length > 0">
						{{ invitations.length }}
					</div>

					<div class="notification-submenu">
						<div class="notification-header">
							<span>{{ $t("notification", 2) }}</span>

							<div>
								<a hidden>{{ $t("clear_all") }}</a>
							</div>
						</div>

						<div class="notification-body">
							<div
								class="list bs-scroll s-purple"
								v-if="invitations.length > 0"
							>
								<Notification
									v-for="invite of invitations"
									:key="invite.id"
									:id="invite.id"
								/>
							</div>

							<div v-else>{{ $t("no_new_notifications") }}</div>
						</div>
					</div>
				</li>
			</div>

			<div>
				<div class="bottom-buttons">
					<router-link :to="{ name: 'settings' }">
						<img src="/src/assets/extern/m-3.svg" alt="" />
					</router-link>
				</div>

				<I18nSwitcher class="mt-4" />
			</div>
		</ul>
	</nav>
</template>

<script setup>
import { useNotificationStore } from "/src/stores/notifications";

const notifications = useNotificationStore();

const invitations = computed(() => {
	return notifications.getInvitations;
});

onMounted(() => {
	notifications.fetchInvitations();
});
</script>

<style lang="scss" scoped>
.nav-bar {
	background: #1a2040;
	width: 88px;
	min-width: 88px;
	height: 100vh;
	user-select: none;
}

.verticle-menu {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	height: 100%;
	padding: 16px;

	.top-buttons {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 32px;

		.home-logo {
			margin-top: 16px;
		}
	}

	.bottom-buttons {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 32px;
	}

	.notification {
		position: relative;

		.badge {
			width: 16px;
			height: 16px;
			position: absolute;
			background-color: red;
			z-index: 1;
			border-radius: 100%;
			top: -10px;
			right: -2px;
			font-size: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		li {
			display: block;

			a {
				display: block;
			}
		}

		a {
			position: relative;
			z-index: 1;
			padding: 8px;
		}

		> a::before {
			background: #7a2ee6;
			width: 38px;
			height: 38px;
			content: "";
			position: absolute;
			border-radius: 50%;
			z-index: -1;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			transition: 0.3s;
			opacity: 0;
			visibility: hidden;
		}

		&:hover a::before {
			opacity: 1;
			visibility: visible;
		}

		&:hover .notification-submenu {
			opacity: 1;
			visibility: visible;
		}

		.notification-submenu {
			position: absolute;
			left: 0;
			background: #ffffff;
			width: 400px;
			border-radius: 12px;
			box-shadow: 0 2px 10px hsla(0, 0%, 0%, 0.11);
			padding: 15px;
			top: -16px;
			opacity: 0;
			visibility: hidden;
			transition: 0.4s;
			user-select: auto;
			z-index: 100;
			margin: 16px 0 0 48px;

			.notification-header {
				display: flex;
				justify-content: space-between;
				border-bottom: 2px solid #eee5fc;
				margin-bottom: 10px;

				> span {
					font-weight: bold;
					font-size: 18px;
				}
			}

			.notification-body {
				.list {
					display: flex;
					flex-direction: column-reverse;
					gap: 10px;
					max-height: 360px;
					overflow: auto;

					> * {
						border-bottom: 1px solid #eee5fc;
					}

					> :first-child {
						border: none;
					}
				}
			}
		}
	}
}

.verticle-menu li {
	display: block;
	position: relative;
}

.logout {
	position: relative;
	cursor: pointer;
	z-index: 1;

	&::before {
		background: red;
		width: 38px;
		height: 38px;
		content: "";
		position: absolute;
		border-radius: 50%;
		z-index: -1;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		transition: 0.3s;
		opacity: 0;
		visibility: hidden;
	}

	&:hover::before {
		opacity: 1;
		visibility: visible;
	}

	> img {
		width: 24px;
		height: 24px;
		transform: rotateZ(90deg);
	}
}
</style>
