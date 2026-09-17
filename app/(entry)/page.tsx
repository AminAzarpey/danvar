export default function Home() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=en" />
      <script dangerouslySetInnerHTML={{ __html: "location.replace('en')" }} />
      <p>
        Redirecting to <a href="en">the English site</a>…
      </p>
    </>
  );
}
