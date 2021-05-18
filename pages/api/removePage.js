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
			res.status(403).json({ error: "Not authorized" });
		}
		// Upload data to firestore
		try {
			const uid = req.headers.uid;
			const pageName = req.body.title;
			const ress = await firebase.firestore().collection("homepage").doc(pageName).delete();
			res.status(200).json({ resp: "success" });
		} catch (e) {
			console.error("Error uploading data");
			console.error(e);
			res.status(404).json({ error: "Error uploading data" });
		}
	}
};

export default handler;
