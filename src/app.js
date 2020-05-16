const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function findRepository(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  request.repositoryIndex = repositoryIndex;

  return next();
}

app.use('/repositories/:id', findRepository);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title || !url || !techs) {
    return response.status(400).json({ error: "Invalid repository." });
  }

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { repositoryIndex } = request;
  const { title, url, techs } = request.body;

  // if (!title && !url && !techs) {
  //  return response.status(400).json({ error: "You changed anything." });
  // }

  if (title) {
    repositories[repositoryIndex].title = title;
  }

  if (url) {
    repositories[repositoryIndex].url = url;
  }

  if (techs) {
    repositories[repositoryIndex].techs = techs;
  }

  const repository = repositories[repositoryIndex];

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { repositoryIndex } = request;

  repositories[repositoryIndex].likes++;

  const repository = repositories[repositoryIndex];

  return response.json(repository);
});

module.exports = app;
