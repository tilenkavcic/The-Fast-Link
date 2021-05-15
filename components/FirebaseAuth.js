/* globals window */
import React, { useEffect, useState, useCallback } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import getAbsoluteURL from "../utils/getAbsoluteURL";
import { useAuthUser } from "next-firebase-auth";

// Note that next-firebase-auth inits Firebase for us,
// so we don't need to.

// const uploadData = async (data) => {
// 	console.log("data", data);
// 	const AuthUser = useAuthUser();
// 	const token = await AuthUser.getIdToken();
// 	const endpoint = getAbsoluteURL("/api/addNewUser");
// 	console.log("token", token);

// 	const response = await fetch(endpoint, {
// 		method: "POST",
// 		headers: {
// 			Authorization: token,
// 			uid: data.user.uid,
// 			email: data.user.email,
// 		},
// 		body: {},
// 	});
// 	const respData = await response.json();
// 	if (!response.ok) {
// 		console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(respData)}`);
// 		return new Promise.reject();
// 	}
// 	return new Promise.resolve();
// };

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
	signInSuccessUrl: "/",
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
							console.log(e);
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
	return <div>{renderAuth ? <StyledFirebaseAuth uiConfig={firebaseAuthConfig} firebaseAuth={firebase.auth()} /> : null}</div>;
};

export default FirebaseAuth;
