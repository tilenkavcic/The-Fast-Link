import React from "react";
import Link from "next/link";
import { Button, Navbar, Nav, NavDropdown } from "react-bootstrap";
import styles from "./header.module.scss";

const Header = ({ email, signOut }) => (
	<Navbar sticky="top" className={styles.navbar}>
		<Navbar.Brand href="/" className={styles.logo}>The Fast Link</Navbar.Brand>
		<Navbar.Toggle aria-controls="basic-navbar-nav" />
		<Navbar.Collapse className="justify-content-end">
			{email ? (
				<>
					<Navbar.Text>Signed in as {email}</Navbar.Text>
					<Button
						variant="primary"
						onClick={() => {
							signOut();
						}}
					>
						Sign out
					</Button>
				</>
			) : (
				<>
					<Link href="/auth">
						<Button variant="primary">Try it out</Button>
					</Link>
				</>
			)}
		</Navbar.Collapse>
	</Navbar>
);

export default Header;
