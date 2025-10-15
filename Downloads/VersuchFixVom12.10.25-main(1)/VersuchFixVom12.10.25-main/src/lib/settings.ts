import { query } from './db';

export interface Setting {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  category: string;
  description: string;
  updated_at: string;
  updated_by: number | null;
}

export interface Settings {
  [key: string]: string;
}

/**
 * Fetch all settings or filter by category
 * Server-side only
 */
export async function getSettings(category?: string): Promise<Settings> {
  try {
    let sql = 'SELECT * FROM site_settings';
    const params: string[] = [];

    if (category) {
      sql += ' WHERE category = $1';
      params.push(category);
    }

    sql += ' ORDER BY category, setting_key';

    const result = await query(sql, params.length > 0 ? params : undefined);

    // Convert to key-value object
    const settings: Settings = {};
    result.rows.forEach((row: Setting) => {
      settings[row.setting_key] = row.setting_value;
    });

    return settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {};
  }
}

/**
 * Fetch a single setting by key
 * Server-side only
 */
export async function getSetting(key: string): Promise<string | null> {
  try {
    const result = await query(
      'SELECT setting_value FROM site_settings WHERE setting_key = $1',
      [key]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].setting_value;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }
}

/**
 * Fetch all settings with metadata
 * Server-side only
 */
export async function getSettingsRaw(category?: string): Promise<Setting[]> {
  try {
    let sql = 'SELECT * FROM site_settings';
    const params: string[] = [];

    if (category) {
      sql += ' WHERE category = $1';
      params.push(category);
    }

    sql += ' ORDER BY category, setting_key';

    const result = await query(sql, params.length > 0 ? params : undefined);
    return result.rows;
  } catch (error) {
    console.error('Error fetching settings (raw):', error);
    return [];
  }
}

/**
 * Update a single setting
 * Server-side only
 */
export async function updateSetting(
  key: string,
  value: string,
  userId?: number
): Promise<boolean> {
  try {
    await query(
      `UPDATE site_settings
       SET setting_value = $1,
           updated_at = CURRENT_TIMESTAMP,
           updated_by = $2
       WHERE setting_key = $3`,
      [value, userId || null, key]
    );

    return true;
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    return false;
  }
}

/**
 * Update multiple settings at once
 * Server-side only
 */
export async function updateSettings(
  updates: Array<{ key: string; value: string }>,
  userId?: number
): Promise<boolean> {
  try {
    for (const update of updates) {
      await updateSetting(update.key, update.value, userId);
    }

    return true;
  } catch (error) {
    console.error('Error updating settings:', error);
    return false;
  }
}

/**
 * Parse JSON setting value
 */
export function parseJsonSetting(value: string | null): unknown {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

/**
 * Default fallback values for settings
 */
export const DEFAULT_SETTINGS: Settings = {
  // Contact
  contact_phone: '09938 2320307',
  contact_phone_formatted: '+4909938230307',
  contact_email: 'info@restaurant-alas.de',
  contact_address_street: 'Bundesstr. 39',
  contact_address_city: '94554 Moos',
  contact_address_region: 'Niederbayern',
  contact_facebook: 'https://www.facebook.com/p/Griechisches-Restaurant-ALAS-61552077044507/',
  contact_instagram: 'https://www.instagram.com/griechischesrestaurantalas/',

  // Content
  hero_title: 'Restaurant ALAS',
  hero_subtitle: 'Willkommen bei',
  hero_badge: 'Restaurant ALAS - Moos',
  hero_description: 'Authentische griechische Küche in gemütlicher Atmosphäre',
  about_title: 'Über Restaurant ALAS',
  about_description:
    'Herzlich willkommen im Restaurant ALAS! Seit über 30 Jahren servieren wir Ihnen authentische griechische Spezialitäten in familiärer Atmosphäre.',
  reservation_note:
    'Reservierungen sind aus organisatorischen Gründen ausschließlich telefonisch möglich',
  reservation_message:
    'Wir freuen uns auf Ihren Anruf und nehmen Ihre Reservierung gerne persönlich entgegen!',
  footer_tagline: 'Authentische griechische Küche seit über 30 Jahren',

  // Media
  logo_path: '/logo/logo.png',
  hero_videos: '["/videos/restaurant-hero-1.mp4","/videos/restaurant-hero-2.mp4","/videos/restaurant-hero-3.mp4"]',
};

/**
 * Get settings with fallback to defaults
 */
export async function getSettingsWithFallback(category?: string): Promise<Settings> {
  const settings = await getSettings(category);

  // Merge with defaults
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
  };
}
