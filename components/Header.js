import React from "react";
import Link from "next/link";
import { Button } from "react-bootstrap";

const styles = {
	container: {
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "center",
		padding: 16,
	},
};

const Header = ({ email, signOut }) => (
	<div style={styles.container}>
		{email ? (
			<>
				<p>Signed in as {email}</p>
				<Button
          variant="primary"
					type="button"
					onClick={() => {
						signOut();
					}}
				>
					Sign out
				</Button>
			</>
		) : (
			<>
				<p>You are not signed in.</p>
				<Link href="/auth">
					<a>
						<Button variant="primary" type="button">
							Sign in
						</Button>
					</a>
				</Link>
			</>
		)}
	</div>
);

export default Header;
