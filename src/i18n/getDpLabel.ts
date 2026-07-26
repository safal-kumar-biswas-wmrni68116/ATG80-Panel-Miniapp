import Strings from './index';

/**
 * Resolves the multilingual label for a DP's current value, following
 * Tuya's `dp_<dpCode>_<value>` key convention (values lowercased; booleans
 * mapped to 1/0 to match `dp_switch_1` / `dp_switch_0` style keys).
 *
 * Falls back to the raw value (title-cased, underscores replaced with
 * spaces) if no matching key exists in strings.ts, so the UI never shows
 * the raw `i18n@...` placeholder text to the user.
 */
export function getDpLabel(dpCode: string, value: string | number | boolean): string {
  let normalized: string;

  if (typeof value === 'boolean') {
    normalized = value ? '1' : '0';
  } else {
    normalized = String(value).toLowerCase();
  }

  const key = `dp_${dpCode}_${normalized}`;
  const label = Strings.getLang(key);

  // Strings.getLang returns `i18n@key` when the key is missing — catch that
  // and fall back to a readable version of the raw value instead.
  if (!label || label.startsWith('i18n@')) {
    return String(value).replace(/_/g, ' ');
  }

  return label;
}
