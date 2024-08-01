export type Transaction = {
  id: string;
  name: string;
  amount: any;
  currency: string;
  business: string;
  tip: any;
  date: Date;
  duration: any;
  type: string;
  incoming: boolean;
};
