import {createClient} from "next-sanity";


//required data for sanity to work
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  token: process.env.SANITY_API_TOKEN,
}

//config sanity client to mine
const client = createClient(config);

export default function updateAuthor(req, res) {
  const { name, image, bio } = JSON.parse(req.body);
}