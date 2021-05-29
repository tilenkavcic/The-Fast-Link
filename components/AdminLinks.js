import React, { useCallback, useEffect, useState, useContext } from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";
import getAbsoluteURL from "../utils/getAbsoluteURL";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { PageContext } from "../context/PageContext";
import { Alert, Button, Row, Col, Table, Navbar } from "react-bootstrap";
import styles from "./adminLinks.module.scss";
import Image from "next/image";
import Link from "next/link";

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

	const [submitAlert, setSubmitalert] = useState(false);
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
								<Field class="form-control" name="title" placeholder="The page title" />
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
								<Field class="form-control" name="description" placeholder="This is a description" type="text" component="textarea" />
							</Col>
						</Row>
						{/* <PictureUpload />
						<Thumb file={values.file} />
						{pageData.pictureUrl ? <img src={pageData.pictureUrl} alt={pageData.title} /> : ""} */}
						<Row>
							<Col>
								<h6>
									Your link&nbsp;
									<Link href={"/" + encodeURIComponent(pageData.name)}>
										<a target="_blank">{"https://thefast.link/" + pageData.name}</a>
									</Link>
								</h6>
							</Col>
						</Row>

						<Row className={styles.row}>
							<Col>
								<Link href={"/admin/embed?name=" + encodeURIComponent(pageData.name)}>
									<Button className={styles.embedBtn} block>
										Embed to your website
									</Button>
								</Link>
							</Col>
						</Row>

						<Row className={styles.row}>
							<Col>
								<Link href={"/admin/" + pageData.name + "/analytics"}>
									<Button block>Analytics</Button>
								</Link>
							</Col>
						</Row>
						{pageData.type == "podcast" ? (
							<>
								<Row className={styles.row}>
									<Col>
										<Link href={"/admin/" + pageData.name + "/review"}>
											<Button block>Review</Button>
										</Link>
									</Col>
									<Col>
										<Link href={"/admin/" + pageData.name + "/episodes"}>
											<Button block>Episodes</Button>
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
						<Row>
							<Table className={styles.table} borderless>
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
															<td>{linkData.pictureUrl ? <Image width={50} height={50} src={linkData.pictureUrl} alt={`links.${index}.title`} /> : ""}</td>
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
						<Navbar sticky="top" className={styles.submitBtn}>
							<Button type="submit" block>
								{submitAlert ? <Alert variant="primary">Successfully submitted</Alert> : ""}
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
