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
	if (token != "unauthenticated") {
		// verify login
		try {
			const authUser = await verifyIdToken(token);
			// check if user can edit this page
		} catch (e) {
			console.error(e);
			res.status(403).json({ error: "Not authorized" });
		}
		// Get data from firestore
		try {
			const page = JSON.parse(req.headers.page);
			let pageData = await firebase.firestore().collection("homepage").doc(page.title).get();
			pageData = pageData.data();
			pageData.links.sort((a, b) => (a.position > b.position ? 1 : -1));
			
			res.status(200).json(pageData);
		} catch (e) {
			console.error("Error getting page data");
			console.error(e);
			res.status(404).json({ error: "Error getting page data" });
		}
	}
};

export default handler;
