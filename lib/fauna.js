import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import faunadb, { query as q } from "faunadb";

export const flattenData = (obj) => {
  if (!obj) return null;

  if (Array.isArray(obj.data)) {
    return {
      ...obj,
      data: obj.data.map((e) => flattenData(e)),
    };
  } else {
    return { ...obj.data, id: obj.ref.value.id };
  }
};

class QueryManager {
  constructor() {
    this.client = new faunadb.Client({
      secret: process.env.NEXT_PUBLIC_FAUNADB_SECRET,
    });
  }

  createPost({ title, content, author }) {
    return this.client
      .query(
        q.Create(q.Collection("blog_posts"), {
          data: {
            title,
            content,
            author,
            published: false,
            created_at: q.ToString(q.Now()),
            updated_at: q.ToString(q.Now()),
          },
        })
      )
      .then((res) => flattenData(res));
  }

  getPost(id) {
    return this.client
      .query(q.Get(q.Ref(q.Collection("blog_posts"), id)))
      .then((res) => flattenData(res));
  }

  getPostBySlug(slug) {
    return this.client
      .query(q.Get(q.Match(q.Index("post_search_by_slug"), slug)))
      .then((res) => flattenData(res));
  }

  getPosts(options = {}) {
    return this.client
      .query(
        q.Map(
          q.Paginate(
            q.Join(
              q.Match(q.Index("posts_search_by_published"), true),
              q.Index("posts_sort_by_published_at_desc")
            ),
            options
          ),
          q.Lambda(["published_at", "ref"], q.Get(q.Var("ref")))
        )
      )
      .then((res) => flattenData(res));
  }
  getDrafts(options = {}) {
    return this.client
      .query(
        q.Map(
          q.Paginate(
            q.Join(
              q.Match(q.Index("posts_search_by_published"), false),
              q.Index("posts_sort_by_updated_at_desc")
            ),
            options
          ),
          q.Lambda(["updated_at", "ref"], q.Get(q.Var("ref")))
        )
      )
      .then((res) => flattenData(res));
  }

  updatePost(id, data) {
    return this.client
      .query(
        q.Update(q.Ref(q.Collection("blog_posts"), id), {
          data: {
            ...data,
            updated_at: q.ToString(q.Now()),
          },
        })
      )
      .then((res) => flattenData(res));
  }

  deletePost(id) {
    return this.client.query(q.Delete(q.Ref(q.Collection("blog_posts"), id)));
  }

  async publishPost(id, data) {
    const ref = q.Ref(q.Collection("blog_posts"), id);

    const post = await this.client
      .query(q.Get(ref))
      .then((res) => flattenData(res));

    let slug;
    if (!post.slug) {
      const slugifiedTitle = slugify(data.title, {
        lower: true,
        strict: true,
      });

      slug = `${slugifiedTitle}-${uuidv4().split("-")[0]}`;
    }

    return this.client
      .query(
        q.Update(ref, {
          data: {
            ...data,
            slug,
            published: true,
            published_at: q.ToString(q.Now()),
            updated_at: q.ToString(q.Now()),
          },
        })
      )
      .then((res) => flattenData(res));
  }
}

const faunaQueries = new QueryManager();
export default faunaQueries;
