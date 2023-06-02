import { sanityClient, urlFor } from "./sanity";


export default function Home({posts}) {
  console.log(posts)
  return (
    <>
      <div className="flex items-center justify-center mt-10">
        home page
      </div>
    </>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    slug,
    author -> {
      name,
      image
    },
    description,
    mainImage,
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};