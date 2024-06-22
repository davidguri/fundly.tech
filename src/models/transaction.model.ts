enum TransactionType {
  contract = "Contract",
  freelance = "Freelance",
  // TODO: figure these out
}

type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: Date;
  type: TransactionType;
  incoming: boolean;
}

export default Transaction