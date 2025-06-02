function truncateString(str: string, startLength: number, endLength: number): string {
  // Check if the actual string length is greater than the sum of startLength and endLength
  if (str.length > startLength + endLength) {
    return str.substring(0, startLength) + "......" + str.substring(str.length - endLength);
  } else {
    // If the string is not long enough to truncate, return the original string
    return str;
  }
}

export default truncateString;
