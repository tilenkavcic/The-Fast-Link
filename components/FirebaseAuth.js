/* globals window */
import React, { useEffect, useState, useCallback } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import getAbsoluteURL from "../utils/getAbsoluteURL";
import { Row } from "react-bootstrap";
// Note that next-firebase-auth inits Firebase for us,
// so we don't need to.

const firebaseAuthConfig = {
	signInFlow: "popup",
	// Auth providers
	// https://github.com/firebase/firebaseui-web#configure-oauth-providers
	signInOptions: [
		{
			provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
			requireDisplayName: false,
		},
	],
	signInSuccessUrl: "/admin",
	credentialHelper: "none",
	callbacks: {
		// https://github.com/firebase/firebaseui-web#signinsuccesswithauthresultauthresult-redirecturl
		signInSuccessWithAuthResult: (authResult, redirectUrl) => {
			authResult.user.getIdTokenResult().then((tokenResult) => {
				if (authResult.additionalUserInfo.isNewUser) {
					const userId = authResult.user.uid;
					const newUser = { email: authResult.user.email, pages: [] };
					firebase
						.firestore()
						.collection("users")
						.doc(userId)
						.set(newUser)
						.then((ret) => {
							return false;
						})
						.catch((e) => {
							console.error(e);
							return false;
						});
				} else {
					// Don't automatically redirect. We handle redirecting based on
					// auth state in withAuthComponent.js.
					return false;
				}
			});
		},
	},
};

const FirebaseAuth = () => {
	// Do not SSR FirebaseUI, because it is not supported.
	// https://github.com/firebase/firebaseui-web/issues/213
	const [renderAuth, setRenderAuth] = useState(false);
	useEffect(() => {
		if (typeof window !== "undefined") {
			setRenderAuth(true);
		}
	}, []);
	return <Row>{renderAuth ? <StyledFirebaseAuth uiConfig={firebaseAuthConfig} firebaseAuth={firebase.auth()} /> : null}</Row>;
};

export default FirebaseAuth;
