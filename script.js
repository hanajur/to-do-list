// Získáme odkazy na HTML elementy, se kterými budeme pracovat
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Nové odkazy na tlačítka filtrů
const filterAllBtn = document.getElementById('filterAll');
const filterPendingBtn = document.getElementById('filterPending');
const filterCompletedBtn = document.getElementById('filterCompleted');
const filterButtons = document.querySelectorAll('.filters button'); // Získáme všechna tlačítka filtrů

// Funkce pro přidání nového úkolu
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Prosím, zadejte úkol!');
        return;
    }

    // Vytvoříme nový 'li' element pro úkol
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${taskText}</span>
        <div>
            <button class="complete-btn"><i class="fas fa-check"></i></button>
            <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
        </div>
    `;

    // Přidáme nový 'li' element do seznamu úkolů
    taskList.appendChild(li);

    // Vyčistíme vstupní pole po přidání úkolu
    taskInput.value = '';

    // Uložíme úkoly do lokálního úložiště
    saveTasks();
    // A po přidání úkolu ihned aplikujeme aktuální filtr
    filterTasks();
}

// Funkce pro označení úkolu jako hotového nebo jeho smazání
function handleTaskAction(e) {
    const item = e.target; // Element, na který bylo kliknuto

    // Pokud bylo kliknuto na tlačítko "Smazat"
    if (item.classList.contains('delete-btn')) {
        const li = item.parentElement.parentElement; // Získáme rodičovský 'li' element
        li.remove(); // Odstraníme úkol ze seznamu
        saveTasks(); 
        filterTasks(); // Po smazání úkolu znovu aplikujeme filtr
    }

    // Pokud bylo kliknuto na tlačítko "Hotovo"
    if (item.classList.contains('complete-btn')) {
        const li = item.parentElement.parentElement; 
        li.classList.toggle('completed'); // Přepneme (toggle) třídu 'completed'
        saveTasks();
        filterTasks(); // Po změně stavu úkolu znovu aplikujeme filtr
    }
}

// filtrování úkolů
function filterTasks() {
    const tasks = taskList.children; // Získáme všechny 'li' elementy v seznamu úkolů
    let currentFilter = document.querySelector('.filters button.active').id; // Zjistíme, který filtr je aktivní

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const isCompleted = task.classList.contains('completed'); // Zjistíme, zda má úkol třídu 'completed'

        switch (currentFilter) {
            case 'filterAll':
                task.style.display = 'flex'; // Zobrazit všechny úkoly
                break;
            case 'filterPending':
                if (isCompleted) {
                    task.style.display = 'none'; // Skrýt hotové úkoly
                } else {
                    task.style.display = 'flex'; // Zobrazit nesplněné úkoly
                }
                break;
            case 'filterCompleted':
                if (isCompleted) {
                    task.style.display = 'flex'; // Zobrazit hotové úkoly
                } else {
                    task.style.display = 'none'; // Skrýt nesplněné úkoly
                }
                break;
        }
    }
}

// Nastavení aktivního tlačítka filtru
function setActiveFilterButton(selectedButton) {
    // Odebereme třídu 'active' ze všech tlačítek filtrů
    filterButtons.forEach(button => {
        button.classList.remove('active');
    });
    // Přidáme třídu 'active' k vybranému tlačítku
    selectedButton.classList.add('active');
    filterTasks();
}


// Funkce pro uložení úkolů do lokálního úložiště prohlížeče
function saveTasks() {
    localStorage.setItem('tasks', taskList.innerHTML);
}

// Funkce pro načtení úkolů z lokálního úložiště
function loadTasks() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
        taskList.innerHTML = tasks;
    }
    // Po načtení úkolů aplikujeme výchozí filtr (All)
    filterTasks();
}

// Přiřazení událostí (event listeners)

// Při kliknutí na tlačítko "Přidat úkol" zavoláme funkci addTask
addTaskBtn.addEventListener('click', addTask);

// Při stisknutí klávesy Enter ve vstupním poli zavoláme funkci addTask
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Při kliknutí kdekoli v seznamu úkolů zavoláme funkci handleTaskAction
taskList.addEventListener('click', handleTaskAction);


// Event listenery pro tlačítka filtrů
filterAllBtn.addEventListener('click', () => setActiveFilterButton(filterAllBtn));
filterPendingBtn.addEventListener('click', () => setActiveFilterButton(filterPendingBtn));
filterCompletedBtn.addEventListener('click', () => setActiveFilterButton(filterCompletedBtn));

// Při načtení stránky načteme úkoly
document.addEventListener('DOMContentLoaded', loadTasks);