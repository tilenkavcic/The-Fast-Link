import admin from "firebase-admin";

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			// https://stackoverflow.com/a/41044630/1332513
			privateKey: process.env.FIREBASE_PRIVATE_KEY
				? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
				: undefined,
		}),
		databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
	});
}

export default admin;
