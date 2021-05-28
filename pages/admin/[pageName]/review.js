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

	const fetchData = useCallback(
		async (endpointUrl) => {
			const token = await AuthUser.getIdToken();
			const endpoint = getAbsoluteURL(endpointUrl);
			const response = await fetch(endpoint, {
				method: "GET",
				headers: {
					Authorization: token,
					uid: AuthUser.id,
				},
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

	const uploadData = useCallback(
		async (data) => {
			const token = await AuthUser.getIdToken();
			const endpoint = getAbsoluteURL("/api/addNewPage");
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
					uid: AuthUser.id,
				},
				body: JSON.stringify(data),
			});
			const respData = await response.json();
			if (!response.ok) {
				if (response.status == 403) {
					alert("This podcast name already exists");
				}
				console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(respData)}`);
				return null;
			}
			return respData;
		},
		[AuthUser]
	);

	const [userData, setUserData] = useState({});

	useEffect(() => {
		const fetchUserData = async () => {
			const data = await fetchData("/api/getUserData");
			setUserData(data);
		};
		fetchUserData();
	}, [fetchData]);

	const uploadUserData = useCallback(
		async (data) => {
			const token = await AuthUser.getIdToken();
			const endpoint = getAbsoluteURL("/api/uploadUserData");
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
					uid: AuthUser.id,
				},
				body: JSON.stringify(data),
			});
			const respData = await response.json();
			if (!response.ok) {
				console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(respData)}`);
				return null;
			}
			return respData;
		},
		[AuthUser]
	);

	const removePageCall = useCallback(
		async (data) => {
			const token = await AuthUser.getIdToken();
			const endpoint = getAbsoluteURL("/api/removePage");
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
					uid: AuthUser.id,
				},
				body: JSON.stringify(data),
			});
			const respData = await response.json();
			if (!response.ok) {
				console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(respData)}`);
				return null;
			}
			return respData;
		},
		[AuthUser]
	);

	async function removePage(vals, name) {
		uploadUserData(vals);
		return await removePageCall(name);
	}
	const [submitType, setSubmitType] = useState("");

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
							initialValues={userData}
							onSubmit={async (pageName) => {
								let newPageStr = pageName.newPage;
								newPageStr = newPageStr.replaceAll(" ", "-").replaceAll(";", "").replaceAll(",", "").replaceAll("/", "").replaceAll("?", "").replaceAll(":", "").replaceAll("@", "").replaceAll("&", "").replaceAll("=", "").replaceAll("+", "").replaceAll("$", "").toLowerCase();
								newPageStr = encodeURIComponent(newPageStr);
								const newArr = userData.pages.concat([{ title: newPageStr }]);
								const newUser = { ...userData, pages: newArr };
								let ret = await uploadData(newUser);
								if (ret != null) {
									router.push(`/admin/${pageName.pages.length}`);
								}
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
																		pathname: "/admin/[pageIndx]",
																		query: { pageIndx: index },
																	}}
																>
																	<Button block>{pageData.title}</Button>
																</Link>
															</Col>
															<Col sm={2}>
																<Button
																	className="secondary"
																	onClick={() => {
																		let name = values.pages[index];
																		values.pages.splice(index, 1);
																		removePage(values, name).then(() => {
																			remove(index);
																		});
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
											<Field className="form-control" id=" " name="newPage" placeholder="your-podcat" />
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
