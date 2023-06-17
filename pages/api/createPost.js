import {createClient} from "next-sanity";

//required data for sanity to work
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  token: process.env.SANITY_API_TOKEN,
}

//config sanity client to mine
const client = createClient(config);


export default async function createComment(
  req,
  res
) {
  const {_id, title, description, email, mainImage, body, } = JSON.parse(req.body);

  try{
    await client.create({
      _type: "post",
      title,
      description,
      mainImage,
      body,
      author: {
        //update the author with this id
        _type: 'reference',
        _ref: _id
      },
      email,
      comment,
    });
  } catch(err) {
    return res.status(500).json({ message: "Failed to submit comment", err});
  }

  console.log("Comment submitted");
  res.status(200).json({ message: "Comment submitted" })
}