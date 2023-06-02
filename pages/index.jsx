import Link from "next/link";
import { sanityClient, urlFor } from "./sanity";


export default function Home({posts}) {
  //console.log(posts)
  return (
    <>
      <div className="flex items-center justify-center mt-10">
        home page
      </div>

      <div>
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div>
              {post.mainImage && (
                <img src={urlFor(post.mainImage).url()} />
              )}
            </div>
          </Link>
        ))}
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