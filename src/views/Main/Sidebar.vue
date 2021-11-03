<template>
	<div class="sidebar-menu">
		<ul class="verticle-menu">
			<li class="home-logo">
				<router-link to="/main">
					<img src="../../assets/extern/m-1.svg" alt="" />
				</router-link>
			</li>

			<li class="notification">
				<a href="#">
					<img src="../../assets/extern/m-2.svg" alt="" />
				</a>
				<div class="notification-submenu">
					<div class="notification-header">
						<h3>Benachrichtigungen</h3>
					</div>
					<!-- <div class="notification-body">
							@if(count($invitations) > 0) @foreach($invitations
							as $invitation) @if((explode('#',
							$invitation->target_id))[0] == 'project') @php
							$invitation_project =
							DB::table('projects')->where('id', (explode('#',
							$invitation->target_id))[1])->first() @endphp
							@elseif((explode('#', $invitation->target_id))[0] ==
							'company') @php $invitation_company =
							DB::table('companies')->where('id', (explode('#',
							$invitation->target_id))[1])->first() @endphp @endif
							<div
								class="notification-single"
								id="{{ $invitation->id }}"
							>
								<div class="notification-info-wrapper">
									@if((explode('#',
									$invitation->target_id))[0] == 'project')
									<div class="notification-event">
										Sie wurden zu einem Projekt eingeladen
										<strong
											>{{ $invitation_project->designation }}</strong
										>
									</div>
									@elseif((explode('#',
									$invitation->target_id))[0] == 'company')
									<div class="notification-event">
										Sie wurden zu einer Firma eingeladen
										<strong
											>{{ $invitation_company->designation }}</strong
										>
									</div>
									@endif
									<div class="notification-detail">
										<strong>{{ $invitation->day }}</strong
										>{{ ", " . $invitation->created_at . " von " . $invitation->initiator }}
									</div>
								</div>
								<div class="notification-actions">
									<button
										class="btn decline_invitation"
										data-id="{{ $invitation->id }}"
									>
										<i class="fas fa-times"></i>
									</button>
									<button
										class="btn accept_invitation"
										data-id="{{ $invitation->id }}"
									>
										<i class="fas fa-check"></i>
									</button>
								</div>
							</div>
							@endforeach @else
							<p>Keine Benachrichtigungen</p>
							@endif
						</div> -->
				</div>
			</li>

			<li class="at-bottom clients">
				<router-link to="/companies">
					<img src="../../assets/svg/clients.svg" alt="" />
				</router-link>
			</li>

			<li class="at-bottom">
				<router-link to="/settings">
					<img src="../../assets/extern/m-3.svg" alt="" />
				</router-link>
			</li>

			<li class="at-bottom logout">
				<router-link to="/logout">
					<img src="../../assets/extern/logout.svg" alt="" />
				</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: "Sidebar",
};
</script>

<style lang="scss" scoped>
ul,
ol {
	margin: 0px;
	padding: 0px;
	list-style-type: none;
}

.sidebar-menu {
	background: #1a2040;
	width: 88px;
	height: 100vh;
}

.verticle-menu {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	padding: 35px 0 25px 0;

	.home-logo {
		margin-bottom: 45px;
	}
	.notification {
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

.at-bottom {
	margin-top: auto;
}

.verticle-menu li a img {
	max-width: 100%;
}

.verticle-menu li {
	display: block;
	position: relative;
}

.notification-submenu {
	position: absolute;
	left: calc(100% + 10px);
	background: #fff;
	width: 350px;
	border-radius: 12px;
	box-shadow: 0 2px 10px #0000001c;
	padding: 15px;
	top: 0;
	opacity: 0;
	visibility: hidden;
	transition: 0.3s;
}

.logout {
	img {
		transform: rotateZ(90deg);
		margin: 0 10px 0 0;
	}
}
</style>
