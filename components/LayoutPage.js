import Head from "next/head";

export default function Layout({ children, home, title, description, pictureUrl, name }) {
	return (
		<>
			<Head>
				{/* facicon */}
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest" />
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
				{/* fb sharing */}
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				{pictureUrl ? <meta property="og:image" content={pictureUrl} /> : ""}
				<meta property="og:url" content="http://thefast.link/" />
				<meta property="og:site_name" content="The Fast Link" />
				{/* twitter sharing */}
				<meta name="twitter:title" content={title} />
				<meta name="twitter:description" content={description} />
				{pictureUrl ? (
					<>
						<meta name="twitter:image" content={pictureUrl} />
						<meta name="twitter:card" content="summary_large_image" />{" "}
					</>
				) : (
					""
				)}

				<title>{title}</title>
				<meta name="msapplication-TileColor" content="#292929" />
				<meta name="theme-color" content="#292929" />
				<meta name="description" content="Link" />
				<meta name="viewport" content="width=device-width" />
				<meta charSet="UTF-8" />
				<meta name="description" content={description} />
				<meta name="author" content="The Fast Link" />

				{/* <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            title
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
			
        <meta name="og:title" contetn={title} />
        <meta name="twitter:card" content="summary_large_image" /> 
				*/}
			</Head>
			<main>{children}</main>
		</>
	);
}
