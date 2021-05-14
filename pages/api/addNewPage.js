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
				name: newPageName,
				links: [
					{
						pictureUrl: "https://firebasestorage.googleapis.com/v0/b/the-fast-link.appspot.com/o/apple-podcasts.svg?alt=media&token=1c610a8b-e3d8-40ed-b6e6-87bf56710164",
						title: "Apple Podcasts",
						position: "0",
						url: "",
						activated: false
					},
					{
						pictureUrl: "https://firebasestorage.googleapis.com/v0/b/the-fast-link.appspot.com/o/Spotify.svg?alt=media&token=abd5ec3b-dab4-44db-af3c-efb593c2cdce",
						title: "Spotify",
						position: "1",
						url: "",
						activated: false
					},
					{
						pictureUrl: "https://firebasestorage.googleapis.com/v0/b/the-fast-link.appspot.com/o/google-podcasts.svg?alt=media&token=b5772088-be62-457c-9d99-53e8e7cd87e6",
						title: "Google Podcasts",
						position: "2",
						url: "",
						activated: false
					},
					{
						pictureUrl: "https://firebasestorage.googleapis.com/v0/b/the-fast-link.appspot.com/o/pocket-casts.svg?alt=media&token=3c3f4c67-57ba-468e-8879-4580f736d4a9",
						title: "Pocket Casts",
						position: "3",
						url: "",
						activated: false
					},
					{
						pictureUrl: "https://firebasestorage.googleapis.com/v0/b/the-fast-link.appspot.com/o/rss.svg?alt=media&token=129c068d-4a47-4eac-a488-f4b9c432a6fe",
						title: "RSS",
						position: "4",
						url: "",
						activated: false
					},
					{
						pictureUrl: "https://firebasestorage.googleapis.com/v0/b/the-fast-link.appspot.com/o/overcast.svg?alt=media&token=087cef55-847e-4f75-a093-f49df2b49591",
						title: "Overcast",
						position: "5",
						url: "",
						activated: false
					},
					{
						pictureUrl: "https://firebasestorage.googleapis.com/v0/b/the-fast-link.appspot.com/o/podcast-addict.svg?alt=media&token=8bf8943c-9837-4fcd-a9d3-1e05544f36a2",
						title: "Podcast Addict",
						position: "6",
						url: "",
						activated: false
					},
					{
						pictureUrl: "https://firebasestorage.googleapis.com/v0/b/the-fast-link.appspot.com/o/radiopublic.svg?alt=media&token=2992486d-5ee2-44c0-8e40-7ad45deddbba",
						title: "RadioPublic",
						position: "7",
						url: "",
						activated: false
					},
					{
						pictureUrl: "https://firebasestorage.googleapis.com/v0/b/the-fast-link.appspot.com/o/podchaser.svg?alt=media&token=f214b8bc-1d3b-46b9-b574-83ee6d160d79",
						title: "Podchaser",
						position: "8",
						url: "",
						activated: false
					},
					{
						pictureUrl: "https://firebasestorage.googleapis.com/v0/b/the-fast-link.appspot.com/o/castbox.svg?alt=media&token=139106c2-c6ad-4e7d-b374-aee370dd4b65",
						title: "Castbox",
						position: "9",
						url: "",
						activated: false
					},
					{
						pictureUrl: "https://firebasestorage.googleapis.com/v0/b/the-fast-link.appspot.com/o/breaker.svg?alt=media&token=36e512c1-9182-4d67-a2c7-ff8faac29379",
						title: "Breaker",
						position: "10",
						url: "",
						activated: false
					},
					{
						pictureUrl: "https://firebasestorage.googleapis.com/v0/b/the-fast-link.appspot.com/o/castro.svg?alt=media&token=a45ef392-b82a-44eb-8f86-c281050ee41a",
						title: "Castro",
						position: "11",
						url: "",
						activated: false
					},
					{
						pictureUrl: "https://firebasestorage.googleapis.com/v0/b/the-fast-link.appspot.com/o/stitcher.svg?alt=media&token=974a08ad-4c38-4c69-b40b-1181bd446ef2",
						title: "Stitcher",
						position: "12",
						url: "",
						activated: false
					},
				],
			};
			const ret2 = await firebase.firestore().collection("homepage").doc(newPageName).set(newPage);
			res.status(200).json({ resp: 'success' });
		} catch (e) {
			console.error("Error uploading data");
			console.error(e);
			return res.status(404).json({ error: "Error uploading data" });
		}
	}
};

export default handler;
