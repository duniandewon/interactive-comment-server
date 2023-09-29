import mongoose from "mongoose";

export function connectDb() {
  const { MONGO_HOST, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DBNAME } =
    process.env;

  let URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DBNAME}`;

  mongoose.connect(URI);

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error: "));

  db.once("open", () => {
    console.log("Db connected successfully");
  });
}
