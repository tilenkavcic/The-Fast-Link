/* globals window */
import React, { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { EmailAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Row } from "react-bootstrap";
import { auth, db } from "../firebase/clientApp";

const firebaseAuthConfig = {
	signInFlow: "popup",
	// Auth providers
	// https://github.com/firebase/firebaseui-web#configure-oauth-providers
	signInOptions: [
		{
			provider: EmailAuthProvider.PROVIDER_ID,
			requireDisplayName: false,
		},
		// {
		// 	provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
		// 	signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
		// },
		// {
		// 	provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
		// },
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
					const userRef = doc(db, "users", userId);
					setDoc(userRef, newUser)
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
			return false;
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
	return (
		<Row>
			{renderAuth ? (
				<StyledFirebaseAuth
					uiConfig={firebaseAuthConfig}
					firebaseAuth={auth}
				/>
			) : null}
		</Row>
	);
};

export default FirebaseAuth;
