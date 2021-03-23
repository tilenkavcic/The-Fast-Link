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
			console.log(req.body);
			const sentData = req.body;
			const ret1 = await firebase.firestore().collection("users").doc(uid).set(sentData);
			const newPageName = sentData.pages[sentData.pages.length - 1].title;
			const newPage = {
				title: "",
				description: "",
				pictureUrl: "",
				links: [
					{
						pictureUrl: "",
						title: "",
						position: "",
						url: "",
					},
				],
			};
			const ret2 = await firebase.firestore().collection("homepage").doc(newPageName).set(newPage);

			return res.status(200);
		} catch (e) {
			console.error("Error uploading data");
			console.error(e);
			return res.status(404).json({ error: "Error uploading data" });
		}
	}
};

export default handler;
