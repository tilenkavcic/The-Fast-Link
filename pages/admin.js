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
			console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(data)}`);
			return null;
		}
		return data;
	}, [AuthUser]);

	const uploadData = useCallback(
		async (data) => {
			const token = await AuthUser.getIdToken();
			const endpoint = getAbsoluteURL("/api/uploadPageData");
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					headers: { "Content-Type": "application/json" },
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
	const isRequired = (message) => (value) => (!!value ? undefined : message);
	useEffect(() => {
		const fetchPageData = async () => {
			const data = await fetchData();
			setPageData(data);
		};
		fetchPageData();
	}, [fetchData]);

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
								console.log("submiting:", values);
								const ret = await uploadData(values);
								console.log("uploaded", ret);
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
																<Field name={`links.${index}.title`} placeholder="Link title" type="text" />
																<ErrorMessage name={`links.${index}.title`} component="div" className="field-error" />
															</div>
															<div className="col">
																<label htmlFor={`links.${index}.url`}>Link URL</label>
																<Field name={`links.${index}.url`} validate={isRequired("URL is required")} placeholder="https://myPodcast.com" type="url" />
																<ErrorMessage name={`links.${index}.title`} component="div" className="field-error" />
															</div>
															<div className="col">
																<label htmlFor={`links.${index}.pictureUrl`}>pictureUrl</label>
																<Field name={`links.${index}.pictureUrl`} placeholder="www.picture.com" type="url" />
																<img src={friend.pictureUrl} alt={`links.${index}.title`} />
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
