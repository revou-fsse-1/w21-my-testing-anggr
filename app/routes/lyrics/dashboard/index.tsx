import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { requireAdminUser } from "~/session.server";
import { getPostListItems } from "~/models/post.server";
import { format } from "date-fns";

export async function loader({ request }: LoaderArgs) {
  await requireAdminUser(request);
  return json({ posts: await getPostListItems() });
}

export default function AdminIndex() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">
        Dashboard Admin
      </h1>

      <Link
        to="/lyrics"
        className="ripple inline-block rounded bg-blue-600 px-6 py-2 text-center text-xs font-medium uppercase leading-6 text-white shadow transition hover:bg-blue-800 hover:shadow-lg focus:outline-none">
        Back
      </Link>
      <div className="mb-6 flex items-center justify-end">
        <Link
          to="new"
          className="focus:shadow-outline-indigo inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:border-indigo-700 focus:outline-none active:bg-indigo-700">
          Create a New Post
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/lyrics/dashboard/${post.slug}`}
            className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl">
            <div className="flex-grow p-4">
              <h2 className="mb-2 mt-2  font-bold">{post.title}</h2>
              <p className="text-gray-700">
                {post.lyric.length > 50
                  ? post.lyric.substring(0, 50) + "..."
                  : post.lyric}
              </p>
            </div>
            <div className="flex items-center justify-between bg-gray-900 px-4 py-2">
              <h3 className="text-sm text-white">
                Created at: {format(new Date(post.createdAt), "dd/MM/yyyy")}
              </h3>
            </div>
          </Link>
        ))}
        <main className="col-span-4 md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
