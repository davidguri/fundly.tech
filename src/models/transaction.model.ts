type Transaction = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  business: string;
  tip: number;
  date: Date;
  duration: number;
  type: string;
  incoming: boolean;
}

export default Transaction