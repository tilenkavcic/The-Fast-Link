import React, { useCallback, useEffect, useState } from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";
import Link from "next/link";
import Head from "next/head";
import Header from "../components/Header";
import FullPageLoader from "../components/FullPageLoader";
import getAbsoluteURL from "../utils/getAbsoluteURL";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import AdminLinks from "../components/AdminLinks";

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

					{pageData.title ? <AdminLinks pageData={pageData} setPageData={setPageData} /> : ""}
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
