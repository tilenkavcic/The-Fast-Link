import { useAuthUser, withAuthUser, withAuthUserTokenSSR, verifyIdToken } from "next-firebase-auth";
import initAuth from "../../utils/initAuth";
import firebase from "../../firebase/adminApp";
import "firebase/firestore";

initAuth();

const handler = async (req, res) => {
	if (!(req.headers && req.headers.authorization)) {
		return res.status(400).json({ error: "Missing Authorization header value" });
	}
	const token = req.headers.authorization;
	const uid = req.headers.uid;
	if (token != "unauthenticated") {
		// verify login
		try {
			const authUser = await verifyIdToken(token);
			// TODO check if this page is of user
			if (authUser.id != uid) {
				throw "Page outside of user scope";
			}
		} catch (e) {
			console.error(e);
			res.status(403).json({ error: "Not authorized" });
		}
		// Upload data to firestore
		try {
			const pageName = req.headers.page;
			const submittedTile = req.headers.submittedtile;
			const submittedDescription = req.headers.submiteddescription;

			// --- upload picture
			// const picture = req.body;
			// if (picture) {
			// 	const pictureTitle = req.headers.pictitle;
			// 	const pictureType = req.headers.pictype;
			// 	const pictureSize = req.headers.picsize;
			// 	const validPicTypes = ["image/gif", "image/jpeg", "image/png"];
			// 	if (!validPicTypes.includes(pictureType)) {
			// 		console.error("Invalid image type");
			// 		return res.status(400).json({ error: "Invalid image type" });
			// 	}

			// 	const storageRef = firebase.storage().ref();
			// 	const metadata = {
			// 		name: pictureTitle,
			// 		size: pictureSize,
			// 	};
			// 	console.log(picture);
			// 	console.log("uploading pic", pictureTitle);

			// 	const uploadTask = await storageRef.child(pictureTitle).put(picture, metadata);

			// 	console.log("aaaaaa");
			// 	console.log("uploaded", uploadTask);
			// }

			// upload title, desc
			const updatedData = {
				title: submittedTile,
				description: submittedDescription,
			};
			const ress = await firebase.firestore().collection("homepage").doc(pageName).set(updatedData, { merge: true });
			res.status(200).json({ resp: 'success' });
		} catch (e) {
			console.error("Error uploading data");
			console.error(e);
			res.status(404).json({ error: "Error uploading data" });
		}
	}
};

export default handler;
