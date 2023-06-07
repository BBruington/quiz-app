import { SanityClient, sanityClient, urlFor } from "../../utils/sanity";

export default function Post({post}) {
  console.log(post)
  return (
    <>
      <main>
        {post.title}
      </main>
    </>
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
    _id,
    slug{
      current
    }
  }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map(post => ({
    params: {
      slug: post.slug.current
    }
  }))

  return {
    paths,
    fallback: "blocking"
  }
}

export const getStaticProps = async ({ params }) => {

  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author-> {
      name,
      image
    },
    'comments': *[
      _type == "comment" &&
      post._ref == ^._id &&
      approved == true
    ],
    description,
    mainImage,
    slug,
    body
  }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })
  if (!post) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      post,
    }
  }
}