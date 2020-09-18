module.exports = {
    SERVER_REQUEST_ERR: `Prázdna požiadavka`,
    SERVER_VALIDATION_ERR: `Údaje boli nesprávne vyplnené`,
    SERVER_UNIQUE_ERR: `Nasledujúce údaje sa už nachadzajú v databáze: `,
    SERVER_PAGE_NOT_FOUND: `Je nám ľúto, ale požadovaná stránka nebola nájdená`,
    DATABASE_STRUCTURE: `Štruktúra databázy bola úspešne vytvorená a naplnená údajmi`,
    DATABASE_STRUCTURE_ERR: `Nepodarilo sa vytvoriť štruktúru databázy`,
    REDIS_DATABASE_CONNECTION_ERROR: `Nepodarilo sa pripojiť ku: `,
    AUTH_REQUIRED: `Ľutujeme, ale stránka nie je k dispozícií`,
    PROXY_ERR: `Služba je nedostupná`,
    AUTH_ERR: `Prístup odmietnutý`,

    CREATE_CATEGORY_ERR: `Vytvorenie kategórie balíka sa nepodarilo, skúste znova`,
    UPDATE_CATEGORY_ERR: `Aktualizácia kategórie balíka sa nepodarilo, skúste znova`,
    DELETE_CATEGORY_ERR: `Odstránenie kategórie balíka sa nepodarilo, skúste znova`,
    GET_CATEGORY_ERR: `Ľutujeme ale kategória balíka s identifikačním číslom neexistuje`,
    CATEGORY_NOT_FOUND: `Ľutujeme ale nenašiel sa žiadná kategória balíka`,
    
    CREATE_PARCEL_ERR: `Vytvorenie balíka sa nepodarilo, skúste znova`,
    UPDATE_PARCEL_ERR: `Aktualizácia balíka sa nepodarilo, skúste znova`,
    DELETE_PARCEL_ERR: `Odstránenie balíka sa nepodarilo, skúste znova`,
    GET_PARCEL_ERR: `Ľutujeme ale balík s identifikačním číslom neexistuje`,
    PARCEL_NOT_FOUND: `Ľutujeme ale nenašiel sa žiadný balík`,

    CREATE_RATING_ERR: `Vytvorenie ohodnotenia sa nepodarilo, skúste znova`,
    UPDATE_RATING_ERR: `Aktualizácia ohodnotenia sa nepodarilo, skúste znova`,
    DELETE_RATING_ERR: `Odstránenie ohodnotenia sa nepodarilo, skúste znova`,
    GET_RATING_ERR: `Ľutujeme ale ohodnotenie s identifikačním číslom neexistuje`,
    RATING_NOT_FOUND: `Ľutujeme ale nenašiel sa žiadne ohodnotenie`,

    CATEGORY_NAME_LENGHT: `Minimálna dlžka názov kategórie je 3 a maximalná je 64`,
    CATEGORY_NAME_MATCHES: `Nesprávný formát názov kategórie`,
    CATEGORY_ID_INT: `Nesprávný formát identifikacného čísla`,
    CATEGORY_PAGE_NUMBER_INT: `Nesprávný formát číslo strany`,
    CATEGORY_PAGE_SIZE_INT: `Nesprávný formát veľkosť strany`,
    CATEGORY_COLUMN_NAME_ALPHA: `Nesprávný formát názov stľpca`,

    PARCEL_SENDER_ID_INT: `Nesprávný formát identifikacného čísla odosielateľa`,
    PARCEL_RECEIVER_ID_INT: `Nesprávný formát identifikacného prijímateľa`,
    PARCEL_CATEGORY_ID_INT: `Nesprávný formát identifikacného čísla kategórie`,
    PARCEL_LENGHT_FLOAT: `Nesprávný formát dľžky`,
    PARCEL_WIDTH_FLOAT: `Nesprávný formát šírky`,
    PARCEL_HEIGHT_FLOAT: `Nesprávný formát výšky`,
    PARCEL_WEIGHT_FLOAT: `Nesprávný formát hmotnosti`,
    PARCEL_NOTE_MATCHES: `Nesprávný formát poznámky`,
    PARCEL_CANCELED_BOOLEAN: `Nesprávný formát hodnoty zrušenia`,
    PARCEL_ID_INT: `Nesprávný formát identifikacného čísla`,
    PARCEL_PAGE_NUMBER_INT: `Nesprávný formát číslo strany`,
    PARCEL_PAGE_SIZE_INT: `Nesprávný formát veľkosť strany`,
    PARCEL_COLUMN_NAME_ALPHA: `Nesprávný formát názov stľpca`,

    RATING_DESCRIPTION_MATCHES: `Nesprávný formát popisu`,
    RATING_RATING_MATCHES: `Nesprávný formát ohodnotenia`,
    RATING_IMAGE_BASE: `Nesprávný formát obrázka`,
    RATING_PARCEL_ID_INT: `Nesprávný formát identifikacného čísla balíka`,
    RATING_ID_INT: `Nesprávný formát identifikacného čísla`,
    RATING_PAGE_NUMBER_INT: `Nesprávný formát číslo strany`,
    RATING_PAGE_SIZE_INT: `Nesprávný formát veľkosť strany`,
    RATING_COLUMN_NAME_ALPHA: `Nesprávný formát názov stľpca`
};