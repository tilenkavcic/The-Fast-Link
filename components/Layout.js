import Head from "next/head";

export default function Layout({ children, home, title }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Link" />
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta charSet="UTF-8"/>

        {/* <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            title
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" contetn={title} />
        <meta name="twitter:card" content="summary_large_image" /> */}
      </Head>
      <main>{children}</main>
    </>
  );
}
