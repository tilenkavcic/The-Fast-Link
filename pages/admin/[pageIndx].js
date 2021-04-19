import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";
import Link from "next/link";
import Head from "next/head";
import Header from "../../components/Header";
import FullPageLoader from "../../components/FullPageLoader";
import getAbsoluteURL from "../../utils/getAbsoluteURL";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import AdminLinks from "../../components/AdminLinks";
import AdminPageTitle from "../../components/AdminPageTitle";

const Page = () => {
	const AuthUser = useAuthUser();
	const router = useRouter();
	const { pageIndx } = router.query;

	const [userData, setUserData] = useState({});
	const [pageData, setPageData] = useState({});

	const fetchData = useCallback(
		async (endpointUrl) => {
			const token = await AuthUser.getIdToken();
			const endpoint = getAbsoluteURL(endpointUrl);
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
		},
		[AuthUser]
	);

	const fetchPage = useCallback(
		async (endpointUrl, thisPage) => {
			const token = await AuthUser.getIdToken();
			const endpoint = getAbsoluteURL(endpointUrl);
			const response = await fetch(endpoint, {
				method: "GET",
				headers: {
					Authorization: token,
					uid: AuthUser.id,
					page: JSON.stringify(thisPage),
				},
			});
			const data = await response.json();
			if (!response.ok) {
				console.error(`Data fetching failed with status ${response.status}: ${JSON.stringify(data)}`);
				return null;
			}
			return data;
		},
		[AuthUser]
	);

	useEffect(() => {
		const fetchUserPageData = async () => {
			const data = await fetchData("/api/getUserData");
			setUserData(data);
			const thisPage = data.pages[pageIndx];
			const ret = await fetchPage("/api/getPageData", thisPage);
			setPageData(ret);
		};
		fetchUserPageData();
	}, [fetchData, fetchPage]);

	return (
		<>
			<Head></Head>
			<h1>Admin panel</h1>
			<div>
				<Header email={AuthUser.email} signOut={AuthUser.signOut} />
				<div>
					{pageData.title ? (
						<>
							<AdminLinks pageData={pageData} setPageData={setPageData} />
						</>
					) : (
						// no page title (this is a new page)
						<>
							<AdminPageTitle pageData={pageData} setPageData={setPageData} />
						</>
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
