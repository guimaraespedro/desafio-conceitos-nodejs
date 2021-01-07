const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  
  const {title, url, techs} = request.body;

  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes:0
  }

  repositories.push(project);

  return response.json(project);

});

app.put("/repositories/:id", (request, response) => {

  const {id} = request.params;

  const {title, url, techs} = request.body;

  if(!isUuid(id)){
    return response.status(400).send({message: "invalid Id"});
  }

  const projectIndex = repositories.findIndex(project=> project.id===id);

  if(projectIndex<0){
    return response.status(400).send({message:"id not found"});
  }

  repositories[projectIndex] = {...repositories[projectIndex], title, url, techs};
  console.log(repositories[projectIndex]);

  return response.json(repositories[projectIndex]);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).send({message: "invalid Id"});
  }

  const projectIndex = repositories.findIndex(project=> project.id===id);

  if(projectIndex<0){
    return response.status(400).send({message:"id not found"});
  }

  repositories.splice(projectIndex, 1);
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).send({message: "invalid Id"});
  }

  const projectIndex = repositories.findIndex(project=> project.id===id);

  if(projectIndex<0){
    return response.status(400).send({message:"id not found"});
  }

  repositories[projectIndex].likes++;

  return response.json(repositories[projectIndex]);

});

module.exports = app;
