document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById('task-input');
    const addtaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const taskContainer = document.querySelector('.Tasks-Container');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const motivationalQuote = document.getElementById('motivational-quote');
    const STORAGE_KEY = 'todoTasks';

    const quotes = [
        "Every task completed is progress!",
        "You're doing great! Keep going!",
        "One step at a time, you got this!",
        "Believe in yourself and your tasks!",
        "Today's efforts are tomorrow's success!",
        "Focus on the goal, not the obstacles!",
        "You are capable of amazing things!",
        "Don't wait for the perfect moment, take action now!",
        "Consistency is key to success!",
        "Finish strong, you're almost there!"
    ];

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    function loadTasks() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const tasks = JSON.parse(saved);
            tasks.forEach(task => {
                createTaskElement(task.text, task.completed);
            });
        }
    }

    function updateTaskContainer() {
        taskContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    }

    function updateProgressBar() {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('li.completed').length;
        const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        
        progressFill.style.width = progress + '%';
        progressText.textContent = `${completedTasks}/${totalTasks} tasks completed`;
        
        // Update motivational quote
        if (totalTasks === 0) {
            motivationalQuote.textContent = "Start your day with a task!";
        } else if (completedTasks === totalTasks) {
            motivationalQuote.textContent = "🎉 All tasks completed! Fantastic work!";
        } else {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            motivationalQuote.textContent = randomQuote;
        }
    }

    function createTaskElement(taskText, isCompleted = false) {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''}>
            <span>${taskText}</span>
            <div class="task-buttons">
            <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
            `;

        if (isCompleted) {
            li.classList.add('completed');
        }

        const checkbox = li.querySelector('.task-checkbox');
        const editBtn = li.querySelector('.edit-btn');

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.style.disabled = isChecked;
            editBtn.style.opacity = isChecked ? 0.5 : 1;
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            saveTasks();
            updateProgressBar();
        });

        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                updateTaskContainer();
                saveTasks();
            }
        });

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            li.remove();
            updateTaskContainer();
            updateProgressBar();
            saveTasks();
        });

        taskList.appendChild(li);
        updateTaskContainer();
    }

    function addTask(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (!taskText) {
            return;
        }
        createTaskElement(taskText);
        saveTasks();
        taskInput.value = '';
        updateProgressBar();
    }

    addtaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
            addTask(e);
        }
    });

    loadTasks();
    updateProgressBar();
});
