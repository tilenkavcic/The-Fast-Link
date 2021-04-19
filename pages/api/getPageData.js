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
			const page = JSON.parse(req.headers.page);
			let pageData = await firebase.firestore().collection("homepage").doc(page.title).get();
			pageData = pageData.data();
			pageData.links.sort((a, b) => (a.position > b.position ? 1 : -1));
			console.log(pageData)
			
			return res.status(200).json(pageData);
		} catch (e) {
			console.error("Error getting page data");
			console.error(e);
			return res.status(404).json({ error: "Error getting page data" });
		}
	}
};

export default handler;
