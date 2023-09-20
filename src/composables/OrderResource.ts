import { Company } from "~/models/Company";
import { Organization } from "~/models/Organization";
import { Project } from "~/models/Project";

export default function useOrderResource(options?: {
	initialValue?: number;
	get?(): number;
	set?(value: number): void;
}) {
	const orderValue = ref(options?.initialValue ?? 11);

	const orderRef = computed({
		get() {
			if (options?.get) return options.get();

			return orderValue.value;
		},
		set(value) {
			if (options?.set) return options.set(value);

			orderValue.value = value;
		},
	});

	const orderedList = (list: (Organization | Company | Project)[]) => {
		// handle the ordering
		switch (orderRef.value) {
			// default case fallthrough to case 11
			default:
			case 11: // A-Z
				return [...list].sort((a, b) => {
					return a.attributes.designation.localeCompare(b.attributes.designation);
				});
				break;

			case 12: // Z-A
				return [...list].sort((a, b) => {
					return a.attributes.designation.localeCompare(b.attributes.designation) * -1;
				});
				break;

			case 21: //  Creation newest
				return [...list].sort((a, b) => {
					return (
						(new Date(a.attributes.created_at).getTime() -
							new Date(b.attributes.created_at).getTime()) *
						-1
					);
				});
				break;

			case 22: // Creation oldest
				return [...list].sort((a, b) => {
					return (
						new Date(a.attributes.created_at).getTime() -
						new Date(b.attributes.created_at).getTime()
					);
				});
				break;

			case 31: // Last edit ascending
				return [...list].sort((a, b) => {
					return (
						(new Date(a.attributes.updated_at).getTime() -
							new Date(b.attributes.updated_at).getTime()) *
						-1
					);
				});
				break;

			case 32: // Last edit descending
				return [...list].sort((a, b) => {
					return (
						new Date(a.attributes.updated_at).getTime() -
						new Date(b.attributes.updated_at).getTime()
					);
				});
				break;
		}
	};

	return { orderRef, orderedList };
}
