import React from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth";
import Header from "../components/Header";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./index.module.scss";
import Head from "next/head";
import Layout from "../components/Layout";
// import "./index.module.scss"

const Demo = () => {
	const AuthUser = useAuthUser();
	return (
<>
			<Layout title="The Fast Link">
				<Header email={AuthUser.email} signOut={AuthUser.signOut} />
				<Container>
					<Row>
						<Col>
							<h1 className={styles.heroTitle}>Optimised to convert</h1>
						</Col>
					</Row>
					<Row>
						<Col>
							<h2 className={styles.heroSubtitle}>4x faster</h2>
						</Col>
						<Col><div className={styles.iphone}>
									<i/>
									<video width="100%" playsInline autoPlay muted loop className={styles.videoMock}>
										<source src="/present1.mp4" type="video/mp4" />
									</video>
								</div></Col>
					</Row>
				</Container>
			</Layout>
</>
	);
};

export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(Demo);
