// src/i18n.js

import { createI18n } from 'vue-i18n';

// Importez explicitement les fichiers de traduction
import en from './langues/en.json';
import fr from './langues/fr.json';

const messages = {
    en,
    fr
};

const i18n = createI18n({
    locale: 'fr', // Langue par défaut
    fallbackLocale: 'fr',
    messages,
});

export default i18n;
