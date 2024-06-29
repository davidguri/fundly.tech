type Transaction = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  tip: number;
  date: Date;
  duration: number;
  type: string;
  userId: string;
  incoming: boolean;
}

export default Transaction