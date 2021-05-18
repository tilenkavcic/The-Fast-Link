import React, { useCallback, useEffect, useState } from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";
import Link from "next/link";
import Header from "../../components/Header";
import FullPageLoader from "../../components/FullPageLoader";
import { useRouter } from "next/router";
import { Button, Container, Row, Col } from "react-bootstrap";
import Layout from "../../components/Layout";
import styles from "./embed.module.scss";
import Footer from "../../components/Footer";

const Page = () => {
	const AuthUser = useAuthUser();
	const router = useRouter();
	const iframeTag = `<iframe
	width="100%"
	height="1600px"
	src="https://www.thefast.link/[your-podcast-name]"
	frameborder="0" allowfullscreen>
</iframe>`;

	// function popup(mylink, windowname) {
	// 	console.log("asd");
	// 	if (!window.focus) return true;
	// 	var href;
	// 	if (typeof mylink == "string") href = mylink;
	// 	else href = mylink.href;
	// 	window.alert("sometext");
	// 	return false;
	// }
	// useEffect(() => {
	// 	popup("www.tilenkavcic.com", "aswdasdasda");
	// }, []);

	return (
		<Layout title="Admin">
			<Header email={AuthUser.email} signOut={AuthUser.signOut} />
			<Container>
				<Row>
					<Col>
						<h2>Embed to your website</h2>
					</Col>
				</Row>
				<Row>
					<Col>Include the following iframe in your HTML</Col>
				</Row>
				<Row>
					<Col>
						<pre className={styles.htmltxt}>{iframeTag}</pre>
					</Col>
				</Row>
				{/* <Row>
					<Col>
						<h2>Insert a popup to your website</h2>
					</Col>
				</Row>
				<Row>
					<Col>Include the following iframe in your HTML</Col>
				</Row>
				<Row>
					<Col>
						<pre className={styles.htmltxt}>{iframeTag}</pre>
					</Col>
				</Row> */}
			</Container>
			{/* <div className={inStyle.fastPopup}>
				asdasd
				<iframe width="100%" height="400" src="https://fast-link.vercel.app/neki" frameBorder="0" allowFullScreen></iframe>
			</div>
			<div className={inStyle.fastOverlay}></div> */}

			<Footer />
		</Layout>
	);
};

export default withAuthUser({
	whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
	LoaderComponent: FullPageLoader,
})(Page);
