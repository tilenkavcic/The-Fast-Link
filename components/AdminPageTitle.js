import React, { useCallback, useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import PictureUpload from "../components/PictureUpload";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";
import getAbsoluteURL from "../utils/getAbsoluteURL";

export default function AdminPageTitle({ pageData, setPageData }) {
	const AuthUser = useAuthUser();

	const uploadData = useCallback(
		async (data) => {
			console.log("file",data.file)
			const token = await AuthUser.getIdToken();
			const endpoint = getAbsoluteURL("/api/editPageHeading");
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": data.file.type,
					Authorization: token,
					uid: AuthUser.id,
					page: data.name,
					submittedtile: data.title,
					submiteddescription: data.description,
					pictitle: data.file.name,
					pictype: data.file.type,
					picsize: data.file.size,
				},
				body: data.file,
			});
			console.log(data);
			const respData = await response.json();
			if (!response.ok) {
				console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(respData)}`);
				return null;
			}
			return respData;
		},
		[AuthUser]
	);

	const formData = {
		title: pageData.title,
		description: pageData.description,
		pictureUrl: pageData.pictureUrl,
		name: pageData.name,
		file: "",
	};

	return (
		<>
			<Formik
				initialValues={formData}
				onSubmit={async (values) => {
					console.log("submiting:", values);
					const ret = await uploadData(values, "username"); // TODO HARDCODED
				}}
			>
				{({ values, setFieldValue }) => (
					<>
						<Form>
							<label htmlFor="title">Title</label>
							<Field name="title" placeholder="The page title" />
							<label htmlFor="description">Description</label>
							<Field name="description" placeholder="This is a description" type="text" />
							<label htmlFor="file">Picture upload</label>
							<input
								id="file"
								name="file"
								type="file"
								onChange={(event) => {
									setFieldValue("file", event.currentTarget.files[0]);
								}}
								className="form-control"
							/>
							{values.pictureUrl ? <img src={values.pictureUrl} alt={values.title} /> : "no picture"}
							<button type="submit">Save</button>
						</Form>
					</>
				)}
			</Formik>
		</>
	);
}
