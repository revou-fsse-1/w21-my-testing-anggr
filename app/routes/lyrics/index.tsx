import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPostListItems } from "~/models/post.server";
import { useOptionalAdminUser } from "~/utils";

export const loader = async () => {
  return json({
    posts: await getPostListItems(),
  });
};

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  const adminUser = useOptionalAdminUser();
  return (
    <main className="mx-auto max-w-4xl p-4">
      <Link
        to="/"
        className="focus:shadow-outline-indigo mb-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:border-indigo-700 focus:outline-none active:bg-indigo-700">
        Back
      </Link>

      {adminUser ? (
        <Link
          to="dashboard"
          className="focus:shadow-outline-green mb-4 ml-4 inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out hover:bg-green-500 focus:border-green-700 focus:outline-none active:bg-green-700">
          Dashboard Admin
        </Link>
      ) : null}
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="border-b pb-2">
            <Link
              to={post.slug}
              className="text-blue-600 underline"
              prefetch="intent">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
