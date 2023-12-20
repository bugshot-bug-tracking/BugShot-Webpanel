<template>
	<div class="bs-container sh-extensions" p5>
		<img src="/src/assets/images/bugshot-banner.svg" alt="BugShot" m6 />

		<span flex flex-col items-center>
			<p class="bs-bb" font-bold p2 style="font-size: 1.125rem; width: 100%">
				{{ $t("extension.the_plugin") }}
			</p>

			<n-text text-center text-balance>
				{{ $t("extension.install_browser_extension") }}
			</n-text>

			<div flex mt-8 justify-between px-12>
				<img src="/src/assets/icons/chrome-logo.svg" alt="Chrome Icon" w-14 m-4 />

				<n-button
					text
					strong
					type="primary"
					underline
					tag="a"
					:href="links.chrome"
					target="_blank"
				>
					{{ $t("extension.install_ext_chrome") }}
				</n-button>
			</div>

			<div flex justify-between px-12>
				<img src="/src/assets/icons/firefox-logo.svg" alt="Firefox Icon" w-14 m-4 />

				<n-button
					text
					strong
					type="primary"
					underline
					tag="a"
					:href="links.firefox"
					target="_blank"
				>
					{{ $t("extension.install_ext_firefox") }}
				</n-button>
			</div>
			<div flex justify-between px-12>
				<img src="/src/assets/icons/edge-logo.svg" alt="Edge Icon" w-14 m-4 />

				<n-button
					text
					strong
					type="primary"
					underline
					tag="a"
					:href="links.edge"
					target="_blank"
				>
					{{ $t("extension.install_ext_edge") }}
				</n-button>
			</div>

			<div flex justify-between px-12>
				<Icon-Safari alt="Safari Icon" size="3.5rem" m-4 />

				<n-button
					text
					strong
					type="primary"
					underline
					tag="a"
					:href="links.safari"
					target="_blank"
				>
					{{ $t("extension.install_ext_safari") }}
				</n-button>
			</div>
		</span>

		<span flex flex-col items-center>
			<p class="bs-bb" font-bold p2 style="font-size: 1.125rem; width: 100%">
				{{ $t("extension.download_client_app") }}
			</p>

			<div flex justify-between px-12>
				<img src="/src/assets/icons/microsoft-logo.svg" alt="Windows Icon" w-14 m-4 />

				<n-button
					text
					strong
					type="primary"
					underline
					tag="a"
					:href="links.windows"
					target="_blank"
				>
					{{ $t("extension.install_app_windows") }}
				</n-button>
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
