const fs = require('fs');
const path = require('path');

const trDict = require('./lib/i18n/dictionaries/tr.json');

function getNestedValue(obj, pathStr) {
    // Try exact path first
    if (obj[pathStr]) return obj[pathStr];
    
    // Try nesting
    const keys = pathStr.split('.');
    let current = obj;
    for (let key of keys) {
        if (current === undefined) return undefined;
        current = current[key];
    }
    
    // Fallback logic specific to the app
    if (current === undefined && !pathStr.startsWith('dashboard.')) {
        return getNestedValue(obj, 'dashboard.' + pathStr);
    }
    return current;
}

// Hardcoded fallbacks for missing keys found in research
const customFallbacks = {
    'dashboard.store.states.step_select_type': 'Ürün Tipini Seçin',
    'dashboard.store.states.add_product_title': 'Yeni Ürün Ekle',
    'dashboard.store.states.add_product_desc': 'Ne tür bir ürün satmak istiyorsunuz?',
    'dashboard.store.states.coming_soon': 'Yakında',
    'dashboard.store.actions.back': 'Geri',
    
    'dashboard.subscribers.title': 'Aboneler',
    'dashboard.subscribers.desc': 'Tüm bülten abonelerinizi yönetin',
    'dashboard.subscribers.search_placeholder': 'Abone ara...',
    'dashboard.subscribers.empty_title': 'Henüz abone yok',
    'dashboard.subscribers.empty_desc': 'Aboneleriniz burada görünecek',
    'dashboard.subscribers.empty_cta': 'Sayfanızı Paylaşın',
    
    'dashboard.customers.search_placeholder': 'Müşteri ara...',
    'dashboard.customers.actions.add_contact': 'Kişi Ekle',
    'dashboard.customers.filters.name': 'İsim',
    'dashboard.customers.filters.email': 'E-posta',
    'dashboard.customers.filters.joined': 'Katılma Tarihi',
    'dashboard.customers.filters.orders': 'Siparişler',
    'dashboard.customers.filters.spent': 'Harcama',
    'dashboard.customers.empty_title': 'Henüz müşteri yok',
    'dashboard.customers.empty_cta': 'Ürün Ekle',
    'dashboard.customers.empty_footer': 'Müşterileriniz sipariş verdiğinde burada görünecek',
};

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Matches {t('some.key') || 'Fallback'} -> {'Fallback'}
    content = content.replace(/\{t\(['"]([^'"]+)['"]\)\s*\|\|\s*['"]([^'"]+)['"]\}/g, (match, key, fallback) => {
        return `{'${fallback}'}`;
    });
    
    // Matches t('some.key') || 'Fallback' -> 'Fallback'
    content = content.replace(/t\(['"]([^'"]+)['"]\)\s*\|\|\s*['"]([^'"]+)['"]/g, (match, key, fallback) => {
        return `'${fallback}'`;
    });

    // Matches {t('some.key')} -> {'Translated'}
    content = content.replace(/\{t\(['"]([^'"]+)['"]\)\}/g, (match, key) => {
        let val = customFallbacks[key] || getNestedValue(trDict, key) || key;
        return `{'${val}'}`;
    });

    // Matches t('some.key') -> 'Translated'
    content = content.replace(/t\(['"]([^'"]+)['"]\)/g, (match, key) => {
        let val = customFallbacks[key] || getNestedValue(trDict, key) || key;
        return `'${val}'`;
    });

    // Remove imports and hooks
    content = content.replace(/import \{ useTranslation \} from ['"]@\/lib\/i18n\/context['"];?\r?\n/g, '');
    content = content.replace(/\s*const \{ t \} = useTranslation\(\);\r?\n/g, '\n');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(fullPath);
        }
    }
}

walkDir(path.join(__dirname, 'app/dashboard'));
walkDir(path.join(__dirname, 'components/dashboard'));
console.log('Done!');
