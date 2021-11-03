<template>
	<Layout>
		<form method="POST" action="" id="login-form" class="login-form">
			<h1 class="title">Register</h1>

			<div class="input-inside">
				<input
					id="first_name"
					type="first_name"
					class="@error('email') is-invalid @enderror input-design"
					name="first_name"
					placeholder="First Name"
					required
					autocomplete="given-name"
				/>

				<label for="first_name"></label>

				<img
					src="../../assets/icons/at@.svg"
					class="input-float-icon"
				/>
			</div>

			<div class="input-inside">
				<input
					id="last_name"
					type="last_name"
					class="@error('email') is-invalid @enderror input-design"
					name="last_name"
					placeholder="Last Name"
					required
					autocomplete="family-name"
				/>

				<label for="last_name"></label>

				<img
					src="../../assets/icons/at@.svg"
					class="input-float-icon"
				/>
			</div>

			<div class="input-inside email">
				<input
					id="email"
					type="email"
					class="@error('email') is-invalid @enderror input-design"
					name="email"
					placeholder="E-mail address"
					required
					autocomplete="email"
				/>

				<label for="email"></label>

				<img
					src="../../assets/icons/at@.svg"
					class="input-float-icon"
				/>
			</div>

			<div class="input-inside password">
				<input
					id="password"
					type="password"
					class="@error('password') is-invalid @enderror input-design"
					name="password"
					placeholder="Password"
					required
					autocomplete="new-password"
				/>

				<label for="password"></label>

				<img
					src="../../assets/icons/show_password.svg"
					class="input-float-icon"
					onclick="togglePasswordVisibility()"
				/>
			</div>

			<div class="input-inside">
				<input
					id="confirm_password"
					type="password"
					class="@error('password') is-invalid @enderror input-design"
					name="confirm_password"
					placeholder="Confirm password"
					required
					autocomplete="new-password"
				/>

				<label for="confirm_password"></label>

				<img
					src="../../assets/icons/show_password.svg"
					class="input-float-icon"
					onclick="togglePasswordVisibility()"
				/>
			</div>

			<div class="three-between-wrap">
				<button type="submit" class="round-btn" form="login-form">
					Sing up
				</button>
			</div>
		</form>

		<div class="register-form">
			<div class="twin-between">
				<p>
					Not a member yet? <br />
					Feel free to join our service today.
				</p>
				<router-link to="/register">Register</router-link>
			</div>
		</div>
	</Layout>
</template>

<script setup>
import Layout from "./Layout.vue";
</script>

<style lang="scss" scoped>
.title {
	color: #7a2ee6;
	font-size: 33px;
	font-weight: bold;
	margin-bottom: 30px;
}

.input-inside {
	position: relative;
	margin-bottom: 28px;
	display: flex;
	align-items: center;

	input {
		text-decoration: none;
		outline: none;
		background-color: hsl(0, 0%, 100%);
	}

	.input-design {
		text-align: center;
		width: 100%;
		position: relative;
		height: 40px;
		border: 0;
		font-size: 17px;
		color: #1a2040;
		transition: 0.3s;
		background: transparent;
		padding: 0 40px 0 15px;

		&:focus {
			border-radius: 30px;
			background-color: hsl(0, 0%, 100%);
		}

		&:focus + label {
			opacity: 0;
			visibility: hidden;
		}

		&:focus + label::after {
			width: 23px;
			height: 2px;
			background: #bc97f2;
			content: "";
			position: absolute;
			bottom: 14px;
			left: 0;
			transform: rotate(90deg);
			transform-origin: 16px 1px;
			animation-name: borderAnimation;
			animation-timing-function: 0.3s;
			animation-duration: 0.3s;
		}
	}

	.input-float-icon {
		position: absolute;
		right: 15px;
		width: 20px;
	}

	label {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #1a2040;
		font-size: 17px;
		transition: 0.3s;
		margin: 0;
		cursor: pointer;
		padding-right: 14px;

		&::after {
			width: 100%;
			height: 2px;
			background: #bc97f2;
			content: "";
			position: absolute;
			bottom: 0;
			left: 0;
			transition: 0.3s;
		}
	}
}

@keyframes borderAnimation {
	0% {
		width: 100%;
	}

	25% {
		width: 40%;
	}

	50% {
		width: 30%;
	}

	75% {
		width: 10%;
	}

	100% {
		width: 23px;
	}
}

.three-between-wrap {
	display: flex;
	align-items: center;
	justify-content: space-between;

	p {
		font-size: 14px;
		color: #1f0237;
	}
}

.recover {
	color: #18d992;
	font-size: 14px;
	font-weight: 500;
	text-transform: uppercase;

	&:hover {
		color: #18d992;
	}
}

.round-btn {
	background: #18d992;
	color: #fff;
	font-size: 14px;
	font-weight: 500;
	/* text-transform: uppercase; */
	border: 2px solid #18d992;
	border-radius: 30px;
	padding: 8px 23px;
	transition: 0.3s;

	&:hover {
		background: #15be80;
		border-color: #15be80;
		color: #fff;
	}
}

.twin-between {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-top: 2px solid #bc97f2;
	padding: 15px 0;

	p {
		font-size: 14px;
		color: #1f0237;
		line-height: 22px;
	}
}

.round-btn.style-2 {
	background: transparent;
	color: #18d992;

	&:hover {
		background: #c2f8e4;
		border-color: #18d992;
	}
}
</style>
