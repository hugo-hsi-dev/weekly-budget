import { PASSWORD } from '$env/static/private';
import type { PageServerLoad } from './$types';

export function load ({url}) {
    const search = url.searchParams.get('password');
    if (!search || search !== PASSWORD) {
        return {array: null}
    }
    return {array: ['1', '2', '3']}
}
