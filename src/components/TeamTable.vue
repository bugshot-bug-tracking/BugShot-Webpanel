<template>
	<Container>
		<div class="team-table">
			<div class="container">
				<div class="header">
					<div class="members">Members</div>
					<div class="count">X of Y</div>
				</div>

				<div class="items">
					<div class="person">
						<div class="info">
							<div class="avatar">[PH]</div>
							<div class="wraper">
								<div class="name">[PH] [PH]</div>
								<div class="email">[PH]@[PH].[PH]</div>
							</div>
						</div>

						<div class="actions">
							<button>Remove[PH]</button>
						</div>
					</div>

					<div class="person">
						<div class="info">
							<div class="avatar">[PH]</div>
							<div class="wraper">
								<div class="name">[PH][PH]</div>
								<div class="email">[PH]@[PH].[PH]</div>
							</div>
						</div>
						<div class="actions">
							<button>Remove[PH]</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Container>
</template>

<script>
import Container from "./Container.vue";
export default { components: { Container } };
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

	> .items {
		.person {
			display: flex;
			align-content: center;
			align-items: center;
			justify-content: space-between;
			padding: 10px 0;
			border-bottom: 1px solid #ede4fc;

			.info {
				display: flex;
				align-items: center;

				.avatar {
					padding-right: 15px;
				}

				.wraper {
					display: flex;
					flex-direction: column;
					text-align: left;
				}
			}
		}
	}
}
</style>
