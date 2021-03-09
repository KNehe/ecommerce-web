import '../styles/globals.css'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { wrapper } from '../state/redux/store';
import { useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ProgressIndicator from '../components/progress_indicator/progress_indicator'

const  NeheEcommerceApp = ({ Component, pageProps }) => {

    const stripePromise = loadStripe('pk_test_nGOzznmrg37WxxREAMw8jNHj00ukQ2wSgi')

    const store = useStore()

    return (
      <PersistGate persistor={ store.__persistor} loading={<ProgressIndicator/>}>
         <Elements stripe={stripePromise}>
          <Component {...pageProps} />
        </Elements>
      </PersistGate>
    );
  
}

export default wrapper.withRedux(NeheEcommerceApp);
