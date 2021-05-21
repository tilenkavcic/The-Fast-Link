import { useAuthUser, withAuthUser, withAuthUserTokenSSR, verifyIdToken } from "next-firebase-auth";
import initAuth from "../../utils/initAuth";
import firebase from "../../firebase/adminApp";
import "firebase/firestore";

initAuth();

const handler = async (req, res) => {
	if (!(req.headers && req.headers.authorization)) {
		res.status(400).json({ error: "Missing Authorization header value" });
	}
	const token = req.headers.authorization;
	const uid = req.headers.uid;

	if (token != "unauthenticated") {
		// verify login
		try {
			const authUser = await verifyIdToken(token);
			if (authUser.id != uid) {
				throw "Page outside of user scope";
			}
		} catch (e) {
			console.error(e);
			res.status(403).json({ error: "Not authorized" });
		}
		// Get data from firestore
		try {
			const ref = firebase.firestore().collection("users").doc(uid);
			const userData = await ref.get();

			res.status(200).json(userData.data());
		} catch (e) {
			console.error("Error getting user data");
			console.error(e);
			res.status(404).json({ error: "Error getting user data" });
		}
	}
};

export default handler;
