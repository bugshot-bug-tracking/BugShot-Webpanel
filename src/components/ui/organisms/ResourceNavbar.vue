<template>
	<TSidebar>
		<template #header>
			<header></header>
		</template>

		<template #main> </template>

		<template #footer> </template>
	</TSidebar>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	text-align: left;
	padding: 1rem;

	a.router-link-exact-active {
		color: #9ba5d7 !important;
	}
}

ul {
	list-style-type: none;
	padding: 0.5rem;
	text-align: left;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	li {
		.header {
			width: 100%;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			padding: 0.5rem;
			font-weight: bold;
			cursor: pointer;
			border-radius: 0.5rem;
			line-height: 1.5;
			gap: 1rem;

			&:hover {
				background-color: hsl(263, 79%, 94%);
			}

			.arrow {
				transform: rotateZ(-90deg);
				transition: transform 0.2s;
				user-select: none;
				width: 1.5rem;
				height: 1.5rem;
				line-height: 1.5;
			}

			&.open {
				background: hsl(158, 79%, 87%);

				> div img {
					transform: rotateZ(0deg);
				}

				+ .collapsable {
					visibility: visible;
					max-height: 10000px;
					transition: 0.5s ease-in;
				}
			}
		}

		&:last-of-type {
			hr {
				display: none;
			}
		}
	}
}

.collapsable {
	display: flex;
	visibility: collapse;
	max-height: 0;
	flex-direction: column;
	margin: 0.5rem 0 0.5rem 0.5rem;
	transition: 0.2s ease-out;
	overflow: hidden;

	ul {
		padding: 0;
	}
}

.companies {
	padding: 0.5rem;
	padding-right: 0;
	height: 100%;
	width: 100%;
}

.route {
	display: flex;
	align-items: flex-start;
	padding: 0.5rem;
	width: 100%;
	border-radius: 0.5rem;
	gap: 0.5rem;

	&:hover {
		background-color: hsl(263, 79%, 94%);
	}

	&.router-link-exact-active {
		background: hsl(158, 79%, 87%);

		&.settings {
			background: transparent;

			img {
				color: #7a2ee6;
				filter: brightness(0) saturate(1) invert(18%) sepia(72%) saturate(5384%)
					hue-rotate(263deg) brightness(94%) contrast(92%);
			}
		}
	}
}

.dot {
	border-radius: 100%;
	background-color: red;
	padding: 0.5rem;
	transform: translateY(0.1rem);
}
</style>
