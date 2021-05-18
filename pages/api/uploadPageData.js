import { useAuthUser, withAuthUser, withAuthUserTokenSSR, verifyIdToken } from "next-firebase-auth";
import initAuth from "../../utils/initAuth";
import firebase from "../../firebase/clientApp";
import "firebase/firestore";

initAuth();

const handler = async (req, res) => {
	if (!(req.headers && req.headers.authorization)) {
		res.status(400).json({ error: "Missing Authorization header value" });
	}
	const token = req.headers.authorization;
	if (token != "unauthenticated") {
		// verify login
		try {
			await verifyIdToken(token);
		} catch (e) {
			console.error(e);
			res.status(403).json({ error: "Not authorized" });
		}
		// Upload data to firestore
		try {
			const pageName = req.headers.page;
			const sentData = req.body;
			let ret = await firebase.firestore().collection("homepage").doc(pageName).set(sentData);
			res.status(200).json({ resp: 'success' });
		} catch (e) {
			console.error("Error getting page data");
			console.error(e);
			res.status(404).json({ error: "Error getting page data" });
		}
	}
};

export default handler;
