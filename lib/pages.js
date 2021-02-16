import admin from "../firebase/adminApp";

// Returns ids where users have pages
export async function getAllPageIds() {
	try {
		const fileNames = [];
		const allDocs = await admin.firestore().collection("homepage").get();
		console.log(allDocs);
		await allDocs.forEach((doc) => {
			fileNames.push(doc.id);
		});
		console.log(fileNames);

		return fileNames.map((fileName) => {
			return {
				params: {
					id: fileName,
				},
			};
		});
	} catch (error) {
    console.error("error all pahe ids")
		console.error(error);
	}
}

// Returns page data for users page
export async function getPageData(id) {
	try {
		const page = await admin.firestore().collection("homepage").doc("username").get();

		if (!page.exists) {
			console.error("No such document!");
			throw new Error("No such document!");
		}

		const data = page.data();
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
