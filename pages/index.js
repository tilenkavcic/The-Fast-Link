import React from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth";
import Header from "../components/Header";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./index.module.scss";
import Head from "next/head";
import Layout from "../components/Layout";
// import "./index.module.scss"

const Home = () => {
	const AuthUser = useAuthUser();
	return (
		<>
			<Layout title="The Fast Link">
			<div className={styles.blob}>
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 350">
					<path d="M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111  c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z" />
				</svg>
			</div>
				<Header email={AuthUser.email} signOut={AuthUser.signOut} />
				<Container>
					<Row>
						<Col>
							<h1 className={styles.heroTitle}>Optimised to convert</h1>
						</Col>
					</Row>
					<Row>
						<Col className={styles.cont}>
							<h2 className={styles.heroSubtitle}>Blazing <i>Fast</i></h2>
						</Col>
						<Col>
							<div className={styles.iphone}>
								<i />
								<video width="100%" playsInline autoPlay muted loop className={styles.videoMock}>
									<source src="/present1.mp4" type="video/mp4" />
								</video>
							</div>
						</Col>
					</Row>
				</Container>
			</Layout>
		</>
	);
};

export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(Home);
