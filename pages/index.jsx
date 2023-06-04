import Link from "next/link";
import { sanityClient, urlFor } from "./sanity";


export default function Home({posts}) {
  //console.log(posts)
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="">
              {post.mainImage && (
                <>
                  <img src={urlFor(post.mainImage).url()} />
                  <div className="flex justify-between p-5 bg-white">
                    <div>
                      <p>{post.title}</p>
                      <p>{post.description} by {post.author.name}</p>
                      <p></p>
                    </div>
                    <img className="h-12 w-12 rounded-full" src={urlFor(post.author.image).url()} alt="" />
                  </div>
                </>
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