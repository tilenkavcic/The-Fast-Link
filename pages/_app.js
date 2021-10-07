import React from "react";
import "../styles/global.scss";
import "../styles/firebaseAuth.global.scss";
import initAuth from "../utils/initAuth";

initAuth();

function MyApp({ Component, pageProps }) {
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <Component {...pageProps} />;
}

export default MyApp;
