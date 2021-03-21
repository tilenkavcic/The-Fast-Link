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
		// Upload data to firestore
		try {
			const uid = req.headers.uid;
			let userData = await firebase.firestore().collection("users").doc(uid).get();
			userData = userData.data();
			const pageName = userData.pages[0]; // TODO: HARD CODED
			const sentData = JSON.parse(req.body);
			let ret = await firebase.firestore().collection("homepage").doc(pageName).set(sentData);
			return res.status(200);
		} catch (e) {
			console.error("Error getting page data");
			console.error(e);
		}
	}
};

export default handler;
