import admin from "../firebase/adminApp";

// Returns ids where users have pages
export async function getAllPageIds() {
	try {
		const fileNames = [];
		const allDocs = await admin.firestore().collection("homepage").get();
		await allDocs.forEach((doc) => {
			fileNames.push(doc.id);
		})
		return fileNames.map((fileName) => {
			return {
				params: {
					id: fileName,
				},
			};
		});
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

// Returns page data for users page
export async function getPageData(id) {
	try {
		// TODO hardkoded
		const page = await admin.firestore().collection("homepage").doc("neki").get();
		if (!page.exists) {
			console.error("No such document!");
			throw new Error("No such document!");
		}

		let data = page.data();
		console.log(data)

		// Sort links by their positions (from 0)
		data.links.sort((a, b) => (a.position > b.position ? 1 : -1));

		return {
			id,
			...data,
		};
	} catch (error) {
		console.error(error);
		return error;
	}
}
