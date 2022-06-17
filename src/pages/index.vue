<template>
	<div class="home-layout">
		<section name="sidebar">
			<CompanyNavbar />
		</section>

		<section name="page">
			<RouterView />
		</section>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.home-layout {
	display: grid;
	grid-template-columns: auto 1.75fr;
	grid-template-rows: 1fr;
	gap: 0px 0px;
	grid-auto-flow: row;
	grid-template-areas: "sidebar page";
	width: 100%;
	height: 100vh;
	max-height: 100vh;
	overflow: hidden;
}

section[name="sidebar"] {
	grid-area: sidebar;

	h3 {
		padding: 20px;
		text-align: left;
	}

	.companies {
		padding: 10px 0px 10px 10px;
		font-size: 16px;
		overflow: auto;
		height: 100%;
		width: 100%;

		ul {
			list-style-type: none;
			padding: 0;
			text-align: left;
			display: flex;
			flex-direction: column;

			> li {
				padding: 4px 4px 8px 4px;
			}
		}

		a {
			text-decoration: none;
			color: black;
		}

		.company {
			display: flex;
			justify-content: space-between;
			font-weight: 600;
			margin-bottom: 4px;
			padding: 6px;

			&:hover {
				background-color: hsl(263, 79%, 94%);
				width: 100%;
				border-radius: 6px;
			}

			> img {
				transform: rotateZ(-90deg);
				cursor: pointer;
				transition: 0.3s;
				user-select: none;
			}

			&.open {
				> img {
					transform: rotateZ(90deg);
				}
			}

			> a.router-link-exact-active {
				color: #7a2de6;
			}
		}

		.company.open + .proj-list {
			display: flex;
		}
		.company > a.router-link-exact-active + .proj-list {
			display: flex;
		}

		.proj-list {
			display: none;
			overflow: hidden;
		}

		.project {
			display: inline-flex;
			align-items: center;
			padding: 10px 10px 10px 10px;

			&:hover {
				background-color: hsl(263, 79%, 94%);
				width: 100%;
				border-radius: 6px;
			}
			> .dot {
				border-radius: 100%;
				background-color: red;
				padding: 7px;
				margin: 0 10px 0 0;
			}
			&.router-link-exact-active {
				border-radius: 6px;
				background: hsl(158, 79%, 87%);
			}
		}
	}
}

section[name="page"] {
	grid-area: page;
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
