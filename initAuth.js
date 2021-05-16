import { init } from "next-firebase-auth";

const initAuth = () => {
	init({
		authPageURL: "/auth",
		appPageURL: "/",
		loginAPIEndpoint: "/api/login", // required
		logoutAPIEndpoint: "/api/logout", // required
		// Required in most cases.
		firebaseAdminInitConfig: {
			credential: {
				projectId: "the-fast-link",
				clientEmail: "firebase-adminsdk-he6ij@the-fast-link.iam.gserviceaccount.com",
				// The private key must not be accesssible on the client side.
				privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") : undefined,
			},
			databaseURL: "https://the-fast-link.firebaseio.com",
		},
		firebaseClientInitConfig: {
			apiKey: "AIzaSyBxUTUpvM3WfoBN0qrtVhKFU7FRGE4V02E", // required
			authDomain: "the-fast-link.firebaseapp.com",
			databaseURL: "https://the-fast-link.firebaseio.com",
			projectId: "the-fast-link",
		},
		cookies: {
			name: "The Fast Link", // required
			// Keys are required unless you set `signed` to `false`.
			// The keys cannot be accessible on the client side.
			keys: [process.env.COOKIE_SECRET_CURRENT, process.env.COOKIE_SECRET_PREVIOUS],
			httpOnly: true,
			maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
			overwrite: true,
			path: "/admin",
			sameSite: "strict",
			secure: true, // set this to false in local (non-HTTPS) development
			signed: true,
		},
	});
};

export default initAuth;
