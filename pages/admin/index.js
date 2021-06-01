import React, { useCallback, useEffect, useState } from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import Link from "next/link";
import Header from "../../components/Header";
import FullPageLoader from "../../components/FullPageLoader";
import getAbsoluteURL from "../../utils/getAbsoluteURL";
import { Formik, Field, Form, FieldArray } from "formik";
import { useRouter } from "next/router";
import { Button, Container, Row, Col, Alert } from "react-bootstrap";
import Layout from "../../components/Layout";
import styles from "./index.module.scss";
import Footer from "../../components/Footer";

const Page = () => {
	const AuthUser = useAuthUser();
	const router = useRouter();
	const [error, setError] = useState()
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
				throw data;
			}
			return data;
		},
		[AuthUser]
	);

	const addNewPage = async (data) => {
		const userToken = await AuthUser.getIdToken();
		const query = {
			endpointUrl: "/api/addNewPage",
			headers: {
				"Content-Type": "application/json",
				Authorization: userToken,
				uid: AuthUser.id,
			},
			body: data,
			method: "POST",
		};
		return callApiEndpoint(query);
		// .then((res) => {
		// 	return res;
		// })
		// .catch((e) => {
		// 	console.log(e);
		// });
	};

	const [userData, setUserData] = useState({});

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
			setUserData(data);
		};
		fetchUserData();
	}, []); // should maybe be called on remove

	const removePage = async (vals, name, index) => {
		try {
			const userToken = await AuthUser.getIdToken();

			// const query0 = {
			// 	endpointUrl: "/api/removePageAnalytics",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 		Authorization: userToken,
			// 		uid: AuthUser.id,
			// 	},
			// 	body: { title: ep.title },
			// 	method: "DELETE",
			// };
			// callApiEndpoint(query0);

			let removingObj = vals.pages[index];
			if (removingObj.episodes) {
				removingObj.episodes.forEach((ep) => {
					const query1 = {
						endpointUrl: "/api/removePage",
						headers: {
							"Content-Type": "application/json",
							Authorization: userToken,
							uid: AuthUser.id,
						},
						body: { title: ep.title },
						method: "DELETE",
					};
					callApiEndpoint(query1);
				});
			}
			if (removingObj.review) {
				const query2 = {
					endpointUrl: "/api/removePage",
					headers: {
						"Content-Type": "application/json",
						Authorization: userToken,
						uid: AuthUser.id,
					},
					body: { title: removingObj.review },
					method: "DELETE",
				};
				callApiEndpoint(query2);
			}
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
			vals.pages.splice(index, 1);
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
			callApiEndpoint(queryRemovePage);
			await callApiEndpoint(queryUploadUserData);
			return Promise.resolve();
		} catch (e) {
			console.error(e);
		}
	};
	const adjustPageName = (newPageStr) => {
		newPageStr = newPageStr.replaceAll(";", "").replaceAll(",", "").replaceAll("/", "").replaceAll("?", "").replaceAll(":", "").replaceAll("@", "").replaceAll("&", "").replaceAll("=", "").replaceAll("+", "").replaceAll("$", "");
		newPageStr = newPageStr.replaceAll("-", " ");
		newPageStr = newPageStr.replaceAll(" ", "-");
		newPageStr = encodeURIComponent(newPageStr);
		let ret = newPageStr.split("-");
		newPageStr.split("-").forEach((w, index) => {
			if (index != 0) {
				let word = w.charAt(0).toUpperCase() + w.slice(1);
				console.log(word);
				ret[index] = word;
			}
		});
		return ret.join("");
	};

	return (
		<Layout title="The Fast Link | Admin" description="The Fast Link Admin Page, edit your beautiful, fast podcast links">
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

				{userData.pages ? (
					<>
						<Formik
							enableReinitialize
							initialValues={userData}
							onSubmit={(pageName) => {
								let newPageStr = adjustPageName(pageName.newPage);
								const newArr = userData.pages.concat([{ title: newPageStr }]);
								const newUser = { ...userData, pages: newArr };
								addNewPage(newUser)
									.then((res) => {
										router.push(`/admin/${newPageStr}`);
									})
									.catch((e) => {
										setError("This name already exists");
										setTimeout(() => {
											setError("");
										}, 3000);
									});
							}}
						>
							{({ values }) => (
								<Form>
									<FieldArray name="pages">
										{({ insert, remove, push, move }) => (
											<>
												{values.pages.length > 0 &&
													values.pages.map((pageData, index) => (
														<Row className={styles.row} key={index}>
															<Col sm={10}>
																<Link
																	className="pageBtn"
																	href={{
																		pathname: "/admin/[pageName]",
																		query: { pageName: pageData.title },
																	}}
																>
																	<Button block>{pageData.title}</Button>
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
											<Field className="form-control" id=" " name="newPage" placeholder="yourPodcast" />
										</Col>
										<Col sm={2}>
											<Button type="submit" className={styles.newBtn} block>
												New
											</Button>
										</Col>
									</Row>
									{error ? (
										<Row>
											<Col>
												<Alert variant="danger">{error}</Alert>
											</Col>
										</Row>
									) : (
										""
									)}
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
