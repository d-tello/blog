import faunaQueries from "../../../../lib/fauna";

export default async function handler(req, res) {
  try {
    const { id } = req.query.id;

    const post = await faunaQueries.publishPost(id, req.body);
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}
