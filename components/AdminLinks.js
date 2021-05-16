import React, { useCallback, useEffect, useState, useContext } from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";
import getAbsoluteURL from "../utils/getAbsoluteURL";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { PageContext } from "../context/PageContext";
import { Button, Row, Col, Table } from "react-bootstrap";
import styles from "./adminLinks.module.scss";

const AdminLinks = () => {
	const AuthUser = useAuthUser();
	const [pageData, setPageData] = useContext(PageContext);
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
				console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(respData)}`);
				return null;
			}
			return respData;
		},
		[AuthUser]
	);

	const isRequired = (message) => (value) => (!!value ? undefined : message);

	async function submitForm(values) {
		console.log("submiting:", values);
		const ret = await uploadData(values); // add authUser.id for adding new links
		setPageData(values);
		console.log("uploaded", pageData);
	}

	return (
		<Formik initialValues={pageData} onSubmit={submitForm}>
			{({ values }) => (
				<>
					<Form>
						<Row class="form-group" className={styles.formTitle}>
							<Col>
								<label htmlFor="title">Title</label>
							</Col>
							<Col>
								<Field class="form-control" name="title" placeholder="The page title" />
							</Col>
						</Row>
						<Row class="form-group" className={styles.formTitle}>
							<Col>
								<label htmlFor="description">Description</label>
							</Col>
							<Col>
								<Field class="form-control" name="description" placeholder="This is a description" type="text" />
							</Col>
						</Row>
						{/* <PictureUpload />
						<Thumb file={values.file} />
						{pageData.pictureUrl ? <img src={pageData.pictureUrl} alt={pageData.title} /> : ""} */}
						<Row>
							<Col>
								<h3>Links</h3>
							</Col>
						</Row>
						<Row>
							<Table className={styles.table}>
								<thead>
									<tr>
										<th>Picture</th>
										<th>Title</th>
										<th>Link</th>
										<th>Active</th>
									</tr>
								</thead>
								<tbody>
									<FieldArray name="links">
										{({ insert, remove, push, move }) => (
											<>
												{values.links.length > 0 &&
													values.links.map((linkData, index) => (
														<tr key={index}>
															<td>{linkData.pictureUrl ? <img width="50px" src={linkData.pictureUrl} alt={`links.${index}.title`} /> : ""}</td>
															<td>
																<h6>{linkData.title}</h6>
															</td>
															<td>
																{/* <label htmlFor={`links.${index}.url`}>Link URL</label> */}
																<Field className="form-control" name={`links.${index}.url`} placeholder="https://myPodcast.com" type="url" />
																<ErrorMessage name={`links.${index}.url`} component="div" className="field-error" />
															</td>
															<td>
																<label className={styles.switch}>
																	<Field type="checkbox" name={`links.${index}.activated`} />
																	<span className={styles.slider}></span>
																	<ErrorMessage name={`links.${index}.activated`} component="div" className="field-error" />
																</label>
															</td>
														</tr>
													))}
												{/* <button type="button" className="secondary" onClick={() => push({ title: "", url: "", pictureUrl: "" })}>
										Add Link
									</button> */}
											</>
										)}
									</FieldArray>
								</tbody>
							</Table>
						</Row>
						<Button type="submit">Save</Button>
					</Form>
				</>
			)}
		</Formik>
	);
};

export default AdminLinks;
