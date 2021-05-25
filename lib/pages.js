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

export async function logRedirect({ id, linkId }) {
	const FieldValue = admin.firestore.FieldValue;
	console.log([id, linkId])

	try {
		const ref = admin.firestore().collection("analytics").doc(id).collection("links").doc(linkId);
		const res = await ref.update({
			clicks: admin.firestore.FieldValue.arrayUnion(FieldValue.serverTimestamp()),
		});
		console.log(res)
		return new Promise.resolve("success");
	} catch (error) {
		console.error(error);
		return new Promise.reject(error);
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

		// Sort links by their positions (from 0)
		data.links.sort((a, b) => (parseInt(a.position) > parseInt(b.position) ? 1 : -1));

		return {
			id,
			...data,
		};
	} catch (error) {
		console.error(error);
		return error;
	}
}
