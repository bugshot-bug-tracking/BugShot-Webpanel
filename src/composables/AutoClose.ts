export default function useAutoClose() {
	// the element that is used to verify what is inside and what is outside (close on clicking any outside elements)
	const root = ref(null);

	const active = ref(false);

	const toggle = () => {
		active.value = !active.value;
	};

	const open = () => {
		active.value = true;
	};

	const close = () => {
		active.value = false;
	};

	const autoClose = (event: MouseEvent) => {
		if (active.value === false) return;

		// event.path for chromium but composedPath is the standard method (ex. firefox)
		let path: EventTarget[] = event.composedPath && event.composedPath();

		// if clicking outside of this root close the popup
		if (!path.some((element) => element == root.value)) {
			close();
		}
	};

	addEventListener("click", autoClose);

	onUnmounted(() => {
		document.removeEventListener("click", autoClose);
	});

	return { root, active, toggle, open, close };
}
