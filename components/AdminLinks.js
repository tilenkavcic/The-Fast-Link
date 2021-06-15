import React, { useCallback, useEffect, useState, useContext } from "react";
import {
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
	AuthAction,
} from "next-firebase-auth";
import getAbsoluteURL from "../utils/getAbsoluteURL";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { PageContext } from "../context/PageContext";
import { Alert, Button, Row, Col, Table, Navbar } from "react-bootstrap";
import styles from "./adminLinks.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const AdminLinks = () => {
	const AuthUser = useAuthUser();
	const [pageData, setPageData] = useContext(PageContext);
	const [submitAlert, setSubmitalert] = useState(false);
	const isRequired = (message) => (value) => (!!value ? undefined : message);
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
				console.error(
					`Data fetching failed with status ${
						response.status
					}: ${JSON.stringify(data)}`
				);
				return null;
			}
			return data;
		},
		[AuthUser]
	);

	const getPageIndex = (data) => {
		return data.pages.findIndex((x) => x.title == pageData.name);
	};

	const redirectToReviewPage = async (userData, pageIndex) => {
		if (
			userData.pages[pageIndex].review &&
			userData.pages[pageIndex].review != ""
		) {
			router.push(`/admin/${userData.pages[pageIndex].review}`);
		} else {
			let newPageName = `${pageData.name}-review`;
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

	const reviewRedirect = () => {
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
			redirectToReviewPage(data, getPageIndex(data));
		};
		fetchUserData();
	};

	const uploadData = useCallback(
		async (data) => {
			const token = await AuthUser.getIdToken();
			const endpoint = getAbsoluteURL("/api/uploadPageData");
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
					uid: AuthUser.id,
					page: pageData.name,
				},
				body: JSON.stringify(data),
			});
			const respData = await response.json();
			if (!response.ok) {
				console.error(
					`Data fetching failed with status ${
						response.status
					}: ${JSON.stringify(respData)}`
				);
				return null;
			}
			return respData;
		},
		[AuthUser]
	);

	async function submitForm(values) {
		const ret = await uploadData(values); // add authUser.id for adding new links
		setPageData(values);
		setSubmitalert(true);
		setTimeout(() => {
			setSubmitalert(false);
		}, 3000);
	}

	return (
		<Formik initialValues={pageData} onSubmit={submitForm}>
			{({ values }) => (
				<>
					<Form>
						<Row class="form-group" className={styles.formTitle}>
							<Col sm={4}>
								<Row>
									<label htmlFor="title">Title of the page</label>
								</Row>
							</Col>

							<Col sm={8}>
								<Field
									class="form-control"
									name="title"
									placeholder="The page title"
								/>
							</Col>
						</Row>
						<Row class="form-group" className={styles.formTitle}>
							<Col sm={4}>
								<Row>
									<label htmlFor="description">Short description</label>
								</Row>
								<Row>
									<small>Try to keep it under 100 characters</small>
								</Row>
							</Col>
							<Col sm={8}>
								<Field
									class="form-control"
									name="description"
									placeholder="This is a description"
									type="text"
									rows="4"
									component="textarea"
								/>
							</Col>
						</Row>
						{/* <PictureUpload />
						<Thumb file={values.file} />
						{pageData.pictureUrl ? <img src={pageData.pictureUrl} alt={pageData.title} /> : ""} */}
						<Row>
							<Col>
								To achieve our fast load times your changes may take up to 60s to take effect. 
								<h6>
									Your link&nbsp;
									<Link href={"/" + pageData.name}>
										<a target="_blank">
											{"https://thefast.link/" + pageData.name}
										</a>
									</Link>
								</h6>
							</Col>
						</Row>

						<Row className={styles.row}>
							<Col>
								<Link
									href={
										"/admin/embed?name=" + encodeURIComponent(pageData.name)
									}
								>
									<Button className={styles.embedBtn} block>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g clip-path="url(#clip0)">
												<path
													d="M7.29708 4.16836L1.2995 6.36674L1.73061 12.74"
													stroke="#292929"
													stroke-width="3"
													stroke-linejoin="round"
												/>
												<path
													d="M15.5464 19.8558L21.544 17.6574L21.1129 11.2842"
													stroke="#292929"
													stroke-width="3"
													stroke-linejoin="round"
												/>
												<path
													d="M18.1015 1.64722L4.74195 22.2191"
													stroke="#292929"
													stroke-width="3"
													stroke-linecap="square"
													stroke-linejoin="round"
												/>
											</g>
											<defs>
												<clipPath id="clip0">
													<rect width="24" height="24" fill="white" />
												</clipPath>
											</defs>
										</svg>{" "}
										Embed the link
									</Button>
								</Link>
							</Col>
						</Row>

						<Row className={styles.row}>
							<Col>
								<Link href={"/admin/" + pageData.name + "/analytics"}>
									<Button block>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g clip-path="url(#clip0)">
												<path
													d="M0.8125 22H22.1875"
													stroke="#292929"
													stroke-width="3"
													stroke-linejoin="round"
												/>
												<path
													d="M0.8125 16.375L5.3125 9.62501L12.0625 11.875L17.6875 4.00001L22.1875 7.37501"
													stroke="#292929"
													stroke-width="3"
													stroke-linejoin="round"
												/>
											</g>
											<defs>
												<clipPath id="clip0">
													<rect width="24" height="24" fill="white" />
												</clipPath>
											</defs>
										</svg>{" "}
										Analytics
									</Button>
								</Link>
							</Col>
						</Row>
						{pageData.type == "podcast" ? (
							<>
								<Row className={styles.row}>
									<Col>
										<Button onClick={reviewRedirect} block>
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<g clip-path="url(#clip0)">
										<path d="M12 1.76891L15.5588 6.96166C15.8189 7.34112 16.2018 7.61933 16.6431 7.74941L22.6814 9.5294L18.8425 14.5187C18.562 14.8833 18.4157 15.3334 18.4284 15.7933L18.6015 22.0861L12.6701 19.9769C12.2367 19.8228 11.7633 19.8228 11.3299 19.9769L5.39853 22.0861L5.5716 15.7933C5.58425 15.3334 5.43799 14.8833 5.15746 14.5187L1.3186 9.5294L7.35694 7.74941C7.79819 7.61933 8.18111 7.34112 8.44118 6.96166L12 1.76891Z" stroke="#292929" stroke-width="3"/>
										</g>
										<defs>
										<clipPath id="clip0">
										<rect width="24" height="24" fill="white"/>
										</clipPath>
										</defs>
										</svg>
										{" "}
											Review
										</Button>
									</Col>
									<Col>
										<Link href={"/admin/" + pageData.name + "/episodes"}>
											<Button block>
												<svg
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M10.7834 19.3021C9.32239 20.7631 7.1937 23.9914 3.47838 20.2761C-0.236948 16.5607 2.99137 14.432 4.93938 12.484L8.34839 9.56203C10.7834 7.61402 12.7314 7.61402 15.1664 10.049"
														stroke="#292929"
														stroke-width="3"
														stroke-linejoin="round"
													/>
													<path
														d="M13.2184 4.46794C14.6794 3.00693 16.8081 -0.221391 20.5234 3.49394C24.2387 7.20926 21.0104 9.33795 19.0624 11.286L15.6534 14.208C13.2184 16.156 11.2704 16.156 8.83537 13.721"
														stroke="#292929"
														stroke-width="3"
														stroke-linejoin="round"
													/>
												</svg>{" "}
												Episodes
											</Button>
										</Link>
									</Col>
								</Row>
							</>
						) : (
							""
						)}
						<Row>
							<Col>
								<h3>Links</h3>
							</Col>
						</Row>
						<FieldArray name="links">
							{({ insert, remove, push, move }) => (
								<>
									{values.links.length > 0 &&
										values.links.map((linkData, index) => (
											<React.Fragment key={index}>
												<Row>
													<Col className={styles.serviceContainer} 
													xs={{ order: 0, span: 9 }}
													md={{ order: 0, span: 3 }}>
														{linkData.pictureUrl ? (
															<Image
																className={styles.serviceImage}
																width={30}
																height={30}
																src={linkData.pictureUrl}
																alt={`links.${index}.title`}
															/>
														) : (
															""
														)}
														<h6 className={styles.serviceTitle}>
															{linkData.title}
														</h6>
													</Col>
													<Col 
													xs={{ order: 2, span: 12 }}
													md={{ order: 1, span: 8 }} className={styles.inputUrl}>
														{/* <label htmlFor={`links.${index}.url`}>Link URL</label> */}
														<Field
															className="form-control"
															name={`links.${index}.url`}
															placeholder="https://myPodcast.com"
															type="url"
														/>
														<ErrorMessage
															name={`links.${index}.url`}
															component="div"
															className="field-error"
														/>
													</Col>
													<Col
														xs={{ order: 1, span: 2 }}
														md={{ order: 2, span: 1 }}
														className={styles.switchCol}
													>
														<label className={styles.switch}>
															<Field
																type="checkbox"
																name={`links.${index}.activated`}
															/>
															<span className={styles.slider}></span>
															<ErrorMessage
																name={`links.${index}.activated`}
																component="div"
																className="field-error"
															/>
														</label>
													</Col>
												</Row>
												<hr className={styles.hr} />
											</React.Fragment>
										))}
								</>
							)}
						</FieldArray>
						<Navbar sticky="top" className={styles.submitBtn}>
							<Button type="submit" block>
								{submitAlert ? (
									<Alert variant="primary">Successful! Please allow up to 60s for the page to update</Alert>
								) : (
									""
								)}
								Save
							</Button>
						</Navbar>
					</Form>
				</>
			)}
		</Formik>
	);
};

export default AdminLinks;
