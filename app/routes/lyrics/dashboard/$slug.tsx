import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useCatch,
  useLoaderData,
  useParams,
  useNavigation,
  Link,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { ErrorFallback } from "~/components";

import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from "~/models/post.server";
import { requireAdminUser } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  await requireAdminUser(request);
  invariant(params.slug, "slug not found");
  if (params.slug === "new") {
    return json({ post: null });
  }

  const post = await getPost(params.slug);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
}

export async function action({ request, params }: ActionArgs) {
  await requireAdminUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  invariant(typeof params.slug === "string", "slug not provided");

  if (intent === "delete") {
    await deletePost(params.slug);
    return redirect("/lyrics/dashboard");
  }

  const title = formData.get("title");
  const slug = intent !== "update" ? formData.get("slug") : params.slug;
  const lyric = formData.get("lyric");

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    lyric: lyric ? null : "Lyric is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof lyric === "string", "lyric must be a string");

  if (params.slug === "new") {
    await createPost({ title, slug, lyric });
  } else {
    await updatePost({ title, slug, lyric });
  }

  return redirect("/lyrics/dashboard");
}

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function PostAdmin() {
  const data = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  const navigation = useNavigation();
  const isCreating = navigation.formData?.get("intent") === "create";
  const isUpdating = navigation.formData?.get("intent") === "update";
  const isDeleting = navigation.formData?.get("intent") === "delete";
  const isNewPost = !data.post;

  return (
    <Form method="post">
      <Link
        to="/lyrics/dashboard"
        className="ripple inline-block rounded bg-blue-600 px-6 py-2 text-center text-xs font-medium uppercase leading-6 text-white shadow transition hover:bg-blue-800 hover:shadow-lg focus:outline-none">
        Back
      </Link>
      <p>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
            key={data?.post?.slug ?? "new"}
            defaultValue={data?.post?.title}
          />
        </label>
      </p>
      <p>
        <label>
          URL Slug:{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input
            type="text"
            name="slug"
            className={`${inputClassName} disabled:opacity-60`}
            key={data?.post?.slug ?? "new"}
            defaultValue={data?.post?.slug}
            disabled={Boolean(data.post)}
          />
        </label>
      </p>
      <p>
        <label htmlFor="lyric">
          Lyric:{" "}
          {errors?.lyric ? (
            <em className="text-red-600">{errors.lyric}</em>
          ) : null}
        </label>
        <br />
        <textarea
          id="lyric"
          rows={8}
          name="lyric"
          className={`${inputClassName} font-mono`}
          key={data?.post?.slug ?? "new"}
          defaultValue={data?.post?.lyric}
        />
      </p>
      <div className="flex justify-end gap-4">
        {isNewPost ? null : (
          <button
            type="submit"
            name="intent"
            value="delete"
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
            disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
        <button
          type="submit"
          name="intent"
          value={isNewPost ? "create" : "update"}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={isCreating || isUpdating}>
          {isNewPost ? (isCreating ? "Creating..." : "Create") : null}
          {isNewPost ? null : isUpdating ? "Updating..." : "Update"}
        </button>
      </div>
    </Form>
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
