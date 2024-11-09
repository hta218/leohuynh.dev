let { replace } = ''
let ca = /[&<>'"]/g
let esca = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}

function pe(m: keyof typeof esca) {
  return esca[m]
}

/**
 * Safely escape HTML entities such as `&`, `<`, `>`, `"`, and `'`.
 * @param {string} es the input to safely escape
 * @returns {string} the escaped input, and it **throws** an error if
 *  the input type is unexpected, except for boolean and numbers,
 *  converted as string.
 */
export function escape(es: string): string {
  return replace.call(es, ca, pe)
}
