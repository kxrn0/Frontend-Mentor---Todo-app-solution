const todosContainer = document.querySelector(".todos ul");
const addTodo = document.querySelector(".todo-input");
const checked = document.querySelector(".todo-input-container .check-todo");
const todoUl = document.querySelector(".todos ul");

const itemsLeft = document.querySelector(".items-left");

const showAll = document.querySelector(".options .all");
const showActive = document.querySelector(".options .active");
const showCompleted = document.querySelector(".options .completed");
const clearCompleted = document.querySelector(".clear-completed");
const states = {all: "all", active: "active", completed: "completed"};
let todos, state;

todos = [];
state = states.all;

let byme = ["one", "two", "three", "four", "five"];

for (let i = 0; i < byme.length; i++)
    add_todo(byme[i]);

showAll.addEventListener("click", () => {
    if (showAll.classList.contains("selected"))
        return;
    
    document.querySelector(".selected").classList.remove("selected");
    showAll.classList.add("selected");
    state = states.all;
    render(() => true);
});

showActive.addEventListener("click", () => {
    if (showActive.classList.contains("selected"))
        return;
    
    document.querySelector(".selected").classList.remove("selected");
    showActive.classList.add("selected");
    state = states.active;
    render(todo => !todo.checked);
});

showCompleted.addEventListener("click", () => {
    if (showCompleted.classList.contains("selected"))
        return;
    
    document.querySelector(".selected").classList.remove("selected");
    showCompleted.classList.add("selected");
    state = states.completed;
    render(todo => todo.checked);
});

clearCompleted.addEventListener("click", () => {
    todos = todos.filter(todo => !todo.checked);
    render(() => true);
});

function delete_todo(id) {
    todos = todos.filter(todo => todo.id != id);
    render(() => true);
}

function update_state(id) {
    const index = todos.findIndex(todo => todo.id == id);

    todos = todos.slice(0, index).concat({value: todos[index].value, id, checked: !todos[index].checked}).concat(todos.slice(index + 1));
    if (state == states.all)
        render(() => true);
    else if (state == states.active)
        render(todo => !todo.checked);
    else if (state == states.completed)
        render(todo => todo.checked);
    update_items_left();
}

function add_todo(value) {
    const id = Math.random().toString(16);

    todos.push({value, id, checked: checked.checked});
    addTodo.value = '';
    render(todo => {
        if (state == states.all)
            return true;
        else if (state == states.active)
            return !todo.checked;
        else if (state == states.completed)
            return todo.checked;
    });
}

function render(cond) {
    todoUl.innerHTML = '';

    for (let todo of todos) {
        if (cond(todo)) {
            const li = document.createElement("li");
            const todoElem = create_todo(todo, delete_todo, update_state);

            li.append(todoElem);
            todoUl.append(li)
        };
    }

    update_items_left();
}

function update_items_left() {
    itemsLeft.innerText = `${todos.reduce((count, todo) => count += Number(!todo.checked), 0)} items left`;
}

document.addEventListener("keydown", event => {
    if (event.key == "Enter" && document.activeElement == addTodo) {
        const value = addTodo.value.trim();

        if (!value)
            return;
        
        add_todo(value);
    }
});

function create_todo(todo, remove, update) {
    const todoElem = document.createElement("div");
    const check = document.createElement("input");
    const label = document.createElement("label");
    const deleteTodo = document.createElement("button");

    todoElem.append(check);
    todoElem.append(label);
    todoElem.append(deleteTodo);

    todoElem.classList.add("todo");
    check.classList.add("check-todo");
    deleteTodo.classList.add("delete-todo");

    check.setAttribute("type", "checkbox");
    label.innerText = todo.value;
    check.checked = todo.checked;
    check.setAttribute("id", todo.id);
    label.setAttribute("for", todo.id);

    deleteTodo.innerText = "hi"

    deleteTodo.addEventListener("click", () => remove(todo.id));

    check.addEventListener("click", () => update(todo.id))

    return todoElem;
}