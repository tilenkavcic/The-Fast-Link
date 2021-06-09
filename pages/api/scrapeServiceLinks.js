import { useAuthUser, withAuthUser, withAuthUserTokenSSR, verifyIdToken } from "next-firebase-auth";
import initAuth from "../../utils/initAuth";
import firebase from "../../firebase/adminApp";
import "firebase/firestore";
import cheerio from "cheerio";

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
		// Scrape data
		try {
			const links = [
				{
					serviceUrl: "podcasts.apple.com",
					title: "Apple Podcasts",
					url: "",
					name: "apple-podcasts",
				},
				{
					serviceUrl: "podcasts.google.com",
					title: "Google Podcasts",
					url: "",
					name: "googlepodcasts",
				},
				{
					serviceUrl: "anchor.com",
					title: "Anchor",
					url: "",
					name: "anchor",
				},
				{
					serviceUrl: "Spotify.com",
					title: "Spotify",
					url: "",
					name: "spotify",
				},
				{
					serviceUrl: "pocket-casts.com",
					title: "Pocket Casts",
					url: "",
					name: "pocket-casts",
				},
				{
					serviceUrl: "rss.com",
					title: "RSS",
					url: "",
					name: "rss",
				},
				{
					serviceUrl: "overcast.fm",
					title: "Overcast",
					url: "",
					name: "overcast",
				},
				{
					serviceUrl: "podcast-addict.com",
					title: "Podcast Addict",
					url: "",
					name: "podcast-addict",
				},
				{
					serviceUrl: "radiopublic.com",
					title: "RadioPublic",
					url: "",
					name: "radiopublic",
				},
				{
					serviceUrl: "podchaser.com",
					title: "Podchaser",
					url: "",
					name: "podchaser",
				},
				{
					serviceUrl: "castbox.com",
					title: "Castbox",
					url: "",
					name: "castbox",
				},
				{
					serviceUrl: "breaker.audio",
					title: "Breaker",
					url: "",
					name: "breaker",
				},
				{
					serviceUrl: "castro.com",
					title: "Castro",
					url: "",
					name: "castro",
				},
				{
					serviceUrl: "stitcher.com",
					title: "Stitcher",
					url: "",
					name: "stitcher",
				},
			];
			const url = req.body.url;
			const response = await fetch(url);
			const htmlString = await response.text();
			const $ = cheerio.load(htmlString);

			links.forEach((link) => {
				if (link.title == "Anchor") {
					link.url = url;
				}
        else {
          const aImage = $(`img[alt="${link.title} Logo"]`);
          const text = aImage.parent().parent().parent().find("a").attr("href");
          if (text && text.substring(0, 8) === "https://") {
            link.url = text;
          }
        }
			});
			res.status(200).json(links);
		} catch (e) {
			console.error("Error scraping");
			console.error(e);
			res.status(404).json({ error: "Error scraping" });
		}
	}
};

export default handler;
