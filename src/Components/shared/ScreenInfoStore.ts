import { writable } from 'svelte/store';

export const screenInfo = writable({ isMobile: false, isSmallScreen: false, innerWidth: 0, innerHeight: 0 });
