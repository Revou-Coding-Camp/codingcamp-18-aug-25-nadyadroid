document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const dateInput = document.getElementById('date-input');
    const todoList = document.getElementById('todo-list');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    // Initial render
    renderTodos();

    // Event Listeners
    todoForm.addEventListener('submit', addTodo);
    todoList.addEventListener('click', handleTodoActions);
    filterButtons.forEach(button => {
        button.addEventListener('click', setFilter);
    });

    // Functions

    function addTodo(event) {
        event.preventDefault();

        const taskText = todoInput.value.trim();
        const taskDate = dateInput.value;

        if (taskText === '') {
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: taskText,
            date: taskDate,
            completed: false,
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();

        // Clear inputs
        todoInput.value = '';
        dateInput.value = '';
    }

    function handleTodoActions(event) {
        const target = event.target;
        const listItem = target.closest('.todo-item');
        if (!listItem) return;

        const todoId = parseInt(listItem.dataset.id);

        if (target.classList.contains('btn-delete')) {
            deleteTodo(todoId);
        } else if (target.classList.contains('todo-content') || target.closest('.todo-content')) {
            toggleComplete(todoId);
        }
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }

    function toggleComplete(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                todo.completed = !todo.completed;
            }
            return todo;
        });
        saveTodos();
        renderTodos();
    }

    function setFilter(event) {
        const target = event.target;
        currentFilter = target.dataset.filter;

        // Update active class on buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');

        renderTodos();
    }

    function renderTodos() {
        todoList.innerHTML = '';

        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'complete') {
                return todo.completed;
            } else if (currentFilter === 'incomplete') {
                return !todo.completed;
            } else {
                return true;
            }
        });

        if (filteredTodos.length === 0) {
            const noItemsMessage = document.createElement('li');
            noItemsMessage.textContent = 'No tasks found.';
            noItemsMessage.style.textAlign = 'center';
            noItemsMessage.style.color = '#bdc3c7';
            noItemsMessage.style.listStyle = 'none';
            todoList.appendChild(noItemsMessage);
            return;
        }

        filteredTodos.forEach(todo => {
            const listItem = document.createElement('li');
            listItem.className = `todo-item ${todo.completed ? 'complete' : ''}`;
            listItem.dataset.id = todo.id;

            const dateText = todo.date ? new Date(todo.date).toLocaleDateString() : 'No date';

            listItem.innerHTML = `
                <div class="todo-content">
                    <span class="text">${todo.text}</span>
                    <span class="date">${dateText}</span>
                </div>
                <button class="btn-delete">Delete</button>
            `;

            todoList.appendChild(listItem);
        });
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
});