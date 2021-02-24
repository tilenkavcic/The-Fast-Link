import React from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, verifyIdToken } from "next-firebase-auth";
import initAuth from "../../utils/initAuth";
import firebase from "../../firebase/clientApp";
import 'firebase/firestore';

initAuth();

const handler = async (req, res) => {
	if (!(req.headers && req.headers.authorization)) {
		return res.status(400).json({ error: "Missing Authorization header value" });
	}
	const token = req.headers.authorization;
	// This "unauthenticated" token is just an demo of the
	// "SSR with no token" example.
	if (token != "unauthenticated") {
		// verify login
		try {
			await verifyIdToken(token);
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
			return res.status(403).json({ error: "Not authorized" });
		}
		// Get data from firestore
		try {
			console.log("asd")
			// const uid = req.headers.uid;
			const asdas = await firebase.firestore().collection("homepage").doc("username").get();
			const userData = await firebase.firestore().collection("users").doc(uid).get();
			console.log(userData);
			const pageName = userData.pages[0];
			const pageData = await firebase.firestore().collection("homepage").doc(pageName).get();
			console.log(pageData);

			return fileNames.map((fileName) => {
				return {
					params: {
						id: fileName,
					},
				};
			});
		} catch (error) {
			console.error("Error all page ids");
			console.error(error);
		}
	}

	return res.status(200).json({ favoriteColor });
};

export default handler;
