self.onmessage = async function (event) {
  const { currentMonthExpenses, userCurrency } = event.data;

  async function convertCurrency(fromCurrency, toCurrency, amount) {
    try {
      const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency.toLowerCase()}.json`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      const rate = data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];
      const convertedAmount = amount * rate;
      return convertedAmount;
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      return 0;
    }
  }

  let monthlyExpenses = 0;

  for (const expense of currentMonthExpenses) {
    if (expense.currency !== userCurrency) {
      const convertedAmount = await convertCurrency(expense.currency, userCurrency, parseFloat(expense.amount));
      monthlyExpenses += convertedAmount;
    } else {
      monthlyExpenses += parseFloat(expense.amount);
    }
  }

  monthlyExpenses = parseFloat(monthlyExpenses.toFixed(2));
  self.postMessage(monthlyExpenses);
};
