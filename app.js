/*
 *  Created a Table with name todo in the todoApplication.db file using the CLI.
 */

const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const addDays = require("date-fns/addDays");

const databasePath = path.join(__dirname, "todoApplication.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasCategoryProperty = (requestQuery) => {
    return requestQuery.category !== undefined;
};

const hasStatusAndCategoryProperties = (requestQuery) => {
    return (
        requestQuery.category !== undefined && requestQuery.status !== undefined
    );
};

const hasPriorityAndCategoryProperties = (requestQuery) => {
    return (
        requestQuery.category !== undefined && requestQuery.priority !== undefined
    );
};

app.get("/", (request, response) => {
    const dateTime = new Date();
  let date = addDays(new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()), 100);
  response.send(
    `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  );
  //response.send(date_1);
});

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodosQuery = "";
  const { search_q = "", priority, status, category } = request.query;

  switch (true) {
    case hasPriorityAndStatusProperties(request.query): //if this is true then below query is taken in the code
      getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND status = '${status}'
    AND priority = '${priority}';`;
      break;
    case hasPriorityProperty(request.query):
      getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND priority = '${priority}';`;
      break;
    case hasStatusProperty(request.query):
      getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND status = '${status}';`;
      break;
    case hasStatusAndCategoryProperties(request.query):
       getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND status = '${status}'
    AND category = '${category}';`;
      break; 
    case hasPriorityAndCategoryProperties(request.query):
        getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND priority = '${priority}'
    AND category = '${category}';`;
      break;
    case hasCategoryProperty(request.query):
        getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND category = '${category}';`;
      break;        
    default:
      getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%';`;
  }

  data = await database.all(getTodosQuery);
  response.send(data);
});

app.post("/todos/", async (request, response) => {
     const todoDetails = request.body;
     const { id, todo, priority, status, category, due_date } = todoDetails;
     //console.log(status);
     const addTodoQuery = `
     INSERT INTO
        todo (id, todo, priority, status, category, due_date)
    VALUES
        (
            '${id}',
            '${todo}',
            '${priority}',
            '${status}',
            '${category}',
            '${due_date}');`;
    const updateTodo = await database.run(addTodoQuery);
    //const todoId = dpResponse.lastID;
    //console.log('${status}')
    console.log(updateTodo);
    if(status!==undefined){
        response.status(400)
        response.send("Invalid Todo Status");
    }
    else{
        response.status(200)
        response.send('Todo Successfully Added')
    }
    
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
    DELETE FROM
      todo
    WHERE
      id = ${todoId};`;
  await database.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;

/// ccbp submit NJSCADOQBS

module.exports = app;


/////