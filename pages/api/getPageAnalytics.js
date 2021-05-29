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
			// check if user has rights to edit this page
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
			const pageName = req.headers.page;
			const ref = firebase.firestore().collection("analytics");
			let toTime = new Date()
			let fromTime = new Date(toTime.setMonth(toTime.getMonth()-1));

			console.log(toTime, fromTime)
			
			// let pageData = await ref.where("page", "==", pageName).where("timestamp", ">", fromTime).where("timestamp", "<", toTime).get();
			// pageData = pageData.data();

			if (pageData.author != uid) {
				throw "Page outside of user scope";
			} else {
				res.status(200).json(pageData);
			}
		} catch (e) {
			console.error("Error getting page data");
			console.error(e);
			res.status(404).json({ error: "Error getting page data" });
		}
	}
};

export default handler;
