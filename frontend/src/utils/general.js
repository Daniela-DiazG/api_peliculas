export const uid = () => Math.random().toString(36).slice(2, 9).toUpperCase();
export const today = () => new Date().toISOString().split('T')[0];



