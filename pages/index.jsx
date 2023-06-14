import Link from "next/link";
import { sanityClient, urlFor } from "../lib/sanity";


export default function Home({posts}) {
  //console.log(posts)
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            {/* self note: overflow hidden is useful and i need to not forget it */}
            <div className="border rounded-lg group cursor-pointer overflow-hidden">
              {post.mainImage && (
                <>
                  <img 
                    className="h-60 w-full object-cover group-hover:scale-105 transition-transform 
                    duration-200 ease-in-out" 
                    src={urlFor(post.mainImage).url()} />
                  <div className="flex justify-between p-5 bg-white">
                    <div>
                      <p className="text-lg font-bold">{post.title}</p>
                      <p>{post.description} by: <span className="font-bold">{post.author.name}</span></p>
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