import React from "react";
import { withUser, AuthAction } from "next-firebase-auth";
import FirebaseAuth from "../components/FirebaseAuth";
import Header from "../components/Header";
import { Container, Row, Col } from "react-bootstrap";

const styles = {
	content: {
		justifyContent: "center",
	},
	textContainer: {
		textAlign: "center",
	},
};

const Auth = () => (
	<>
		<Header auth="true" />
		<Container>
			<Row style={styles.content}>
				<Col>
					<h1 style={styles.textContainer}>Sign in / Register</h1>
				</Col>
			</Row>
			<Row style={styles.content}>
				<FirebaseAuth />
			</Row>
		</Container>
	</>
);

export default withUser({
	whenAuthed: AuthAction.REDIRECT_TO_APP,
	whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
	whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth);
