"use strict"

const binID = "670448d6acd3cb34a892eb21"
const binURL = "https://api.jsonbin.io/v3/b/" + binID

let todoList = []; //declares a new array for Your todo list

let req = new XMLHttpRequest();

req.onreadystatechange = () => {
    if (req.readyState === XMLHttpRequest.DONE) {
        let responseJSON = JSON.parse(req.responseText);
        todoList = responseJSON["record"];
    }
};

req.open("GET", binURL + "/latest", true);
// req.setRequestHeader("X-Master-Key", "<API_KEY>");
req.send();

let updateJSONbin = function() {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            console.log(req.responseText);
        }
    };

    req.open("PUT", binURL, true);
    req.setRequestHeader("Content-Type", "application/json");
    // req.setRequestHeader("X-Master-Key", "<API_KEY>");
    req.send(JSON.stringify(todoList));
}

let updateTodoList = function() {
    let todoTable = document.getElementById("todoTable")
    let todoTableBody = document.getElementById("todoTableBody")
    let todoTableRowNum = todoTableBody.rows.length

    // remove all table rows except the header
    for (let i =  todoTableRowNum - 1; i > 0; i--) {
        todoTable.deleteRow(i);
    }

    //add all elements
    let filterInput = document.getElementById("inputSearch");
    for (let todo in todoList) {
        if (
            (filterInput.value === "") ||
            (todoList[todo].title.includes(filterInput.value)) ||
            (todoList[todo].description.includes(filterInput.value))
        ) {
            let newTableRow = document.createElement("tr")
            let newContent = document.createTextNode(todoList[todo].title + " " +
                todoList[todo].description);

            newTableRow.appendChild(newContent);
            todoTableBody.appendChild(newTableRow);

            let newDeleteButton = document.createElement("input");
            newDeleteButton.type = "button";
            newDeleteButton.value = "x";
            newDeleteButton.addEventListener("click",
                function() {
                    deleteTodo(todo);
                });
            newTableRow.appendChild(newDeleteButton);
        }
    }
}

setInterval(updateTodoList, 1000);

let deleteTodo = function(index) {
    todoList.splice(index,1);

    updateJSONbin();
}

let addTodo = function() {
    //get the elements in the form
    let inputTitle = document.getElementById("inputTitle");
    let inputDescription = document.getElementById("inputDescription");
    let inputPlace = document.getElementById("inputPlace");
    let inputDate = document.getElementById("inputDate");

    //get the values from the form
    let newTitle = inputTitle.value;
    let newDescription = inputDescription.value;
    let newPlace = inputPlace.value;
    let newDate = new Date(inputDate.value);

    //create new item
    let newTodo = {
        title: newTitle,
        description: newDescription,
        place: newPlace,
        category: '',
        dueDate: newDate
    };

    //add item to the list
    todoList.push(newTodo);

    updateJSONbin();
}