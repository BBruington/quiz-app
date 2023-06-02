import { 
  createCurrentUserHook,
  createClient
 } from "next-sanity";
 import createImageUrlBuilder from '@sanity/image-url';

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: "2021-03-25",
  useCdn: process.env.NODE_ENV === "production",
};

//fetches data in the getProps page functions
export const sanityClient = createClient(config);

//generates Image URLs with only asset reference data in your docs
export const urlFor = (source) => createImageUrlBuilder(config).image(source);

//function for using current logged in user account
//export const useCurrentUser = createCurrentUserHook(config);