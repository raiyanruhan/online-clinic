export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export const CONTACT = {
    phone: import.meta.env.VITE_CONTACT_PHONE ?? '+8801XXXXXXXXX',
    phoneDisplay: import.meta.env.VITE_CONTACT_PHONE_DISPLAY ?? '+880 1XXX-XXXXXX',
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER ?? '8801XXXXXXXXX',
    email: import.meta.env.VITE_CONTACT_EMAIL ?? 'contact@example.com',
    address: import.meta.env.VITE_CONTACT_ADDRESS ?? 'Your Clinic Address, City, Country',
    facebookUrl: import.meta.env.VITE_FACEBOOK_URL ?? 'https://facebook.com/yourpage',
};
