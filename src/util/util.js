export const addThousandSeparators = (num) => {
  if (num == null || isNaN(num)) return '';

  //convert number to string to handle decimal
  const numStr = num.toString();
  const parts = numStr.split('.');

  let integerPart = parts[0];
  let fractionalPart = parts[1];

  //regex for Indian number system
  //it handles the first 3 digits and then subsequent 2 digits
  const lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);

  if (otherNumbers !== '') {
    //apply comma after every 2 digits in the otherNumbers part
    const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    integerPart = formattedOtherNumbers + ',' + lastThree;
  } else {
    integerPart = lastThree;
  }

  //combine integer and fractional parts
  return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
};