import React, { useCallback, useEffect, useState } from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";
import Link from "next/link";
import Header from "../../../components/Header";
import FullPageLoader from "../../../components/FullPageLoader";
import getAbsoluteURL from "../../../utils/getAbsoluteURL";
import { Router, useRouter } from "next/router";
import { Button, Container, Row, Col } from "react-bootstrap";
import Layout from "../../../components/Layout";
import styles from "./analytics.module.scss";
import Footer from "../../../components/Footer";

const Page = () => {
	const AuthUser = useAuthUser();
	const [analyticsData, setAnalyticsData] = useState({});
	const router = useRouter()

	const callApiEndpoint = useCallback(
		async ({ endpointUrl, headers, body = undefined, method }) => {
			const endpoint = getAbsoluteURL(endpointUrl);
			const response = await fetch(endpoint, {
				method: method,
				headers: headers,
				body: JSON.stringify(body),
			});
			const data = await response.json();
			if (!response.ok) {
				console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(data)}`);
				return null;
			}
			return data;
		},
		[AuthUser]
	);

	const fetchData = useCallback(
		async (endpointUrl) => {
			const endpoint = getAbsoluteURL(endpointUrl);
			const response = await fetch(endpoint, {
				
			});
			const data = await response.json();
			if (!response.ok) {
				console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(data)}`);
				return null;
			}
			return data;
		},
		[AuthUser]
	);

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			const token = await AuthUser.getIdToken();
			console.log(router.query.pageName)
			const query = {
				endpointUrl:"/api/getPageAnalytics",
				headers: {
					Authorization: token,
					uid: AuthUser.id,
					page: router.query.pageName,
				},
				method: "GET",
			}
			const data = await callApiEndpoint(query);
			setAnalytics(data);
		};
		fetchAnalyticsData();
	}, [fetchData]);

	return (
		<Layout title="The Fast Link | Analytics" description="The Fast Link Admin Page, edit your beautiful, fast podcast links">
			<Header email={AuthUser.email} signOut={AuthUser.signOut} />
			<Container>
				<Row className={styles.row}>
					<Col>
						<h1>Hey there</h1>
					</Col>
				</Row>

				<Row className={styles.row}>
					<Col>
						<h2>Your podcasts</h2>
					</Col>
				</Row>

				{analyticsData ? (
					<></>
				) : (
					<div className={styles.loading}>
						<div className={styles.dot}></div>
						<div className={styles.dot}></div>
						<div className={styles.dot}></div>
						<div className={styles.dot}></div>
						<div className={styles.dot}></div>
					</div>
				)}
			</Container>
			<Footer />
		</Layout>
	);
};

export default withAuthUser({
	whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
	LoaderComponent: FullPageLoader,
})(Page);
