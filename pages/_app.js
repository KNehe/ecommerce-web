import Store from '../state/store/store'
import '../styles/globals.css'

import App from "next/app";

class NeheEcommerceApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Store>
        <Component {...pageProps} />
      </Store>
    );
  }
}

export default NeheEcommerceApp;
