self.onmessage = function (event) {
  const data = event.data;
  const result = filterCurrentMonthTransactions(data);
  self.postMessage(result);
};

function filterCurrentMonthTransactions(transactions: any) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const filteredTransactions = transactions.filter(transaction => {
    const date = new Date(transaction.date.seconds * 1000);
    const transactionMonth = date.getMonth();
    const transactionYear = date.getFullYear();

    return transactionMonth === currentMonth && transactionYear === currentYear;
  });

  return filteredTransactions;
}