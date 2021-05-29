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
import styles from "./episodes.module.scss";
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
	const [userData, setUserData] = useState({});
	const [pageIndex, setPageIndex] = useState();

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
			setPageIndex(getPageIndex(data));
			setUserData(data);
		};
		fetchUserData();
	}, []);

	const getPageIndex = (data) => {
		return data.pages.findIndex((x) => x.title == router.query.pageName);
	};

	function validateNumber(value) {
		let error;
		if (!value) {
			error = "";
		} else {
			if (!isNaN(value) && !isNaN(parseFloat(value))) {
			} else {
				error = "Episode should just be a number";
			}
		}
		return error;
	}

	const addNewPage = async (data, newPageName) => {
		const userToken = await AuthUser.getIdToken();
		const query = {
			endpointUrl: "/api/addNewEpisode",
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

	const removePage = async (vals, name, index) => {
		const userToken = await AuthUser.getIdToken();
		const queryRemovePage = {
			endpointUrl: "/api/removePage",
			headers: {
				"Content-Type": "application/json",
				Authorization: userToken,
				uid: AuthUser.id,
			},
			body: name,
			method: "DELETE",
		};
		vals.pages[pageIndex].episodes.splice(index, 1);
		const queryUploadUserData = {
			endpointUrl: "/api/uploadUserData",
			headers: {
				"Content-Type": "application/json",
				Authorization: userToken,
				uid: AuthUser.id,
			},
			body: vals,
			method: "POST",
		};
		setUserData(vals);
		const res = callApiEndpoint(queryRemovePage);
		await callApiEndpoint(queryUploadUserData);
		return Promise.resolve();
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
						<h2>
							Your <i>{router.query.pageName}</i> episodes
						</h2>
					</Col>
				</Row>

				{userData.pages ? (
					<>
						<Formik
							enableReinitialize
							initialValues={userData}
							onSubmit={async (pageName) => {
								let newPageStr = pageName.newPage;
								newPageStr = encodeURIComponent(newPageStr);
								newPageStr = `${router.query.pageName}-ep-${newPageStr}`;
								let newArr;
								if (userData.pages[pageIndex].episodes) {
									newArr = userData.pages[pageIndex].episodes.concat([{ title: newPageStr }]);
								} else {
									newArr = userData.pages[pageIndex].episodes = [];
									newArr = userData.pages[pageIndex].episodes.concat([{ title: newPageStr }]);
								}
								let newPageArr = userData.pages;
								newPageArr[pageIndex].episodes = newArr;
								const newUser = { ...userData, pages: newPageArr };
								let ret = await addNewPage(newUser, newPageStr);
								if (ret != null) {
									router.push(`/admin/${newPageStr}`);
								}
							}}
						>
							{({ values, errors, touched, isValidating }) => (
								<Form>
									<FieldArray name="episodes">
										{({ insert, remove, push, move }) => (
											<>
												{values.pages[pageIndex].episodes &&
													values.pages[pageIndex].episodes.length > 0 &&
													values.pages[pageIndex].episodes.map((pageData, index) => (
														<Row className={styles.row} key={index}>
															<Col sm={10}>
																<Link
																	className="pageBtn"
																	href={{
																		pathname: "/admin/[pageName]",
																		query: { pageName: pageData.title },
																	}}
																>
																	<Button block>{pageData.title.split("-")[pageData.title.split("-").length - 1]}</Button>
																</Link>
															</Col>
															<Col sm={2}>
																<Button
																	className="secondary"
																	onClick={() => {
																		removePage(values, { title: pageData.title }, index);
																		remove(index);
																	}}
																	block
																>
																	<svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<rect x="0.0605469" y="11" width="15" height="2" rx="0.75" transform="rotate(-45 0.0605469 11)" fill="#292929" />
																		<rect x="1.06055" width="15" height="2" rx="0.75" transform="rotate(45 1.06055 0)" fill="#292929" />
																	</svg>
																</Button>
															</Col>
														</Row>
													))}
											</>
										)}
									</FieldArray>
									<Row className={styles.row}>
										<Col sm={10}>
											<Field className="form-control" name="newPage" validate={validateNumber} placeholder="Episode number" />
											{errors.newPage && touched.newPage && <div>{errors.newPage}</div>}
										</Col>
										<Col sm={2}>
											<Button type="submit" className={styles.newBtn} block>
												New
											</Button>
										</Col>
									</Row>
								</Form>
							)}
						</Formik>
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
