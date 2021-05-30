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
import AnalyticsPageCount from "../../../components/AnalyticsPageCount";
import AnalyticsLinkCount from "../../../components/AnalyticsLinkCount";

const Page = () => {
	const AuthUser = useAuthUser();
	const router = useRouter();
	const [analyticsData, setAnalyticsData] = useState();
	const [pageAnalytics, setPageAnalytics] = useState(0);
	const [linkAnalytics, setLinkAnalytics] = useState(0);
	const [clickThroughRate, setClickThroughRate] = useState(0);

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
			getPageLinkAnalytics(data);
		};
		fetchAnalyticsData();
	}, [callApiEndpoint]);

	const getPageLinkAnalytics = (data) => {
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
		const pageAnalyticsData = data.filter((doc) => doc.type == "page");
		setPageAnalytics(pageAnalyticsData.length);

		let numClicks = 0;
		data.forEach((doc) => {
			if (doc.type == "link") {
				numClicks += 1;
				const index = links.findIndex((el) => el.name == doc.link);
				links[index].clicks += 1;
			}
		});
		let rate = (numClicks / pageAnalyticsData.length) * 100;
		setClickThroughRate(rate.toFixed(2));
		setLinkAnalytics(links);
	};

	return (
		<Layout title="The Fast Link | Analytics" description="The Fast Link Admin Page, edit your beautiful, fast podcast links">
			<Header email={AuthUser.email} signOut={AuthUser.signOut} />
			<Container>
				<Row className={styles.row}>
					<Col>
						<h1>30 day analytics</h1>
					</Col>
				</Row>

				<Row className={styles.row}>
					<Col>
						<h2>Overall clicks</h2>
					</Col>
				</Row>

				{analyticsData && pageAnalytics && linkAnalytics ? (
					<>
						<Row>
							<Col>
								<AnalyticsPageCount clicks={pageAnalytics} />
							</Col>
						</Row>
						<Row className={styles.row}>
							<Col>
								<h2>Click through</h2>
							</Col>
						</Row>
						<Row className={styles.row}>
							<Col>
								Click through rate <b>{clickThroughRate}%</b>
							</Col>
						</Row>

						<Row className={styles.row}>
							{linkAnalytics.forEach((link) => {
								<Col>
									<h3>{link.name}</h3>
									<AnalyticsLinkCount clicks={link.clicks} />
								</Col>;
							})}
						</Row>
					</>
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
