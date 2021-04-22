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
			console.log(req.body);
			const uid = req.headers.uid;
			const pageName = req.headers.page;
			const picture = req.body;
			const submittedTile = req.headers.submittedtile;
			const submittedDescription = req.headers.submiteddescription;

			// upload picture
			if (picture) {
				const pictureTitle = req.headers.pictitle;
				const pictureType = req.headers.pictype;
				const pictureSize = req.headers.picsize;
				const validPicTypes = ["image/gif", "image/jpeg", "image/png"];
				if (!validPicTypes.includes(pictureType)) {
					console.error("Invalid image type");
					return res.status(400).json({ error: "Invalid image type" });
				}

				const storageRef = firebase.storage().ref();
				const metadata = {
					name: pictureTitle,
					size: pictureSize,
				};
				console.log(picture);
				console.log("uploading pic", pictureTitle);

				const uploadTask = await storageRef.child(pictureTitle).put(picture, metadata);

				console.log("aaaaaa");
				console.log("uploaded", uploadTask);
				console.log("uploaded", uploadTask.state);
				console.log("uploaded", uploadTask.metadata);
				console.log("uploaded", uploadTask.ref);
			}

			// upload title, desc
			const docRef = await firebase.firestore().collection("homepage").doc(submittedTile);
			updatedData = picture
				? {
						title: submittedTile,
						description: submittedDescription,
						// pictureUrl: uploadTask.url
				  }
				: {
						title: submittedTile,
						description: submittedDescription,
				  };
			const res = await docRef.set(updatedData, { merge: true });
			return res.status(200);
		} catch (e) {
			console.error("Error uploading data");
			console.error(e);
			return res.status(404).json({ error: "Error uploading data" });
		}
	}
};

export default handler;
