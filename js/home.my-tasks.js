const userTodoItems = document.querySelector('.todo-list');

function showToast(type, message) {
    var toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "toast " + type;
    toast.classList.remove("hide");
    toast.classList.add("show");
    setTimeout(function () {
        toast.classList.remove("show");
        toast.classList.add("hide");
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
    showLoader('task-section');

    setTimeout(function () {
        // displayUsers();
        hideLoader('task-section');
    }, 1000);
});

const getData = async () => {
    const res = await fetch(`https://dummyjson.com/users/${localStorage.userId}/todos`);
    // console.log(res);
    const data = await res.json();
    // console.log(data);

    // Merge local todos with fetched todos
    const localTodos = JSON.parse(localStorage.getItem('todos')) || [];
    const mergedTodos = [...data.todos, ...localTodos];

    return { todos: mergedTodos };
};

const displayTasks = async () => {
    // showLoader();
    const payload = await getData();
    // hideLoader();
    let dataDisplay = payload.todos.map((task) => {
        const { id, todo, completed, userId } = task;
        const completedClass = completed ? 'completed' : '';

        return `
            <div class="todo ${completedClass}">
                <li class="todo-item">${todo}</li>
                <span class="complete-btn">
                    <i class="fa-solid fa-check" style="font-size: 1.8rem;"></i>
                </span>
                <span class="trash-btn">
                    <i class="fa-regular fa-trash-can" id="tash-btn" style="font-size: 1.5rem;"></i>
                </span>
            </div>
        `;
    }).join("");

    userTodoItems.innerHTML = dataDisplay;
}
displayTasks();

const todoInputs = document.querySelector(".todo-inputs");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todos");

document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodos);
todoList.addEventListener("click", deleteCheck);

function addTodos(e) {
    e.preventDefault();
    const todoText = todoInputs.value;
    if (todoText.trim() === "") return; // Don't add empty todos

    const newTodo = {
        id: Date.now(), // For unique ID generator
        todo: todoText,
        completed: false,
        userId: localStorage.userId // Assuming you have userId stored in localStorage
    };

    const localTodos = JSON.parse(localStorage.getItem('todos')) || [];
    localTodos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(localTodos));

    displayTasks();
    todoInputs.value = "";
    showToast('success', 'Task added successfully.');
}

function deleteCheck(e) {
    const items = e.target;

    if (items.classList.contains("trash-btn") || items.parentElement.classList.contains("trash-btn")) {
        const todo = items.closest('.todo');
        const localTodos = JSON.parse(localStorage.getItem('todos')) || [];
        todo.classList.add("fall");
        todo.addEventListener("transitionend", function () {
            todo.remove();
            const todoText = todo.querySelector('.todo-item').textContent;
            const updatedTodos = localTodos.filter(item => item.todo !== todoText);
            localStorage.setItem('todos', JSON.stringify(updatedTodos));
        });
    }
    if (items.classList[0] === "complete-btn" || items.classList[0] === "") {
        const todo = items.parentElement;
        todo.classList.toggle("completed");
    }
}

function getTodos() {
    const localTodos = JSON.parse(localStorage.getItem('todos')) || [];

    localTodos.forEach(function (todo) {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        const newTodo = document.createElement("li");
        newTodo.classList.add("todo-item");
        newTodo.innerText = todo.todo;
        todoDiv.appendChild(newTodo);
        const compleatedButton = document.createElement("span");
        compleatedButton.innerHTML = '<i class="fa-solid fa-check" style="font-size: 1.8rem;"></i>';
        compleatedButton.classList.add("complete-btn");
        todoDiv.appendChild(compleatedButton);
        const trashButton = document.createElement("span");
        trashButton.innerHTML = '<i class="fa-regular fa-trash-can" style="font-size: 1.5rem;"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);
        todoList.appendChild(todoDiv);
    });
}