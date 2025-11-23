
/**
 * @function formatDate
 * Converts an ISO date string into a human-readable, localized date string.
 * Example output: "July 7, 2025".
 *
 * @param {string} isoString - A valid ISO 8601 date string (e.g., "2025-07-07T12:34:56Z").
 * @returns {string} Formatted date string in the user's local language and format.
 **/
/*export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}*/
/**
 * @function formatDate
 * Converts an ISO date string into a human-readable, localized date string.
 * Example output: "July 7, 2025".
 *
 * @param {string} isoString - A valid ISO 8601 date string (e.g., "2025-07-07T12:34:56Z").
 * @returns {string} Formatted date string in the user's local language and format.
 **/
export function formatDate(isoString) {
  if (!isoString) {
    console.warn('formatDate: Missing date string');
    return 'Date unavailable';
  }
  
  try {
    const date = new Date(isoString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('formatDate: Invalid date string:', isoString);
      return 'Date unavailable';
    }
    
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error('formatDate: Error formatting date:', isoString, error);
    return 'Date unavailable';
  }
}
