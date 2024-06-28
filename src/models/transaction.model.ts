enum TransactionType {
  contract = "Contract",
  freelance = "Freelance",
  // TODO: figure these out
  // TODO: add template functionality
}

type Transaction = {
  id: string;
  name: string;
  amount: number;
  tip: number;
  date: Date;
  type: TransactionType;
  incoming: boolean;
}

export default Transaction