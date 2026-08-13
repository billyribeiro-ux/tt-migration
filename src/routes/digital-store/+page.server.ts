import { productCatalog } from '$lib/server/catalog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	observedAt: productCatalog.observedAt,
	products: productCatalog.products
});
