export default function roundUpEther(numberStr: string): string {
  try {
    // Parse the string as a float
    const number = parseFloat(numberStr);

    // Round the number to three decimal places
    return number.toFixed(3);
  } catch (error) {
    // If an error occurs during parsing or rounding, return an Error object
    throw new Error('Invalid input: The string must be a valid number.');
  }
}
