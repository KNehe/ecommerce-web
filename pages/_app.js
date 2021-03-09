import '../styles/globals.css'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import App from "next/app";
import { wrapper } from '../state/redux/store';

class NeheEcommerceApp extends App {

  render() {
    const { Component, pageProps } = this.props;
    const stripePromise = loadStripe('pk_test_nGOzznmrg37WxxREAMw8jNHj00ukQ2wSgi')

    return (
        <Elements stripe={stripePromise}>
          <Component {...pageProps} />
        </Elements>
    );
  }
}

export default wrapper.withRedux(NeheEcommerceApp);
