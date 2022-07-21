<template>
	<div class="bs-container" p5>
		<img src="/src/assets/images/bugshot-banner.svg" alt="BugShot" m6 />

		<span flex flex-col items-center>
			<p
				class="bs-bb"
				font-bold
				p2
				style="font-size: 1.125rem; width: 100%"
			>
				{{ $t("extension.the_plugin") }}
			</p>

			<p>
				{{ $t("extension.install_browser_extension") }}
			</p>

			<img src="src/assets/icons/chrome.svg" alt="Chrome Icon" w-16 m4 />

			<a class="bs-btn green" @click.prevent="chromeStore" uppercase>
				{{ $t("extension.install_plugin") }}
			</a>
		</span>

		<span mt4 v-if="false">
			<p class="bs-bb" font-bold p2 style="font-size: 1.125rem">
				{{ $t("extension.download_client_app") }}
			</p>

			<div class="stores">
				<img
					src="src/assets/images/google_play.svg"
					alt="Google Play Store"
					@click.prevent="playStore"
				/>

				<img
					src="src/assets/images/app_store.svg"
					alt="Apple Store"
					@click.prevent="appleStore"
				/>

				<img
					src="src/assets/images/windowsstore.svg"
					alt="Windows Store"
					@click.prevent="windowsStore"
				/>
			</div>
		</span>
	</div>
</template>

<script setup lang="ts">
const chromeStore = () => {
	window.open(
		"https://chrome.google.com/webstore/detail/bugshot/dioobkjdnepaibmmhlniiolocpmdbblh?hl=en&authuser=0"
	);
};
const playStore = () => {};
const appleStore = () => {};
const windowsStore = () => {};
</script>

<style lang="scss" scoped>
.stores {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;

	> img {
		width: 10rem;
	}
}
</style>
