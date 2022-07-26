<template>
	<div class="bs-container" style="height: 100%">
		<div class="bs-bb" pb4>
			<span flex justify-between style="width: 100%">
				<p font-bold>{{ t("company", 2) }}</p>

				<p class="black-to-gray" style="font-size: 0.875rem">
					<b>{{ t("assigned_to") }}</b> 7 projects for 3 clients
				</p>
			</span>
		</div>

		<ul class="bs-scroll s-purple" style="height: 100%">
			<li class="bs-bb" pb4>
				<div class="header">
					<div class="company">
						<div class="dot" :style="{ background: colors[2] }" />

						<b>BugShot</b>

						<div class="role">Team</div>
					</div>

					<a class="remove">
						<img
							src="/src/assets/icons/delete.svg"
							alt="delete"
							class="black-to-red"
							h-4
						/>
						{{ t("remove_from_this_client") }}
					</a>
				</div>

				<div class="content">
					<span class="black-to-gray">
						<b>{{ t("assigned_to") }}</b>
						({{ 1 }} {{ t("project", 1) }})
					</span>

					<div my4 gap-4 flex flex-wrap>
						<div class="item">
							Google

							<img
								src="/src/assets/icons/close_2.svg"
								alt="x"
								class="black-to-white"
							/>
						</div>
					</div>
				</div>
			</li>
		</ul>

		<div>
			<hr />

			<a class="remove">
				<img
					src="/src/assets/icons/delete.svg"
					alt="delete"
					class="black-to-red"
					h-4
				/>
				{{ t("remove_from_all_clients_and_projects") }}
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import colors from "~/util/colors";

const { t } = useI18n();
</script>

<style lang="scss" scoped>
a.remove {
	font-size: 0.75rem;
	font-weight: bold;
	display: flex;
	justify-content: end;
	align-content: center;
	margin: 1rem 0;
	cursor: pointer;
	user-select: none;
	gap: 0.25rem;
}

ul {
	list-style: none;
	padding: 1rem 0.25rem;
	margin: unset;
	max-height: 100%;
	overflow: auto;
}

li {
	&:last-of-type {
		border: unset;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		> .company {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 0.5rem;
		}
	}

	.content {
		width: 100%;
		text-align: left;

		span {
			font-size: 0.875rem;
		}
	}
}

.item {
	background: #9ba5d7;
	border-radius: 0.25rem;
	padding: 0.25rem 0.5rem;
	color: white;
	white-space: nowrap;
	font-size: 0.75rem;
	width: fit-content;
	display: flex;
	align-items: center;
	gap: 0.25rem;
	cursor: pointer;

	> img {
		width: 1rem;
	}
}

.role {
	border: 1px solid #7a2ee6;
	border-radius: 0.25rem;
	padding: 0.25rem;
	color: #7a2ee6;
	font-weight: bold;
	font-size: 0.75rem;
}
</style>
