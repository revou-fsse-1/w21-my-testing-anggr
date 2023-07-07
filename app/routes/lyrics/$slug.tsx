import { marked } from "marked";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useCatch, useLoaderData, useParams } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPost } from "~/models/post.server";
import { ErrorFallback } from "~/components";
import { useOptionalAdminUser } from "~/utils";

export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);
  if (!post) {
    throw new Response("not found", { status: 404 });
  }

  const html = marked(post.lyric);
  return json({ post, html });
}

export default function PostSlug() {
  const { post, html } = useLoaderData<typeof loader>();
  const adminUser = useOptionalAdminUser();
  return (
    <main className="mx-auto max-w-4xl">
      <Link
        to="/lyrics"
        className="ripple inline-block rounded bg-blue-600 px-6 py-2 text-center text-xs font-medium uppercase leading-6 text-white shadow transition hover:bg-blue-800 hover:shadow-lg focus:outline-none">
        Back
      </Link>
      <h1 className="my-6 border-b-2 text-center text-3xl">{post.title}</h1>
      {adminUser ? (
        <Link
          to={`/lyrics/dashboard/${post.slug}`}
          className="text-blue-600 underline">
          Edit Lyric
        </Link>
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();

  if (caught.status === 404) {
    return (
      <ErrorFallback>
        There was no post found with the link "{params.slug}"
      </ErrorFallback>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <ErrorFallback>There was a problem. Sorry.</ErrorFallback>;
}
