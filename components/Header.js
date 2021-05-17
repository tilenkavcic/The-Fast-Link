import React from "react";
import Link from "next/link";
import { Button, Navbar, Nav, NavDropdown } from "react-bootstrap";
import styles from "./header.module.scss";

const Header = ({ email, signOut, auth }) => (
	<Navbar sticky="top" className={styles.navbar}>
		<Navbar.Brand href="/" className={styles.logo}>
			The Fast Link
		</Navbar.Brand>
		<Navbar.Toggle aria-controls="basic-navbar-nav" />
		{auth ? (
			""
		) : (
			<Navbar.Collapse className="justify-content-end">
				{email ? (
					<>
						{/* <Navbar.Text className={styles.navbarText}>{email}</Navbar.Text> */}
						<Button
							className={styles.button}
							variant="primary"
							onClick={() => {
								signOut();
							}}
						>
							Sign out
						</Button>
						<Link href="/admin">
							<Button className={styles.buttonAdmin} variant="primary">
								Admin
							</Button>
						</Link>
					</>
				) : (
					<>
						<Link href="/auth">
							<Button variant="primary">Try it out</Button>
						</Link>
					</>
				)}
			</Navbar.Collapse>
		)}
	</Navbar>
);

export default Header;
