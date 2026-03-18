export function convertBase(value: string, fromBase: number, toBase: number): string {
  if (!value) return '';
  try {
    // Basic cleanup
    let cleanVal = value.replace(/\s/g, '');
    if (fromBase === 16) cleanVal = cleanVal.replace(/^0x/i, '');
    if (fromBase === 2) cleanVal = cleanVal.replace(/^0b/i, '');
    if (fromBase === 8) cleanVal = cleanVal.replace(/^0o/i, '');

    // Check if it's empty after cleanup
    if (!cleanVal) return '';

    // Convert using BigInt to support large numbers

    // Validate characters based on base
    const validRegex = getRegexForBase(fromBase);
    if (!validRegex.test(cleanVal)) {
      throw new Error(`Invalid characters for base ${fromBase}`);
    }

    let decimalStr: string;
    if (fromBase === 10) {
      decimalStr = cleanVal;
    } else {
      decimalStr = parseBigIntFromBase(cleanVal, fromBase).toString(10);
    }

    const decimalBigInt = BigInt(decimalStr);

    let resultStr = decimalBigInt.toString(toBase);
    if (toBase === 16) {
      resultStr = resultStr.toUpperCase();
    }
    return resultStr;
  } catch {
    throw new Error('Invalid input');
  }
}

function getRegexForBase(base: number): RegExp {
  switch (base) {
    case 2:
      return /^[01]+$/;
    case 8:
      return /^[0-7]+$/;
    case 10:
      return /^-?[0-9]+$/;
    case 16:
      return /^[0-9a-fA-F]+$/;
    default:
      return /^.+$/;
  }
}

function parseBigIntFromBase(value: string, base: number): bigint {
  if (base === 10) return BigInt(value);

  const isNegative = value.startsWith('-');
  const absValue = isNegative ? value.slice(1) : value;

  let result = 0n;
  const chars = absValue.toLowerCase();

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    let digitValue: number;

    if (char >= '0' && char <= '9') {
      digitValue = char.charCodeAt(0) - 48;
    } else if (char >= 'a' && char <= 'z') {
      digitValue = char.charCodeAt(0) - 87;
    } else {
      throw new Error('Invalid character');
    }

    if (digitValue >= base) {
      throw new Error('Digit too large for base');
    }

    result = result * BigInt(base) + BigInt(digitValue);
  }

  return isNegative ? -result : result;
}
