// src/composables/useLocale.js
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export function useLocale() {
    const { locale, availableLocales } = useI18n();

    const changeLocale = (lang) => {
        locale.value = lang;
    };

    const currentLocale = computed(() => locale.value);

    return {
        locale,
        availableLocales,
        changeLocale,
        currentLocale
    };
}