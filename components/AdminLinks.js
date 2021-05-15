import React, { useCallback, useEffect, useState, useContext } from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";
import Link from "next/link";
import getAbsoluteURL from "../utils/getAbsoluteURL";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import Thumb from "../components/Thumb";
import PictureUpload from "../components/PictureUpload";
import { PageContext } from "../context/PageContext";

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
						<label htmlFor="title">Title</label>
						<Field name="title" placeholder="The page title" />
						<label htmlFor="description">Description</label>
						<Field name="description" placeholder="This is a description" type="text" />
						{/* <PictureUpload /> */}
						{/* <Thumb file={values.file} /> */}
						{pageData.pictureUrl ? <img src={pageData.pictureUrl} alt={pageData.title} /> : ""}
						<h3>Links</h3>
						<FieldArray name="links">
							{({ insert, remove, push, move }) => (
								<div>
									{values.links.length > 0 &&
										values.links.map((linkData, index) => (
											<div className="row" key={index}>
												<div className="col">{linkData.pictureUrl ? <img width="50px" src={linkData.pictureUrl} alt={`links.${index}.title`} /> : ""}</div>
												<div className="col">
													<h6>{linkData.title}</h6>
												</div>
												<div className="col">
													<label htmlFor={`links.${index}.url`}>Link URL</label>
													<Field name={`links.${index}.url`} placeholder="https://myPodcast.com" type="url" />
													<ErrorMessage name={`links.${index}.url`} component="div" className="field-error" />
												</div>
												<div className="col">
													<label>
														<Field type="checkbox" name={`links.${index}.activated`} />
														activated
														<ErrorMessage name={`links.${index}.activated`} component="div" className="field-error" />
													</label>
												</div>
											</div>
										))}
									{/* <button type="button" className="secondary" onClick={() => push({ title: "", url: "", pictureUrl: "" })}>
										Add Link
									</button> */}
								</div>
							)}
						</FieldArray>
						<button type="submit">Save</button>
					</Form>
				</>
			)}
		</Formik>
	);
};

export default AdminLinks;
