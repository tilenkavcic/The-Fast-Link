import React, { useCallback, useEffect, useState, useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
// import PictureUpload from "../components/PictureUpload";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";
import getAbsoluteURL from "../utils/getAbsoluteURL";
import Router from "next/router";
import { PageContext } from "../context/PageContext";

export default function AdminPageTitle() {
	const AuthUser = useAuthUser();

	const [pageData, setPageData] = useContext(PageContext);

	console.log(pageData);
	const uploadData = useCallback(
		async (data) => {
			const token = await AuthUser.getIdToken();
			const endpoint = getAbsoluteURL("/api/editPageHeading");
			console.log("name", pageData.name);
			console.log("name2", data);

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
		console.log("submiting:", values);
		const ret = await uploadData(values); 
		setPageData((data) => ({
			...data,
			title: values.title,
			description: values.description,
		}));
		console.log(ret)
		console.log()
		console.log("Pagedata", pageData);
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
						<>
							<Form>
								<label htmlFor="title">Title</label>
								<Field name="title" placeholder="The page title" />
								<label htmlFor="description">Description</label>
								<Field name="description" placeholder="This is a description" type="text" />
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
								<button type="submit">Save</button>
							</Form>
						</>
					)}
				</Formik>
			) : (
				""
			)}
		</>
	);
}
