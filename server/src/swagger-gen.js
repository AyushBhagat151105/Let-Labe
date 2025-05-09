import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "LeetLab Api",
    description: "Description",
  },
  host: "localhost:3000",
};

const outputFile = "./swagger-output.json";
const routes = ["./app.js"];


swaggerAutogen(outputFile, routes, doc);
