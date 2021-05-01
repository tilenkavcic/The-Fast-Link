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
	console.log("as");

	const isRequired = (message) => (value) => (!!value ? undefined : message);

	async function submitForm(values) {
		console.log("<ss");
		console.log("submiting:", values);
		const ret = await uploadData(values, "username"); // TODO HARDCODED
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

						<FieldArray name="links">
							{({ insert, remove, push, move }) => (
								<div>
									{values.links.length > 0 &&
										values.links.map((linkData, index) => (
											<div className="row" key={index}>
												<div className="col">
													<label htmlFor={`links.${index}.title`}>Name</label>
													<Field name={`links.${index}.title`} placeholder="Link title" type="text" />
													<ErrorMessage name={`links.${index}.title`} component="div" className="field-error" />
												</div>
												<div className="col">
													<label htmlFor={`links.${index}.url`}>Link URL</label>
													<Field name={`links.${index}.url`} validate={isRequired("URL is required")} placeholder="https://myPodcast.com" type="url" />
													<ErrorMessage name={`links.${index}.title`} component="div" className="field-error" />
												</div>
												<div className="col">
													{linkData.pictureUrl ? (
														<>
															<label htmlFor={`links.${index}.pictureUrl`}>pictureUrl</label>
															<Field name={`links.${index}.pictureUrl`} placeholder="www.picture.com" type="url" />
															<img src={linkData.pictureUrl} alt={`links.${index}.title`} />
															<ErrorMessage name={`links.${index}.title`} component="div" className="field-error" />
														</>
													) : (
														""
													)}
												</div>
												<div className="col">
													<button type="button" className="secondary" onClick={() => remove(index)}>
														X
													</button>
												</div>
											</div>
										))}
									<button type="button" className="secondary" onClick={() => push({ title: "", url: "", pictureUrl: "" })}>
										Add Link
									</button>
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
