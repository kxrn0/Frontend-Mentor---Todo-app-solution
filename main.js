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
let todos, state, lis;

/**
 * [] fix the bug that happens when one task is deleted, and it shows all other tasks on different modes
 */

todos = [];
lis = [];
state = states.all;

let byme = ["one", "two", "three", "four", "five"];

for (let i = 0; i < byme.length; i++)
    add_todo(byme[i]);

todoUl.addEventListener("dragover", event => {
    event.preventDefault();

    const dragger = document.querySelector(".dragging");
    const afterElement = compute_after_element(todoUl, event.clientY); 

    if (afterElement === null) {
        todoUl.append(dragger);
    }
    else {
        todoUl.insertBefore(dragger, afterElement);
    }
});

function compute_after_element(container, y) {
    const draggables = [...container.querySelectorAll("li:not(.dragging)")];

    return draggables.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset  < 0 && offset > closest.offset)
            return {offset, element: child};
        return closest;
    }, {offset: Number.NEGATIVE_INFINITY}).element;
}

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
    lis = [];

    for (let todo of todos) {
        if (cond(todo)) {
            const li = document.createElement("li");
            const todoElem = create_todo(todo, delete_todo, update_state);

            lis.push(li);
            li.setAttribute("draggable", true);
            li.append(todoElem);
            todoUl.append(li)
        };
    }

    lis.forEach(li => {
        li.addEventListener("dragstart", () => li.classList.add("dragging"))

        li.addEventListener("dragend", () => li.classList.remove("dragging"));
    });

    update_items_left();
    if (checked.checked)
        checked.checked = false;
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
    const wrapper = document.createElement("div");
    const deleteTodo = document.createElement("button");

    wrapper.append(check);
    wrapper.append(label);
    todoElem.append(wrapper);
    todoElem.append(deleteTodo);

    todoElem.classList.add("todo");
    check.classList.add("check-todo");
    deleteTodo.classList.add("delete-todo");
    wrapper.classList.add("wrapper");

    check.setAttribute("type", "checkbox");
    label.innerText = todo.value;
    check.checked = todo.checked;
    check.setAttribute("id", todo.id);
    label.setAttribute("for", todo.id);

    deleteTodo.addEventListener("click", () => remove(todo.id));

    check.addEventListener("click", () => update(todo.id))

    return todoElem;
}

//--------------------------------------------------------------------
const root = document.documentElement;
const themeCheck = document.querySelector(".header .content .top input[type='checkbox']");

root.className = "light";

themeCheck.addEventListener("click", () => {
    if (themeCheck.checked)
        root.className = "dark";
    else
        root.className = "light";
});