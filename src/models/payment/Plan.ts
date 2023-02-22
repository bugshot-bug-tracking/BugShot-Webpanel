export interface Product {
	id: string;
	type: string;
	attributes: Attributes;
}

export interface Attributes {
	active: boolean;
	attributes: any[];
	created: number;
	default_price?: any;
	description: string;
	images: any[];
	livemode: boolean;
	metadata: ProductMetadata;
	name: string;
	package_dimensions?: any;
	shippable?: any;
	statement_descriptor?: any;
	tax_code?: any;
	type: string;
	unit_label?: any;
	updated: number;
	url?: any;
	prices: Price[];
}

export interface Price {
	id: string;
	type: string;
	attributes: Attributes2;
}

export interface Attributes2 {
	product: string;
	active: boolean;
	billing_scheme: string;
	created: number;
	currency?: any;
	custom_unit_amount?: any;
	livemode: boolean;
	metadata: PriceMetadata;
	lookup_key?: any;
	recurring: Recurring;
	tax_behavior: string;
	tiers_mode?: any;
	tiers?: {
		flat_amount: null | number;
		flat_amount_decimal: null | string;
		unit_amount: number;
		unit_amount_decimal: string;
		up_to: null | number;
	}[];
	transform_quantity?: any;
	type: string;
	unit_amount: number;
	updated?: any;
	unit_amount_decimal: string;
}

export interface Recurring {
	aggregate_usage?: any;
	interval: string;
	interval_count: number;
	trial_period_days?: any;
	usage_type: string;
}

export interface ProductMetadata {
	hidden?: string;
	feature_list?: string;
	image?: string;
}

export interface PriceMetadata {
	label?: string;
}
