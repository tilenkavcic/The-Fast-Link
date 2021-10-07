import React, { useCallback, useEffect, useState } from "react";
import {
	useAuthUser,
	withAuthUser,
	withAuthUserTokenSSR,
	AuthAction,
} from "next-firebase-auth";
import Link from "next/link";
import Head from "next/head";
import Header from "../../../components/Header";
import FullPageLoader from "../../../components/FullPageLoader";
import { PageProvider } from "../../../context/PageContext";
import PageBody from "../../../components/PageBody";
import Layout from "../../../components/Layout";
import { Container } from "react-bootstrap";
import Footer from "../../../components/Footer";

const Page = () => {
	const AuthUser = useAuthUser();

	return (
		<Layout
			title="The Fast Link | Admin"
			description="The Fast Link Admin Page, edit your beautiful, fast podcast links"
		>
			<Header email={AuthUser.email} signOut={AuthUser.signOut} />
			<PageProvider>
				<Container>
					<PageBody />
				</Container>
				<Footer />
			</PageProvider>
		</Layout>
	);
};

export default withAuthUser({
	whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
	whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
	LoaderComponent: FullPageLoader,
})(Page);
