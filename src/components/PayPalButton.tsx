import { useEffect, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';


const PayPalButton = ({ planId }) => {
  const nav = useNavigate()
  const auth = getAuth();
  const paypalRef = useRef();

  useEffect(() => {
    if (!window.paypal) return;

    window.paypal.Buttons({
      createSubscription: function (data, actions) {
        return actions.subscription.create({
          'plan_id': planId,
        });
        console.log(data);
      },
      onApprove: async function (data, actions) {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            subscriptionStatus: 'active',
            subscriptionId: data.subscriptionID,
            planId: planId,
            membership: planId,
          });
          alert('Subscription completed successfully!');
          localStorage.setItem("payment_complete", JSON.stringify(true));
          nav('/');
          console.log(actions)
        }
      },
      onError: function (err) {
        console.error('PayPal button error', err);
        alert('There was an error with your subscription. Please try again.');
      },
    }).render(paypalRef.current);
  }, [planId]);

  return <div ref={paypalRef}></div>;
};

export default PayPalButton;
