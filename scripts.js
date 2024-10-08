"use strict"

const binID = "670448d6acd3cb34a892eb21"
const binURL = "https://api.jsonbin.io/v3/b/" + binID

let todoList = []; //declares a new array for Your todo list

// let initList = function() {
//     let savedList = window.localStorage.getItem("todos");
//     if (savedList != null)
//         todoList = JSON.parse(savedList);
//     else
//         todoList.push(
//             {
//                 title: "Learn JS",
//                 description: "Create a demo application for my TODO's",
//                 place: "445",
//                 category: '',
//                 dueDate: new Date(2024,10,16)
//             },
//             {
//                 title: "Lecture test",
//                 description: "Quick test from the first three lectures",
//                 place: "F6",
//                 category: '',
//                 dueDate: new Date(2024,10,17)
//             }
//             // of course the lecture test mentioned above will not take place
//         );
// }
//
// initList();

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
    let todoListDiv =
        document.getElementById("todoListView");

    //remove all elements
    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    // Create a table to contain TODO's
    let todoListTable = document.createElement("table");
    todoListDiv.appendChild(todoListTable);

    let todoListTableBody = document.createElement("tbody")
    todoListTable.appendChild(todoListTableBody);

    let newTableHeader = document.createElement("th");
    todoListTableBody.appendChild(newTableHeader);

    newTableHeader.appendChild(document.createTextNode("TODO:"))

    //add all elements
    let filterInput = document.getElementById("inputSearch");
    for (let todo in todoList) {
        if (
            (filterInput.value === "") ||
            (todoList[todo].title.includes(filterInput.value)) ||
            (todoList[todo].description.includes(filterInput.value))
        ) {
            //// List version
            // let newElement = document.createElement("p");
            // let newContent = document.createTextNode(todoList[todo].title + " " +
            //     todoList[todo].description);
            // newElement.appendChild(newContent);
            // todoListDiv.appendChild(newElement);
            // let newDeleteButton = document.createElement("input");
            // newDeleteButton.type = "button";
            // newDeleteButton.value = "x";
            // newDeleteButton.addEventListener("click",
            //     function() {
            //         deleteTodo(todo);
            //     });
            // newElement.appendChild(newDeleteButton);

            // Table version (step 5)
            let newTableRow = document.createElement("tr")
            let newContent = document.createTextNode(todoList[todo].title + " " +
                todoList[todo].description);

            newTableRow.appendChild(newContent);
            todoListTableBody.appendChild(newTableRow);

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
    // Persist data
    // window.localStorage.setItem("todos", JSON.stringify(todoList));
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
    // Persist data
    // window.localStorage.setItem("todos", JSON.stringify(todoList));
    updateJSONbin();
}