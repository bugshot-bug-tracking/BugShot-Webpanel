<template>
	<router-view />
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Open+Sans&display=swap");

body {
	background-color: hsl(240, 40%, 98%);
	overflow: hidden;
}

#app {
	font-family: "Open Sans", sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	display: flex;
}

#nav {
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
