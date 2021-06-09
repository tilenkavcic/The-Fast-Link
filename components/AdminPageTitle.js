import React, { useCallback, useEffect, useState, useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
	AuthAction,
} from "next-firebase-auth";
import getAbsoluteURL from "../utils/getAbsoluteURL";
import { PageContext } from "../context/PageContext";
import { Button, Row, Col, Alert } from "react-bootstrap";
import styles from "./adminPageTitle.module.scss";

export default function AdminPageTitle() {
	const AuthUser = useAuthUser();

	const [pageData, setPageData] = useContext(PageContext);

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

	const uploadData = useCallback(
		async (data) => {
			const token = await AuthUser.getIdToken();
			const endpoint = getAbsoluteURL("/api/editPageHeading");

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

	function combineLinks(ret) {
		let pg = pageData;
		ret.forEach((link, index) => {
			// Will reset everything
			// Do this since if wrong url was given we don't want to merge
			// if (link.url)
			pg.links[index].url = link.url;
		});
		return pg;
	}

	async function submitFormAnchor(values) {
		const userToken = await AuthUser.getIdToken();
		const getScrapedLinks = {
			endpointUrl: "/api/scrapeServiceLinks",
			headers: {
				"Content-Type": "application/json",
				Authorization: userToken,
				uid: AuthUser.id,
			},
			body: values,
			method: "POST",
		};
		const retLinks = await callApiEndpoint(getScrapedLinks);
		const newPage = combineLinks(retLinks);
		const uploadNew = {
			endpointUrl: "/api/uploadPageData",
			headers: {
				"Content-Type": "application/json",
				Authorization: userToken,
				uid: AuthUser.id,
			},
			body: newPage,
			method: "POST",
		};
		let ret = await callApiEndpoint(uploadNew);
		setPageData(newPage);
		setSubmitAlert(true);
	}

	async function submitForm(values) {
		const ret = await uploadData(values);
		setPageData((data) => ({
			...data,
			title: values.title,
			description: values.description,
		}));
		window.location.reload();
	}

	const [formData, setFormData] = useState();
	const [anchorFormData, setAnchorFormData] = useState();
	const [submitAlert, setSubmitAlert] = useState(false);

	useEffect(() => {
		if (pageData && pageData.name) {
			setFormData({
				title: pageData.title,
				description: pageData.description,
				name: pageData.name,
			});
			console.log(pageData);
			setAnchorFormData({
				url: pageData.links[2].url,
			});
		}
	}, [pageData]);

	return (
		<>
			{pageData ? (
				<>
					{anchorFormData ? (
						<>
							<h2>Import from Anchor</h2>
							<Formik
								initialValues={anchorFormData}
								onSubmit={submitFormAnchor}
							>
								{({ values }) => (
									<Form>
										<Row className={styles.form}>
											<Col sm={4}>
												<Row>
													<label className={styles.label} htmlFor="url">
														Anchor link
													</label>
												</Row>
												<Row>
													<small>If you have one</small>
												</Row>
											</Col>
											<Col sm={8}>
												<Field
													class="form-control"
													name="url"
													placeholder="Your anchor link"
													type="url"
												/>
											</Col>
										</Row>
										<Row>
											<Col>
												<Button type="submit" block>
													{submitAlert ? (
														<Alert variant="primary">
															Successfully imported
														</Alert>
													) : (
														""
													)}
													Save Anchor
												</Button>
											</Col>
										</Row>
									</Form>
								)}
							</Formik>
							<hr />
						</>
					) : (
						""
					)}
					{formData ? (
						<>
							<h2>Title of your page</h2>
							<Formik initialValues={formData} onSubmit={submitForm}>
								{({ values, setFieldValue }) => (
									<Form>
										<Row className={styles.form}>
											<Col sm={4}>
												<Row>
													<label className={styles.label} htmlFor="title">
														Title of the page
													</label>
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
										<Row className={styles.form}>
											<Col sm={4}>
												<Row>
													<label className={styles.label} htmlFor="description">
														Short description
													</label>
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
										{/* <label htmlFor="file">Picture upload</label>
							<input
								id="file"
								name="file"
								type="file"
								onChange={(event) => {
									setFieldValue("file", event.currentTarget.files[0]);
								}}
								className="form-control"
							/> */}
										{/* {values.pictureUrl ? <img src={values.pictureUrl} alt={values.title} /> : "no picture"} */}
										<Row>
											<Col>
												<Button type="submit" block>
													Submit
												</Button>
											</Col>
										</Row>
									</Form>
								)}
							</Formik>
						</>
					) : (
						""
					)}
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
		</>
	);
}
