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
	const sentData = req.body;
	const newPageName = sentData.pages[sentData.pages.length - 1].title;
	if (token != "unauthenticated") {
		// verify login
		try {
			const authUser = await verifyIdToken(token);
			if (authUser.id != uid) {
				throw "Page outside of user scope";
			}
		} catch (e) {
			console.error(e);
			return res.status(403).json({ error: "Not authorized" });
		}
		// Upload data to firestore
		try {
			// check if doc exists
			const ret0 = await firebase.firestore().collection("homepage").doc(newPageName);
			ret0.get()
				.then(async (doc) => {
					if (doc.exists) {
						return res.status(403).json({ error: "Document exists" });
					} else {
						const ret1 = await firebase.firestore().collection("users").doc(uid).set(sentData);
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
									activated: true,
								},
								{
									pictureUrl: "/Spotify.svg",
									title: "Spotify",
									position: "1",
									url: "",
									activated: true,
								},
								{
									pictureUrl: "/google-podcasts.svg",
									title: "Google Podcasts",
									position: "2",
									url: "",
									activated: true,
								},
								{
									pictureUrl: "/pocket-casts.svg",
									title: "Pocket Casts",
									position: "3",
									url: "",
									activated: true,
								},
								{
									pictureUrl: "/rss.svg",
									title: "RSS",
									position: "4",
									url: "",
									activated: true,
								},
								{
									pictureUrl: "/overcast.svg",
									title: "Overcast",
									position: "5",
									url: "",
									activated: true,
								},
								{
									pictureUrl: "/podcast-addict.svg",
									title: "Podcast Addict",
									position: "6",
									url: "",
									activated: true,
								},
								{
									pictureUrl: "/radiopublic.svg",
									title: "RadioPublic",
									position: "7",
									url: "",
									activated: true,
								},
								{
									pictureUrl: "/podchaser.svg",
									title: "Podchaser",
									position: "8",
									url: "",
									activated: true,
								},
								{
									pictureUrl: "/castbox.svg",
									title: "Castbox",
									position: "9",
									url: "",
									activated: true,
								},
								{
									pictureUrl: "/breaker.svg",
									title: "Breaker",
									position: "10",
									url: "",
									activated: true,
								},
								{
									pictureUrl: "/castro.svg",
									title: "Castro",
									position: "11",
									url: "",
									activated: true,
								},
								{
									pictureUrl: "/stitcher.svg",
									title: "Stitcher",
									position: "12",
									url: "",
									activated: true,
								},
							],
						};
						const ret2 = await firebase.firestore().collection("homepage").doc(newPageName).set(newPage);
						res.status(200).json({ resp: "success" });
					}
				})
				.catch((e) => {
					return res.status(404).json({ error: e });
				});
		} catch (e) {
			console.error("Error uploading data");
			console.error(e);
			return res.status(404).json({ error: "Error uploading data" });
		}
	}
};

export default handler;
