import {
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
	verifyIdToken,
} from "next-firebase-auth";
import initAuth from "../../utils/initAuth";
import firebase from "../../firebase/adminApp";
import "firebase/firestore";

initAuth();

const handler = async (req, res) => {
	if (!(req.headers && req.headers.authorization)) {
		res.status(400).json({ error: "Missing Authorization header value" });
	}
	const token = req.headers.authorization;
	const pageName = req.body.name;
	const sentData = req.body;
	const uid = req.headers.uid;
	if (token != "unauthenticated") {
		// verify login
		try {
			// check if user has rights to edit this page
			const authUser = await verifyIdToken(token);
			if (authUser.id != uid || sentData.author != authUser.id) {
				throw "Page outside of user scope";
			}
		} catch (e) {
			console.error(e);
			res.status(403).json({ error: "Not authorized" });
		}
		// Upload data to firestore
		try {
			let ret = await firebase
				.firestore()
				.collection("homepage")
				.doc(pageName)
				.set(sentData);
			res.status(200).json({ resp: "success" });
		} catch (e) {
			console.error("Error getting page data");
			console.error(e);
			res.status(404).json({ error: "Error getting page data" });
		}
	}
};

export default handler;
