import React, { useCallback, useEffect, useState, useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";
import getAbsoluteURL from "../utils/getAbsoluteURL";
import { PageContext } from "../context/PageContext";
import { Button, Row, Col, Table } from "react-bootstrap";
import styles from "./adminPageTitle.module.scss";

export default function AdminPageTitle() {
	const AuthUser = useAuthUser();

	const [pageData, setPageData] = useContext(PageContext);

	const uploadData = useCallback(
		async (data) => {
			const token = await AuthUser.getIdToken();
			const endpoint = getAbsoluteURL("/api/editPageHeading");

			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					Authorization: token,
					uid: AuthUser.id,
					page: data.name,
					submittedtile: data.title,
					submiteddescription: data.description,
				},
				body: data,
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

	async function submitForm(values) {
		const ret = await uploadData(values);
		setPageData((data) => ({
			...data,
			title: values.title,
			description: values.description,
		}));
		window.location.reload();
	}

	const formData = {
		title: pageData.title,
		description: pageData.description,
		name: pageData.name,
	};

	return (
		<>
			{formData.name ? (
				<Formik initialValues={formData} onSubmit={submitForm}>
					{({ values, setFieldValue }) => (
						<Form>
							<Row className={styles.form}>
								<Col sm={4}>
									<Row>
										<label className={styles.label} htmlFor="title">
											Podcast title
										</label>
									</Row>
								</Col>
								<Col sm={8}>
									<Field class="form-control" name="title" placeholder="The page title" />
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
									<Field class="form-control" name="description" placeholder="This is a description" type="text" component="textarea" />
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
										Save
									</Button>
								</Col>
							</Row>
						</Form>
					)}
				</Formik>
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
