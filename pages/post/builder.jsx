import PortableText from "react-portable-text";
import { sanityClient, urlFor } from "../../lib/sanity";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

export default function Builder ({_id, title, description, email, mainImage, body, }) {

  const [submitted, setSubmitted] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    await fetch('/api/createPost', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(() => {
      setSubmitted(true);
    }).catch((e) => {
      console.error(e);
      setSubmitted(false);
    })
  }

  return (
    <>
    {submitted ? (
        <div className="flex flex-col p-10 my-10 bg-green-600 text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold">Your Post has been successfully been created!</h3>
          <p>Once it has been approved, it will appear on the home page</p>
        </div>
        )
        :
        (
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col p-10 my-10 max-w-2xl mx-auto mb-10">

        <h3 className="text-sm text-green-600"></h3>
        <h4 className="text-3xl font-bold">Post Editor</h4>
        <hr className="py-3 my-2"></hr>

        <input 
          {...register("_id")}
          type="hidden"
          name="_id"
          //value={post._id}
        />

        <label className="block mb-5">
          <span className="text-gray-700">Name</span> {/*block elements have their own width */}
          <input 
          {...register("name", { required: true })}
          className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-green-600 outline-none focus:ring" 
          placeholder="John Smith" type="text" />
        </label>

        <label className="block mb-5">
          <span className="text-gray-700">Email</span>
          <input
          {...register("email", { required: true })}
          className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-green-600 outline-none focus:ring" 
          placeholder="email@somthing.com" type="email" />
        </label>

        <label className="block mb-5">
          <span className="text-gray-700">Title</span>
          <input
          {...register("title", { required: true })}
          className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-green-600 outline-none focus:ring" 
          placeholder="Title Of Your Post" type="title" />
        </label>

        <label className="block mb-5">
          <span className="text-gray-700">Body</span>
          <textarea 
          {...register("body", { required: true })}            
          className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-green-600 outline-none focus:ring" 
          placeholder="Right the core of your post here" rows={8}/>
        </label>

        {/* this is where errors from lack of fields validation appear */}
        <div className="flex flex-col p-5">
          {/* this is connected to register / formstate and notices the fields are required */}
          {errors.name && (
            <span className="text-red-500">- The Name Field is required</span>
          )}
          {errors.body && (
            <span className="text-red-500">- The Post Field is required</span>
          )}
          {errors.title && (
            <span className="text-red-500">- The Title Field is required</span>
          )}
          {errors.email && (
            <span className="text-red-500">- The Email Field is required</span>
          )}
        </div>

        <input 
        type="submit" 
        className="shadow bg-green-600 hover:bg-green-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer" 
        />

        </form>
    )}
    </>
  )
}