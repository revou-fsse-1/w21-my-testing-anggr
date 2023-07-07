import { Form, Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-gradient-to-r from-gray-900 to-gray-600 sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src="https://res.cloudinary.com/djudfrj8s/image/upload/v1688051265/week-20/2018-11-06-chvrches-live-music-hall-koeln_027_rj6wim.jpg"
                alt="Sonic Youth On Stage"
              />
              <div className="absolute inset-0 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-sky-400 to-indigo-900 mix-blend-multiply" />
            </div>
            <div className="lg:pb-18 relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-sky-500 drop-shadow-md">
                  SonicVerse
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl">
                Unleash Your Sonicverse: Ignite the Energetic Power of Youthful
                Lyrics
              </p>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {user ? (
                  <div>
                    <p className="mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl">
                      Hello {user.email} 👋
                    </p>
                    <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    
                      <Link
                        to="/lyrics"
                        className="w-full rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400">
                        View Lyrics
                      </Link>
                      <Form action="/logout" method="post">
                        <button className="w-full rounded bg-red-500  px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400">
                          Logout
                        </button>
                      </Form>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      to="/login"
                      className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600">
                      Login
                    </Link>
                    <Link
                      to="/lyrics"
                      className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600">
                      View Lyrics
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8"></div>
      </div>
    </main>
  );
}
