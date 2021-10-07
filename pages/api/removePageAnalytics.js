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
		return res
			.status(400)
			.json({ error: "Missing Authorization header value" });
	}
	const token = req.headers.authorization;
	const uid = req.headers.uid;
	if (token != "unauthenticated") {
		// verify login
		try {
			// check if user has rights to edit this page
			const authUser = await verifyIdToken(token);
			if (authUser.id != uid) {
				throw "Page outside of user scope";
			}
		} catch (e) {
			console.error(e);
			res.status(403).json({ error: "Not authorized" });
		}
		// Upload data to firestore
		try {
			const pageName = req.body.title;

			const analytics = await firebase
				.firestore()
				.collection("analytics")
				.where("page", "==", pageName)
				.get();

			analytics.forEach((doc) => {
				doc.ref.delete();
			});

			res.status(200).json({ resp: "success" });
		} catch (e) {
			console.error("Error deleting data");
			console.error(e);
			res.status(404).json({ error: "Error deleting data" });
		}
	}
};

export default handler;
