import React, { useCallback, useEffect, useState } from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";
import Link from "next/link";
import Head from "next/head";
import Header from "../components/Header";
import DemoPageLinks from "../components/DemoPageLinks";
import FullPageLoader from "../components/FullPageLoader";
import getAbsoluteURL from "../utils/getAbsoluteURL";
import fetch from "../lib/fetch";

const Page = () => {
	const AuthUser = useAuthUser();

	const [favoriteColor, setFavoriteColor] = useState();
	const fetchData = useCallback(async () => {
		const token = await AuthUser.getIdToken();
		const endpoint = getAbsoluteURL("/api/getPageData");
		const response = await fetch(endpoint, {
			method: "GET",
			headers: {
				Authorization: token,
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
		const fetchFavoriteColor = async () => {
			const data = await fetchData();
			console.log(data);
			setFavoriteColor(data);
		};
		fetchFavoriteColor();
	}, [fetchData]);

	return (
		<>
			<Head></Head>

			<h1>Admin panel</h1>
			<div>
				<Header email={AuthUser.email} signOut={AuthUser.signOut} />
				<div>
					<div>
						<h3>Example: SSR + data fetching with ID token</h3>
						<p>This page requires authentication. It will do a server-side redirect (307) to the login page if the auth cookies are not set.</p>
						{/* <p>Your favorite color is: {adminData}</p> */}
					</div>
					<DemoPageLinks />
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
