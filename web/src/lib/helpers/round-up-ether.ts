export default function toFixedTwoFromString(numberStr: string): string {
  try {
    const number = parseFloat(numberStr);
    return number.toFixed(2);
  } catch (error) {
    throw new Error('Invalid input: The string must be a valid number.');
  }
}
