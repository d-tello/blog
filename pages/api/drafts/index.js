import faunaQueries from "../../../lib/fauna";

export default async function handler(req, res) {
  try {
    const { author = "", size = 10, cursor = undefined } = req.query;
    const posts = await faunaQueries.getDrafts({
      author,
      size,
      after: faunaQueries.toExpr(cursor),
    });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}
