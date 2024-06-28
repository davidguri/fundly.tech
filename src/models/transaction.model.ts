type Transaction = {
  name: string;
  amount: number;
  tip: number;
  date: Date;
  duration: number;
  type: string;
  userId: string;
  incoming: boolean;
}

export default Transaction