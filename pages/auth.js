import React from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import FirebaseAuth from "../components/FirebaseAuth";
import Header from "../components/Header"

const styles = {
	content: {
		padding: `8px 32px`,
	},
	textContainer: {
		display: "flex",
		justifyContent: "center",
		margin: 16,
	},
};

const Auth = () => (
	<>
		<Header auth="true" />
		<div style={styles.content}>
			<h3>Sign in / Register</h3>
			<div style={styles.textContainer}>
				<p>Sign in or register</p>
			</div>
			<div>
				<FirebaseAuth />
			</div>
		</div>
	</>
);

export default withAuthUser({
	whenAuthed: AuthAction.REDIRECT_TO_APP,
	whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
	whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth);
