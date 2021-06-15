import admin from "../firebase/adminApp";

// Returns ids where users have pages
export async function getAllPageIds() {
	try {
		const fileNames = [];
		const allDocs = await admin.firestore().collection("homepage").get();
		await allDocs.forEach((doc) => {
			fileNames.push(doc.id);
		});
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

export async function logRedirect(pageName, linkName = undefined) {
	// page name - id, link name - linkId
	const FieldValue = admin.firestore.FieldValue;
	let log = {
		page: pageName,
		timestamp: FieldValue.serverTimestamp(),
	};
	if (linkName) {
		log.link = linkName;
		log.type = "link";
	} else {
		log.type = "page";
	}

	try {
		const ref = admin.firestore().collection("analytics");
		const res = await ref.add(log);
		return {};
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
}

// Returns page data for users page
export async function getPageData(id) {
	try {
		const page = await admin.firestore().collection("homepage").doc(id).get();
		if (!page.exists) {
			console.error("No such document!");
			throw new Error("No such document!");
		}

		let data = page.data();
		return {
			id,
			...data,
		};
	} catch (error) {
		console.error(error);
		return error;
	}
}
