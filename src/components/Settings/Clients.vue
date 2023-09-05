<template>
	<div class="bs-container sh-extensions" p5>
		<img src="/src/assets/images/bugshot-banner.svg" alt="BugShot" m6 />

		<span flex flex-col items-center>
			<p class="bs-bb" font-bold p2 style="font-size: 1.125rem; width: 100%">
				{{ $t("extension.the_plugin") }}
			</p>

			<p>
				{{ $t("extension.install_browser_extension") }}
			</p>

			<div flex mt-8 justify-evenly>
				<img src="/src/assets/icons/chrome.svg" alt="Chrome Icon" w-16 m4 />
				<a class="bs-btn green" :href="links.chrome" target="_blank" uppercase>
					{{ $t("extension.install_plugin") }}
				</a>
			</div>

			<div flex justify-evenly>
				<img src="/src/assets/icons/firefox.svg" alt="Firefox Icon" w-16 m4 />

				<a class="bs-btn green" :href="links.firefox" target="_blank" uppercase>
					{{ $t("extension.install_plugin") }}
				</a>
			</div>
			<div flex justify-evenly>
				<img src="/src/assets/icons/edge.svg" alt="Edge Icon" w-16 m4 />

				<a class="bs-btn green" :href="links.edge" target="_blank" uppercase>
					{{ $t("extension.install_plugin") }}
				</a>
			</div>
			<div flex justify-evenly>
				<Icon-Safari alt="Safari Icon" size="3.75rem" m-4 color="var(--bs-purple)" />

				<a class="bs-btn green" :href="links.safari" target="_blank" uppercase>
					{{ $t("extension.install_plugin") }}
				</a>
			</div>
		</span>

		<span flex flex-col items-center>
			<p class="bs-bb" font-bold p2 style="font-size: 1.125rem; width: 100%">
				{{ $t("extension.download_client_app") }}
			</p>

			<div flex justify-evenly>
				<img src="/src/assets/icons/windows.svg" alt="Windows Icon" w-16 m4 />

				<a class="bs-btn green" :href="links.windows" uppercase>
					{{ $t("download") }}
				</a>
			</div>
		</span>

		<span mt4 v-if="false">
			<p class="bs-bb" font-bold p2 style="font-size: 1.125rem">
				{{ $t("extension.download_client_app") }}
			</p>

			<div class="stores">
				<img
					src="/src/assets/images/google_play.svg"
					alt="Google Play Store"
					@click.prevent="playStore"
				/>

				<img
					src="/src/assets/images/app_store.svg"
					alt="Apple Store"
					@click.prevent="appleStore"
				/>

				<img
					src="/src/assets/images/windowsstore.svg"
					alt="Windows Store"
					@click.prevent="windowsStore"
				/>
			</div>
		</span>
	</div>
</template>

<script setup lang="ts">
const links = {
	chrome: import.meta.env.VITE_EXTENSION_CHROME,
	firefox: import.meta.env.VITE_EXTENSION_FIREFOX,
	edge: import.meta.env.VITE_EXTENSION_EDGE,
	safari: import.meta.env.VITE_EXTENSION_SAFARI,

	windows: import.meta.env.VITE_APP_WINDOWS,
};

const chromeStore = () => {
	window.open(links.chrome);
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

span > div {
	width: 100%;
}
</style>
