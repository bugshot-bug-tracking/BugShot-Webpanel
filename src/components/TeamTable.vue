<template>
	<Container>
		<div class="team-table">
			<div class="container" v-if="company?.users">
				<div class="header bold">
					<div class="members">Members</div>
					<div class="count">{{ company.users.length }} out of 8</div>
				</div>

				<div class="items">
					<div
						class="person"
						v-for="user of company.users"
						:key="user.id"
					>
						<div class="info">
							<div
								class="avatar"
								:style="{
									'background-color':
										colors[
											(user.attributes.first_name.charCodeAt(
												0
											) +
												user.attributes.last_name.charCodeAt(
													0
												)) %
												7
										],
								}"
							>
								{{
									user.attributes.first_name[0] +
									user.attributes.last_name[0]
								}}
							</div>
							<div class="wraper">
								<div class="name">
									{{
										user.attributes.first_name +
										" " +
										user.attributes.last_name
									}}
								</div>
								<div class="email">
									{{ user.attributes.email }}
								</div>
							</div>
						</div>

						<div class="actions disabled">
							<a @click.prevent="removeUser(user)">
								<img
									src="../assets/icons/trash.svg"
									alt="Trash Can"
								/>
								<div class="">Remove</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Container>
</template>

<script>
import { computed } from "@vue/reactivity";
import store from "../store";
import Container from "./Container.vue";
import { watch } from "@vue/runtime-core";
export default {
	components: { Container },
	props: {
		company_id: {
			required: true,
			type: String,
		},
	},
	setup(props) {
		// request team data to be fetched
		store.dispatch("fetchCompanyUsers", props.company_id);

		const company = computed(() => {
			return store.getters.getCompanyById(props.company_id);
		});

		const colors = [
			"#F23838", // red
			"#F66808", // orange
			"#FFB157", // yellow
			"#7A2EE6", // purple <- default [3]
			"#15BE80", // green
			"#1849CF", // blue
			"#89A3EB", // gray
		];

		watch(
			props,
			() => {
				store.dispatch("fetchCompanyUsers", props.company_id);
			},
			{ deep: true }
		);

		const removeUser = (user) => {
			// console.log(user);
		};

		return {
			company,
			colors,
			removeUser,
		};
	},
};
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	width: 100%;
	flex-direction: column;

	> .header {
		display: flex;
		width: 100%;
		align-content: center;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;
		border-bottom: 1px solid #ede4fc;

		> * {
			min-width: 100px;
		}
	}

	.count {
		color: hsl(32, 100%, 50%);
	}

	> .items {
		display: flex;
		flex-direction: column;
		gap: 10px;

		.person {
			display: flex;
			align-content: center;
			align-items: center;
			justify-content: space-between;
			padding: 10px;
			border-bottom: 1px solid #ede4fc;

			.info {
				display: flex;
				align-items: center;
				gap: 8px;

				.avatar {
					color: hsl(0, 0%, 100%);
					background-color: hsl(265, 80%, 50%);
					font-size: 12px;
					padding: 8px;
					border-radius: 25px;
					height: 35px;
					width: 35px;

					text-align: center;
					text-transform: uppercase;
				}

				.wraper {
					display: flex;
					flex-direction: column;
					text-align: left;

					.name {
						font-weight: bold;
					}
				}
			}
		}
	}
	.actions {
		> a {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 6px;
			cursor: pointer;
			color: black;
		}
		img {
			height: 1rem;
		}

		&:hover {
			filter: invert(19%) sepia(48%) saturate(5366%) hue-rotate(351deg)
				brightness(99%) contrast(135%);
		}
	}
}
.bold {
	font-weight: bold;
}
</style>
