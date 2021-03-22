import { useAuthUser, withAuthUser, withAuthUserTokenSSR, verifyIdToken } from "next-firebase-auth";
import initAuth from "../../utils/initAuth";
import firebase from "../../firebase/clientApp";
import "firebase/firestore";

initAuth();

const handler = async (req, res) => {
	if (!(req.headers && req.headers.authorization)) {
		return res.status(400).json({ error: "Missing Authorization header value" });
	}
	const token = req.headers.authorization;
	if (token != "unauthenticated") {
		// verify login
		try {
			await verifyIdToken(token);
		} catch (e) {
			console.error(e);
			return res.status(403).json({ error: "Not authorized" });
		}
		// Get data from firestore
		try {
			const uid = req.headers.uid;
			const userData = await firebase.firestore().collection("users").doc(uid).get();
			return res.status(200).json(userData.data());
		} catch (e) {
			console.error("Error getting user data");
			console.error(e);
			return res.status(404).json({ error: "Error getting user data" });
		}
	}
};

export default handler;
