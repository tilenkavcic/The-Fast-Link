import React, { useCallback, useEffect, useState, createContext } from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";
import Link from "next/link";
import Head from "next/head";
import Header from "../components/Header";
import FullPageLoader from "../components/FullPageLoader";
import getAbsoluteURL from "../utils/getAbsoluteURL";
// import { Form, TextField, SelectField, SubmitButton } from "../components/FormElements";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";

// export const PageContext = createContext();

const Page = () => {
	const AuthUser = useAuthUser();
	const [pageData, setPageData] = useState({});

	const fetchData = useCallback(async () => {
		const token = await AuthUser.getIdToken();
		const endpoint = getAbsoluteURL("/api/getPageData");
		const response = await fetch(endpoint, {
			method: "GET",
			headers: {
				Authorization: token,
				uid: AuthUser.id,
			},
		});
		const data = await response.json();
		if (!response.ok) {
			// eslint-disable-next-line no-console
			console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(data)}`);
			return null;
		}
		return data;
	}, [AuthUser]);

	useEffect(() => {
		const fetchPageData = async () => {
			const data = await fetchData();
			setPageData(data);
		};
		fetchPageData();
	}, [fetchData]);

	console.log("yo", pageData);
	return (
		<>
			<Head></Head>
			<h1>Admin panel</h1>
			<div>
				<Header email={AuthUser.email} signOut={AuthUser.signOut} />
				<div>
					<div>
						<h1>{pageData.title}</h1>
						<h3>{pageData.description}</h3>
						<img src={pageData.pictureUrl} alt={pageData.title} />
					</div>

					{pageData.title ? (
						<Formik
							initialValues={pageData}
							onSubmit={async (values) => {
								
								console.log(values);
								useEffect(() => {
									const fetchPageData = async () => {
										const ret = await uploadData(values);
									};
									fetchPageData();
								}, [uploadData]);
								
							}}
						>
							{({ values }) => (
								<Form>
									<FieldArray name="links">
										{({ insert, remove, push }) => (
											<div>
												{values.links.length > 0 &&
													values.links.map((friend, index) => (
														<div className="row" key={index}>
															<div className="col">
																<label htmlFor={`links.${index}.title`}>Name</label>
																<Field name={`links.${index}.title`} placeholder="Jane Doe" type="text" />
																<ErrorMessage name={`links.${index}.title`} component="div" className="field-error" />
															</div>
															<div className="col">
																<label htmlFor={`links.${index}.url`}>url</label>
																<Field name={`links.${index}.url`} placeholder="www.link.com" type="url" />
																<ErrorMessage name={`links.${index}.title`} component="div" className="field-error" />
															</div>
															<div className="col">
																<label htmlFor={`links.${index}.pictureUrl`}>pictureUrl</label>
																<Field name={`links.${index}.pictureUrl`} placeholder="www.picture.com" type="pictureUrl" />
																{/* <img src={`links.${index}.pictureUrl`} alt={`links.${index}.title`} /> */}
																<ErrorMessage name={`links.${index}.title`} component="div" className="field-error" />
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
							)}
						</Formik>
					) : (
						""
					)}
				</div>
			</div>
		</>
	);
};

export default withAuthUser({
	whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
	LoaderComponent: FullPageLoader,
})(Page);
