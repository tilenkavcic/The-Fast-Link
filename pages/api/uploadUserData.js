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
	const userId = req.headers.uid; 
	if (token != "unauthenticated") {
		// verify login
		try {
			const authUser = await verifyIdToken(token);
			console.log(authUser);
			if (authUser.id != userId) {
				throw "Page outside of user scope";
			}
		} catch (e) {
			console.error(e);
			res.status(403).json({ error: "Not authorized" });
		}
		// Upload data to firestore
		try {
			const sentData = req.body;
			let ret = await firebase.firestore().collection("users").doc(userId).set(sentData);
			res.status(200).json({ resp: "success" });
		} catch (e) {
			console.error("Error uploading data");
			console.error(e);
			res.status(404).json({ error: "Error uploading data" });
		}
	}
};

export default handler;
