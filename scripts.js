"use strict"


const binID = "671e3527ad19ca34f8bf6509"
const binURL = "https://api.jsonbin.io/v3/b/" + binID

let todoList = [];

let req = new XMLHttpRequest();

req.onreadystatechange = () => {
    if (req.readyState === XMLHttpRequest.DONE) {
        try {
            let responseJSON = JSON.parse(req.responseText);
            if (Array.isArray(responseJSON["record"])) {
                todoList = responseJSON["record"].filter(item => item.title || item.description);
            } else {
                console.log("Fetched data is not an array. Skipping update.");
            }
        } catch (error) {
            console.error("Error parsing JSON response:", error);
            todoList = [];
        }
    }
};
req.open("GET", binURL + "/latest", true);
req.setRequestHeader("X-Master-Key", X_MASTER_KEY);
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
    req.setRequestHeader("X-Master-Key", X_MASTER_KEY);
    const dataToSend = todoList.length > 0 ? todoList : [{
        title: "",
        description: "",
        place: "",
        category: "",
        dueDate: ""
    }];

    req.send(JSON.stringify(dataToSend));
}

let updateTodoList = function() {
    let todoTableBody = document.getElementById("todoTableBody");

    todoTableBody.innerHTML = "";

    if (todoList.length === 0) {
        let emptyRow = document.createElement("tr");
        let emptyCell = document.createElement("td");
        emptyCell.colSpan = 6;
        emptyCell.textContent = "You can chill";
        emptyRow.appendChild(emptyCell);
        todoTableBody.appendChild(emptyRow);
        return;
    }

    let filterInputName = document.getElementById("filterName").value;
    let filterInputStartDate = document.getElementById("filterStartDate").value;
    let filterInputEndDate = document.getElementById("filterEndDate").value;

    let filteredTodoList = todoList.filter(item =>
        (filterInputName === "" || item.title.includes(filterInputName) || item.description.includes(filterInputName) || item.category.includes(filterInputName))
        && (item.dueDate > filterInputStartDate || filterInputStartDate === "")
        && (item.dueDate < filterInputEndDate || filterInputEndDate === "")
    );

    // Add rows for each todo item
    filteredTodoList.forEach((todo, index) => {
        let newTableRow = document.createElement("tr");

        let titleCell = document.createElement("td");
        titleCell.textContent = todo.title;
        newTableRow.appendChild(titleCell);

        let descriptionCell = document.createElement("td");
        descriptionCell.textContent = todo.description;
        newTableRow.appendChild(descriptionCell);

        let placeCell = document.createElement("td");
        placeCell.textContent = todo.place;
        newTableRow.appendChild(placeCell);

        let dueDateCell = document.createElement("td");
        dueDateCell.textContent = new Date(todo.dueDate).toLocaleDateString();
        newTableRow.appendChild(dueDateCell);

        let categoryCell = document.createElement("td");
        categoryCell.textContent = todo.category || "others";
        newTableRow.appendChild(categoryCell);

        let actionCell = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger btn-sm";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteTodo(index));
        actionCell.appendChild(deleteButton);
        newTableRow.appendChild(actionCell);

        todoTableBody.appendChild(newTableRow);
    });
};

setInterval(updateTodoList, 1000);

let deleteTodo = function(index) {
    todoList.splice(index,1);

    updateJSONbin();
    
}

let addTodo = async function() {
    let inputTitle = document.getElementById("inputTitle");
    let inputDescription = document.getElementById("inputDescription");
    let inputPlace = document.getElementById("inputPlace");
    let inputDate = document.getElementById("inputDate");


    if (!inputTitle.value.trim() && !inputDescription.value.trim()) {
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
        return;
    }

    let category = await categorizeTask(inputTitle.value, inputDescription.value);
    let newTitle = inputTitle.value;
    let newDescription = inputDescription.value;
    let newPlace = inputPlace.value;
    let newDate = new Date(inputDate.value);

    let newTodo = {
        title: newTitle,
        description: newDescription,
        place: newPlace,
        category: category,
        dueDate: newDate
    };

    todoList.push(newTodo);

    updateJSONbin();
}

const switchElement = document.getElementById('darkModeSwitch');
    const body = document.body;

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        switchElement.checked = true;
    } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
    }

    switchElement.addEventListener('change', () => {
        if (switchElement.checked) {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    async function categorizeTask(title, description) {
        const validDescription = description || "No additional details provided.";
    
        const messages = [
            {
                role: "system",
                content: "You are a task categorizer."
            },
            {
                role: "user",
                content: `Given a task with the title "${title}" and description "${validDescription}", categorize it into one of the categories: University, Work, Organizational, Entertainment, Shopping, or Others.`
            }
        ];
    
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: messages,
                    max_tokens: 10,
                    temperature: 0
                })
            });
    
            const data = await response.json();
    
            if (data.choices && data.choices[0]?.message?.content) {
                return data.choices[0].message.content.trim();
            } else {
                console.error("Unexpected API response structure:", data);
                return "Others"; 
            }
        } catch (error) {
            console.error("Error categorizing task:", error);
            return "Others";
        }
    }
    