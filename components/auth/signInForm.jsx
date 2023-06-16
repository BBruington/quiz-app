import { signInWithEmail, getCurrentUser } from "../../lib/firebase";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const defaultSignInFields = {
  email: '',
  password: '',
}

export default function SignInForm() {

  

  const router = useRouter();
  useEffect(()=>{
    const handleGetUser = async () => {
      const currentUser = await getCurrentUser();
      if(currentUser !== null) {
        router.push('/')
      } 
    }
    handleGetUser()
  },[])

  const handleOnClickSignUp = (e) => {
    //e.preventDefault();
    router.push('/login/signup');
  };

  const [formFields, setFormFields] = useState(defaultSignInFields);
  const { password, email} = formFields;

  const resetFormFields = () => {
    setFormFields(defaultSignInFields);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const currentUser = await getCurrentUser();

    if(currentUser !== null) {alert('You are already signed in'); return;}

    const signInUser = await signInWithEmail(email, password).then(() => {router.push('/')})
    resetFormFields() 
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <>        
      <div className="flex lg:w-2/6 bg-gray-100 flex-col  justify-center pb-10  sm:px-6 lg:px-14 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">          
          <h2 className="text-center text-3xl font-bold tracking-tight mt-5 text-gray-900">Sign in</h2>          
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSignIn}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={handleChange}
                    value={email}
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    onChange={handleChange}
                    value={password}
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

              </div> */}
              <div className="flex text-sm justify-between">
                <div>Don&apos;t have an account?</div>
                <div onClick={handleOnClickSignUp} className="text-indigo-600 hover:text-indigo-500 cursor-pointer ml-1 mr-5">Sign up</div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}