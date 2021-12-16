<template>
	<nav class="nav-bar">
		<ul class="verticle-menu">
			<div class="btn-sets">
				<li class="home-logo">
					<router-link :to="{ name: 'Home' }">
						<img src="../assets/extern/m-1.svg" alt="" />
					</router-link>
				</li>

				<li class="notification">
					<a>
						<img src="../assets/extern/m-2.svg" alt="" />
					</a>

					<div class="badge" v-if="invitations.size > 0">
						{{ invitations.size }}
					</div>

					<div class="notification-submenu">
						<div class="notification-header">
							<span>Notifications</span>
							<div><a hidden> Clear all</a></div>
						</div>

						<div class="notification-body">
							<div class="list" v-if="invitations.size > 0">
								<Notification
									v-for="[, invite] of invitations"
									:key="invite.id"
									:id="invite.id"
								/>
							</div>

							<div v-else>No new notifications</div>
						</div>
					</div>
				</li>
			</div>

			<div class="btn-sets">
				<li>
					<router-link :to="{ name: 'UserSettings' }">
						<img src="../assets/extern/m-3.svg" alt="" />
					</router-link>
				</li>

				<li class="btn logout">
					<img src="../assets/extern/logout.svg" @click="logout" />
				</li>
			</div>
		</ul>
	</nav>
</template>

<script>
import router from "../router";
import store from "../store";
import { computed } from "@vue/reactivity";
import Notification from "../components/Notification.vue";

export default {
	name: "Navbar",
	setup() {
		const logout = () => {
			store.dispatch("logout").then(() => {
				router.push({ name: "Login" });
			});
		};

		const invitations = computed(() => {
			return store.getters.getInvitations;
		});

		return {
			logout,
			invitations,
		};
	},
	components: { Notification },
};
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
	padding: 32px 16px;

	.btn-sets {
		> * {
			margin: 40px 0;
		}

		> *:first-child {
			margin: 0 0 40px 0;
		}
		> *:last-child {
			margin: 40px 0 0 0;
		}
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

		.notification-title-wrap {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 10px;

			a {
				&::before,
				&::after {
					content: none;
				}

				font-size: 15px;
				color: #1a2040;
				display: inline-block;
			}

			p {
				font-size: 15px;
				color: #1a2040;
			}
		}

		.notification-submenu {
			position: absolute;
			left: calc(100% + 10px);
			background: #fff;
			width: 400px;
			border-radius: 12px;
			box-shadow: 0 2px 10px #0000001c;
			padding: 15px;
			top: 0;
			opacity: 0;
			visibility: hidden;
			transition: 0.3s;
			user-select: auto;
			z-index: 100;

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

					overflow-y: auto;
					scrollbar-gutter: stable;

					scrollbar-color: #cbb0f6 #f1f1f1;
					scrollbar-width: thin;

					/* width */
					&::-webkit-scrollbar {
						width: 8px;
					}

					/* Track */
					&::-webkit-scrollbar-track {
						background: #f1f1f1;
					}

					/* Handle */
					&::-webkit-scrollbar-thumb {
						background: #cbb0f6;
						border-radius: 8px;
					}

					/* Handle on hover */
					&::-webkit-scrollbar-thumb:hover {
						background: #555;
					}
				}
			}
		}

		.notification-rw {
			border-top: 1px solid #a3acda;
			padding: 12px 0;
			position: relative;
			padding-right: 45px;
		}

		.notification-crud-btn {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);

			span.check-ok i {
				color: #15be80;
			}
		}

		.notification-rw-content p {
			font-size: 12px;
			text-align: left;
			margin-bottom: 5px;

			a {
				font-size: 12px;
				text-align: left;
				display: inline-block;
				color: #1a2040;
			}
		}

		.notification-date {
			display: block;
			text-align: left;
			font-size: 10px;
			color: #a3acda;
		}

		.notification-crud-btn span {
			i {
				color: #f23838;
				font-size: 18px;
			}

			display: inline-block;
			margin-left: 10px;
			cursor: pointer;
		}
	}
}

.verticle-menu li {
	display: block;
	position: relative;
}

.logout > img {
	transform: rotateZ(90deg);
}
</style>
