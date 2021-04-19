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
			const pageName = req.headers.page;
			const sentData = req.body;

			// upload picture
			if (sentData.file) {
				const storageRef = firebase.storage().ref();

				// Create a reference
				const mountainsRef = storageRef.child("userfiles/mountains.jpg");

				// 'file' comes from the Blob or File API
				const ret = await storageRef.put(file);
				console.log("uploaded", ret);
			}
			console.log("uploaded", ret);

			// upload title, desc
			const docRef = await firebase.firestore().collection("homepage").doc(sentData.name);
			const res = await docRef.set(
				{
					title: sentData.title,
					description: sentData.description,
					pictureUrl: ret ? ret : "" // problem če edita sliko in je  ne dodaja
				},
				{ merge: true }
			);
			return res.status(200);
		} catch (e) {
			console.error("Error uploading data");
			console.error(e);
			return res.status(404).json({ error: "Error uploading data" });
		}
	}
};

export default handler;
