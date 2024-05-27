// src/i18n.js

import { createI18n } from 'vue-i18n';

// Importez explicitement les fichiers de traduction
import en from './langues/en.json';
import fr from './langues/fr.json';

const messages = {
    En: en,
    Fr: fr
};

const i18n = createI18n({
    locale: 'Fr', // Langue par défaut
    fallbackLocale: 'Fr',
    messages,
});

export default i18n;
