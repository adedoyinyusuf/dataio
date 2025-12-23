
export interface IconMeta {
    icon: string;
    color: string;
}

export const CATEGORY_ICONS: Record<string, IconMeta> = {
    // Demographics & Population
    'demographics': { icon: 'fa-layer-group', color: 'green' },
    'population': { icon: 'fa-users', color: 'blue' },

    // Maternal & Reproductive Health
    'maternal': { icon: 'fa-person-pregnant', color: 'purple' },
    'maternal_care': { icon: 'fa-person-pregnant', color: 'purple' },
    'anc': { icon: 'fa-user-nurse', color: 'purple' },

    // Fertility & Family Planning
    'fertility': { icon: 'fa-seedling', color: 'pink' },
    'family_planning': { icon: 'fa-people-line', color: 'indigo' },
    'family_planning_extended': { icon: 'fa-people-line', color: 'indigo' },

    // Child Health
    'child': { icon: 'fa-children', color: 'blue' },
    'child_health': { icon: 'fa-children', color: 'blue' },
    'child_mortality': { icon: 'fa-baby', color: 'blue' },
    'child_nutrition': { icon: 'fa-apple-whole', color: 'green' },

    // Vaccination & Immunization
    'vaccination': { icon: 'fa-syringe', color: 'green' },
    'vaccination_coverage': { icon: 'fa-syringe', color: 'green' },
    'immunization': { icon: 'fa-shield-virus', color: 'green' },

    // Nutrition
    'nutrition': { icon: 'fa-bowl-food', color: 'orange' },
    'feeding': { icon: 'fa-bottle-baby', color: 'orange' },

    // Diseases
    'malaria': { icon: 'fa-mosquito', color: 'amber' },
    'malaria_prevention': { icon: 'fa-mosquito', color: 'amber' },
    'hiv': { icon: 'fa-ribbon', color: 'red' },
    'hiv_aids': { icon: 'fa-ribbon', color: 'red' },
    'infectious': { icon: 'fa-virus', color: 'yellow' },
    'infectious_diseases': { icon: 'fa-virus', color: 'yellow' },

    // Social Issues
    'violence': { icon: 'fa-shield-halved', color: 'red' },
    'domestic_violence': { icon: 'fa-hand-fist', color: 'red' },

    // Core Development Indicators
    'disability': { icon: 'fa-wheelchair', color: 'purple' },
    'womens_empowerment': { icon: 'fa-person-dress', color: 'pink' },
    'water_sanitation': { icon: 'fa-faucet-drip', color: 'cyan' },
    'wash': { icon: 'fa-hands-bubbles', color: 'cyan' },
    'household': { icon: 'fa-house-chimney', color: 'slate' },
    'household_wealth': { icon: 'fa-coins', color: 'slate' },
    'education': { icon: 'fa-graduation-cap', color: 'indigo' },
    'food_security': { icon: 'fa-bowl-rice', color: 'orange' },
    'harmful_practices': { icon: 'fa-ban', color: 'red' },
    'sexual_health': { icon: 'fa-heart-pulse', color: 'rose' },

    // Other
    'key_indicators': { icon: 'fa-chart-line', color: 'blue' },
    'overview': { icon: 'fa-eye', color: 'slate' },
    'trends': { icon: 'fa-arrow-trend-up', color: 'emerald' }
};

export function getCategoryIcon(categoryKey: string): IconMeta {
    const normalizedKey = categoryKey.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '');

    if (CATEGORY_ICONS[normalizedKey]) {
        return CATEGORY_ICONS[normalizedKey];
    }

    for (const [key, value] of Object.entries(CATEGORY_ICONS)) {
        if (normalizedKey.includes(key) || key.includes(normalizedKey)) {
            return value;
        }
    }

    return { icon: 'fa-chart-bar', color: 'gray' };
}
