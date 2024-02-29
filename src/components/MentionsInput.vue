<template>
	<div ref="tribute_container" :class="{ 'disabled-input': disabled }">
		<vue-tribute :options="options" style="width: 100%">
			<div
				id="comment-input"
				contenteditable="true"
				ref="message"
				data-max-length="250"
				@input="handleInput"
				@paste.prevent="paste"
			/>
		</vue-tribute>

		<div
			:hidden="messageLength <= 250"
			style="font-size: 0.875rem; color: red; align-self: start; margin-top: -0.5rem"
		>
			{{ $t("limits.characters_exceeded") }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { VueTribute } from "vue-tribute";
import { User } from "~/models/User";
import colors from "~/util/colors";
import { maxlengthContentEditable } from "~/util/maxlength-contenteditable.js";

const props = defineProps({
	modelValue: {
		type: String,
		required: false,
		default: "",
	},

	users: {
		type: Array as PropType<number[]>,
		required: false,
		default: [],
		description: "Tagged users id",
	},

	list: {
		type: Array as PropType<User[]>,
	},

	disabled: Boolean,
});

watch(
	props,
	() => {
		if (message.value && props.modelValue === "") {
			message.value.innerText = "";
			taggedUsers.value = [];
		}
	},
	{ deep: true }
);

const emit = defineEmits(["update:modelValue", "update:users"]);

const message = ref(undefined as HTMLDivElement | undefined);
const messageLength = ref(0);

const tribute_container = ref(undefined as HTMLDivElement | undefined);

const paste = (event: any) => {
	var text = event.clipboardData.getData("text/plain");
	document.execCommand("insertText", false, text);
};

// tributejs options
const options = reactive({
	trigger: "@",

	// the list from where the suggestions ar taken (key and value are mandatory for search)
	values: props.list?.map((x) => ({
		key: `${x.attributes.first_name} ${x.attributes.last_name}`,
		...x,
		value: x.id,
	})),

	// inserted template in the input div
	selectTemplate: (item: any) => {
		return `<span class="comment-tag" contenteditable="false" value=${item.original.value}><p hidden><${item.original.value}$</p>@${item.original.key}<p hidden>></p></span>`;
	},

	// template used for the suggest menu items
	menuItemTemplate: (item: any) => {
		return `
			<div class="avatar"
				style="background-color: ${
					colors[
						(item.original.attributes.first_name.charCodeAt(0) +
							item.original.attributes.last_name.charCodeAt(0)) %
							7
					]
				};"
			>
				${item.original.attributes.first_name[0] + item.original.attributes.last_name[0]}
			</div>
			<div class="name">
				${item.original.attributes.first_name + " " + item.original.attributes.last_name}
			</div>
		`;
	},

	// class added on the selected item (includes hover action)
	selectClass: "tag-select",

	// overall menu class
	containerClass: "tag-container",
});

const taggedUsers = ref([] as number[]);

const handleInput = (event: any) => {
	const textContentArray = [] as string[];
	createText({ value: textContentArray, node: event.target });
	textContentArray.shift();
	const textContent = textContentArray.join("");

	// textContent takes into consideration the hidden characters so that the limit includes the overhead for saving
	messageLength.value = textContent.length;
	emit("update:modelValue", textContent);

	if (!message.value) return;

	const tagNodes = message.value.querySelectorAll("span[value].comment-tag");
	taggedUsers.value = [];
	tagNodes.forEach((node) => {
		if (node.attributes.value.value && !taggedUsers.value.includes(node.attributes.value.value))
			taggedUsers.value.push(node.attributes.value.value);
	});

	emit("update:users", taggedUsers.value);
};

/**
 * Function to create text from a given node and its children
 *
 * @param {Object} param - Object parameter.
 * @param {string[]} param.value - Array that accumulates the text content.
 * @param {Node} param.node - The current node from which to extract the text content.
 */
const createText = ({ value, node }: { value: string[]; node: Node }) => {
	// If either the value array or the node do not exist, stop the function
	if (!node || !value) return;

	// If the current node is a line break and has a sibling node, add a new line to the value array
	if (node.nodeName === "BR" && node.nextSibling) value.push("\n");

	// If the current node is a DIV,
	if (node.nodeName === "DIV") {
		// Add a new line to the value array
		value.push("\n");

		// If the current node has child nodes,
		if (node.childNodes)
			// For each child node,
			node.childNodes.forEach((childNode) => {
				// If the child node exists, recursively call createText with the current value array and the child node
				if (childNode) createText({ value, node: childNode });
			});
	}
	// If the current node is not a DIV and has non-empty text content,
	else if (node.textContent && node.textContent != "") {
		// Add the text content to the value array
		value.push(node.textContent);
	}
};

onMounted(() => {
	maxlengthContentEditable();
});
</script>

<style scoped lang="scss">
.disabled-input {
	opacity: 0.5;
	position: relative;

	&::before {
		content: "";
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
}

#comment-input {
	width: 100%;
	border: 1px solid var(--bs-purple-light);
	border-radius: 0.75rem;
	padding: 0.25rem 0.5rem;
	font-size: 0.875rem;
	transition: ease-out 0.1s;
	resize: none;
	margin-bottom: 0.5rem;
	line-height: 1.5;
	text-align: left;
	height: 4.5rem;
	max-height: 4.5rem;
	overflow: auto;

	appearance: textarea;

	&::-webkit-scrollbar {
		display: none;
	}

	&:focus-visible {
		outline: unset;
		border: 1px solid var(--bs-purple);
		transition: ease-in 0.1s;
	}
}

.comment-tag {
	background: #9ba5d7;
	border-radius: 0.25rem;
	padding: 2px;
	color: white;
	white-space: nowrap;
	font-size: 0.75rem;
}
</style>

<style lang="scss">
.tag-container {
	z-index: 10000;

	ul {
		list-style: none;
		margin: unset;
		padding: unset;
		box-shadow: 0px 3px 6px #00000029;
		border: 1px solid #eee5fc;
		background-color: #fff;

		li {
			padding: 0.5rem 1.25rem 0.5rem 0.5rem;
			display: flex;
			align-items: center;
			gap: 0.5rem;
			transition: 0.25s;
			max-width: 300px;
		}
	}

	.avatar {
		color: hsl(0, 0%, 100%);
		background-color: var(--bs-purple);
		font-size: 0.75rem;
		padding: 0.5rem;
		border-radius: 2rem;
		height: 2rem;
		width: 2rem;

		text-align: center;
		text-transform: uppercase;

		display: flex;
		align-items: center;
		justify-content: center;
	}
}

.tag-select {
	background-color: var(--bs-green-light);
	padding: 0.5rem 0.5rem 0.5rem 1.25rem !important;
}

.tribute-container {
	z-index: 100000;
}
</style>
