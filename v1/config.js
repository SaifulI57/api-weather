import dotenv from "dotenv";
dotenv.config();
export let url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.PASSWORD}@train.cqspyb4.mongodb.net/?retryWrites=true&w=majority`;
