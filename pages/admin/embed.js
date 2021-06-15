import React, { useRef, useCallback, useEffect, useState } from "react";
import {
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
	AuthAction,
} from "next-firebase-auth";
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
	const pageName = router.query.name;
	const iframeTag = `<iframe
	width="100%"
	height="500px"
	src="https://thefast.link/${pageName}/embed"
	allowtransparency="true"
	frameborder="0" allowfullscreen>
</iframe>`;

	const popupTag = `<style>.fastPopup{z-index:10000;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:100vw;height:100vh;background-color:rgba(0,0,0,.178);display:none;font-family:sans-serif}.fastContentBox{top:50%;left:50%;transform:translate(-50%,-50%);position:relative;width:80vw;height:80vh;padding-top:10vh;background:#292929;border-radius:20px;overflow-y:auto}.fastContentBox h1{font-size:50px;color:#fff;padding-top:10px;font-weight:600}.fastClose{display:inline-block;position:absolute;top:20px;right:20px;width:40px;height:40px;margin:0;transition:background 150ms ease-in;border-radius:10px;border:none;text-decoration:none;background-color:rgba(255,255,255,0);cursor:pointer}.fastCloseText{display:inline-block;border:none;padding:1rem 2rem;margin:0 0 10px 0;text-decoration:none;background:#000;border-radius:10px;color:#fff;font-size:1rem;line-height:1;cursor:pointer;text-align:center;transition:background 150ms ease-in;-webkit-appearance:none;-moz-appearance:none}button:focus,button:hover{stroke:#080808;background:#464646}@media (max-width:767px){.fastContentBox{height:500px;padding-top:0}.fastContentBox h1{font-size:30px}.fastClose{top:15px;right:15px}}</style><script>window.onload = () => {const fastPopup = document.querySelector(".fastPopup");const fastClose = document.querySelector(".fastClose");const fastCloseTxt = document.querySelector(".fastCloseText");setTimeout(() => {fastPopup.style.display = "block";fastClose.addEventListener("click", () => {fastPopup.style.display = "none";});fastCloseTxt.addEventListener("click", () => {fastPopup.style.display = "none";});}, 3000);};</script><div class="fastPopup"><div class="fastContentBox"><button class="fastClose"><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><title>Close popup</title><rect x="3.62402" y="33.8516" width="41.6239" height="4.16239" rx="2.0812" transform="rotate(-45 3.62402 33.8516)" fill="#EBEBEB"/><rect x="6.39917" y="3.32715" width="41.6239" height="4.16239" rx="2.0812" transform="rotate(45 6.39917 3.32715)" fill="#EBEBEB"/></svg></button><h1>Subscribe</h1><iframe width="100%" height="700px" src="https://thefast.link/${pageName}/embed" allowtransparency="true" frameborder="0" allowfullscreen></iframe><button class="fastCloseText">CLOSE</button></div></div>
	`;

	// function selectText(event) {
	// 	popupRef.current.select();
	// 	event.target.select();
	// }

	return (
		<Layout
			title="The Fast Link | Embed"
			description="The Fast Link Admin Page, edit your beautiful, fast podcast links"
		>
			<Header email={AuthUser.email} signOut={AuthUser.signOut} />
			<Container>
				<Row>
					<Col>
						<h2>Embed to your website</h2>
					</Col>
				</Row>
				<Row>
					<Col>Include the following transparent iframe in your HTML</Col>
				</Row>
				<Row>
					<Col>
						<pre className={styles.htmltxt}>{iframeTag}</pre>
						You can increase the height so all the links fit
					</Col>
				</Row>
				<Row>
					<Col>
						<h2>Insert a popup to your website</h2>
					</Col>
				</Row>
				<Row>
					<Col>Include the following somewhere in your HTML</Col>
				</Row>
				<Row>
					<Col>
						<pre className={styles.htmltxtPopup}>{popupTag}</pre>
					</Col>
				</Row>
			</Container>
			{/* <div className={inStyle.fastPopup}>
				asdasd
				<iframe width="100%" height="400" src="https://fast-link.vercel.app/neki" frameBorder="0" allowFullScreen></iframe>
			</div>
			<div className={inStyle.fastOverlay}></div> */}
			{/* <iframe
	width="100%"
	height="500px"
	src="http://localhost:3000/podkast/embed"
	allowtransparency="true"
	frameborder="0" allowfullscreen>
</iframe> */}
			<Footer />
		</Layout>
	);
};

export default withAuthUser({
	whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
	LoaderComponent: FullPageLoader,
})(Page);
