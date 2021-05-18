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
						pictureUrl: "/apple-podcasts.svg",
						title: "Apple Podcasts",
						position: "0",
						url: "",
						activated: false,
					},
					{
						pictureUrl: "/Spotify.svg",
						title: "Spotify",
						position: "1",
						url: "",
						activated: false,
					},
					{
						pictureUrl: "/google-podcasts.svg",
						title: "Google Podcasts",
						position: "2",
						url: "",
						activated: false,
					},
					{
						pictureUrl: "/pocket-casts.svg",
						title: "Pocket Casts",
						position: "3",
						url: "",
						activated: false,
					},
					{
						pictureUrl: "/rss.svg",
						title: "RSS",
						position: "4",
						url: "",
						activated: false,
					},
					{
						pictureUrl: "/overcast.svg",
						title: "Overcast",
						position: "5",
						url: "",
						activated: false,
					},
					{
						pictureUrl: "/podcast-addict.svg",
						title: "Podcast Addict",
						position: "6",
						url: "",
						activated: false,
					},
					{
						pictureUrl: "/radiopublic.svg",
						title: "Radio Public",
						position: "7",
						url: "",
						activated: false,
					},
					{
						pictureUrl: "/podchaser.svg",
						title: "Podchaser",
						position: "8",
						url: "",
						activated: false,
					},
					{
						pictureUrl: "/castbox.svg",
						title: "Castbox",
						position: "9",
						url: "",
						activated: false,
					},
					{
						pictureUrl: "/breaker.svg",
						title: "Breaker",
						position: "10",
						url: "",
						activated: false,
					},
					{
						pictureUrl: "/castro.svg",
						title: "Castro",
						position: "11",
						url: "",
						activated: false,
					},
					{
						pictureUrl: "/stitcher.svg",
						title: "Stitcher",
						position: "12",
						url: "",
						activated: false,
					},
				],
			};
			const ret2 = await firebase.firestore().collection("homepage").doc(newPageName).set(newPage);
			res.status(200).json({ resp: "success" });
		} catch (e) {
			console.error("Error uploading data");
			console.error(e);
			return res.status(404).json({ error: "Error uploading data" });
		}
	}
};

export default handler;
