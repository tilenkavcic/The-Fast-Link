import React, { useCallback, useEffect, useState } from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";
import Link from "next/link";
import Header from "../../../components/Header";
import FullPageLoader from "../../../components/FullPageLoader";
import getAbsoluteURL from "../../../utils/getAbsoluteURL";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { useRouter } from "next/router";
import { Button, Container, Row, Col } from "react-bootstrap";
import Layout from "../../../components/Layout";
import styles from "./review.module.scss";
import Footer from "../../../components/Footer";

const Page = () => {
	const AuthUser = useAuthUser();
	const router = useRouter();

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

	const getPageIndex = (data) => {
		return data.pages.findIndex((x) => x.title == router.query.pageName);
	};

	useEffect(() => {
		const fetchUserData = async () => {
			const userToken = await AuthUser.getIdToken();
			const query = {
				endpointUrl: "/api/getUserData",
				headers: {
					Authorization: userToken,
					uid: AuthUser.id,
				},
				method: "GET",
			};
			const data = await callApiEndpoint(query);
			redirectToPage(data, getPageIndex(data));
		};
		fetchUserData();
	}, []); 

	const redirectToPage = async (userData, pageIndex) => {
		if (userData.pages[pageIndex].review && userData.pages[pageIndex].review != "") {
			router.push(`/admin/${userData.pages[pageIndex].review}`);
		} else {
			let newPageName = `${router.query.pageName}-review`;
			let newPageObject = userData.pages;
			newPageObject[pageIndex].review = newPageName;
			const newUser = { ...userData, pages: newPageObject };
			let ret = await addNewReview(newUser, newPageName);
			if (ret != null) {
				router.push(`/admin/${newPageName}`);
			}
		}
	};

	const addNewReview = async (data, newPageName) => {
		const userToken = await AuthUser.getIdToken();
		const query = {
			endpointUrl: "/api/addNewReview",
			headers: {
				"Content-Type": "application/json",
				Authorization: userToken,
				uid: AuthUser.id,
				newpagename: newPageName, 
			},
			body: data,
			method: "POST",
		};
		return callApiEndpoint(query);
	};

	return (
		<Layout title="The Fast Link | Admin" description="The Fast Link Admin Page, edit your beautiful, fast podcast links">
			<Header email={AuthUser.email} signOut={AuthUser.signOut} />
			<Container>
				<Row className={styles.row}>
					<Col>
						<h1>Hey</h1>
					</Col>
				</Row>

				<Row className={styles.row}>
					<Col>
						<h2>Your review</h2>
					</Col>
				</Row>

				<>
					Making your review page ...
					<div className={styles.loading}>
						<div className={styles.dot}></div>
						<div className={styles.dot}></div>
						<div className={styles.dot}></div>
						<div className={styles.dot}></div>
						<div className={styles.dot}></div>
					</div>
				</>
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
