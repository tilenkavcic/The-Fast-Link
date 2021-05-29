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
	const router = useRouter();
	const [analyticsData, setAnalyticsData] = useState();
	const [pageAnalytics, setPageAnalytics] = useState();
	const [linkAnalytics, setLinkAnalytics] = useState();

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

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			const token = await AuthUser.getIdToken();
			const query = {
				endpointUrl: "/api/getPageAnalytics",
				headers: {
					Authorization: token,
					uid: AuthUser.id,
					page: router.query.pageName,
				},
				method: "GET",
			};
			const data = await callApiEndpoint(query);
			setAnalyticsData(data);
			getPageAnalytics(data);
			getLinkAnalytics(data);
		};
		fetchAnalyticsData();
	}, [callApiEndpoint]);

	const getPageAnalytics = (data) => {
		const ret = data.filter((doc) => doc.type == "page");
		setPageAnalytics(ret);
	};

	const getLinkAnalytics = (data) => {
		let links = [
			{
				name: "apple-podcasts",
				clicks: 0,
			},
			{
				name: "spotify",
				clicks: 0,
			},
			{
				name: "googlepodcasts",
				clicks: 0,
			},
			{
				name: "pocket-casts",
				clicks: 0,
			},
			{
				name: "rss",
				clicks: 0,
			},
			{
				name: "overcast",
				clicks: 0,
			},
			{
				name: "podcast-addict",
				clicks: 0,
			},
			{
				name: "radiopublic",
				clicks: 0,
			},
			{
				name: "podchaser",
				clicks: 0,
			},
			{
				name: "castbox",
				clicks: 0,
			},
			{
				name: "breaker",
				clicks: 0,
			},
			{
				name: "castro",
				clicks: 0,
			},
			{
				name: "stitcher",
				clicks: 0,
			},
		];
		data.forEach((doc) => {
			if (doc.type == "link") {
				const index = links.findIndex((el) => el.name == doc.link);
				links[index].clicks += 1;
			}
		});
		setLinkAnalytics(links);
	};

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

				{analyticsData && pageAnalytics && linkAnalytics ? (
					<Row>
						{linkAnalytics.forEach((link) => (
							<Col>{link.clicks}</Col>
						))}
					</Row>
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
