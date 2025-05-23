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

    // Pokud bylo kliknuto na tlačítko "Hotovo"
    if (item.classList.contains('complete-btn')) {
        const li = item.parentElement.parentElement; 
        li.classList.toggle('completed'); // Přepneme (toggle) třídu 'completed'
        saveTasks();
        filterTasks(); // Po změně stavu úkolu znovu aplikujeme filtr
    }
}

// Funkce pro smazání úkolu s animací
function deleteTask(e) {
    const item = e.target.closest('li');
    const trashCan = document.getElementById('animatedTrashCan');
    const taskList = document.getElementById('taskList');

    if (!item) return; // Pokud z nějakého důvodu nenajde li, nic nedělej

    // 1. Získáme přesné pozice a rozměry původního úkolu a koše
    const itemRect = item.getBoundingClientRect();
    const trashRect = trashCan.getBoundingClientRect();

    // 2. Vytvoříme klon úkolu pro animaci
    const animatedItem = item.cloneNode(true); // true = klonuje i děti (text a tlačítka)

    // 3. Nastavíme počáteční styly pro animovaný klon
    animatedItem.style.position = 'fixed';
    animatedItem.style.top = itemRect.top + 'px';
    animatedItem.style.left = itemRect.left + 'px';
    animatedItem.style.width = itemRect.width + 'px';
    animatedItem.style.height = itemRect.height + 'px';
    animatedItem.style.zIndex = '999'; // Bude nad ostatním obsahem, ale pod virtuálním košem
    animatedItem.style.opacity = '1';

    // 4. Přidáme transition vlastnosti na animovaný klon
    // Určujeme, které vlastnosti se budou animovat a jak dlouho
    animatedItem.style.transition = 'top 0.7s ease-in-out, left 0.7s ease-in-out, ' +
    'transform 0.7s ease-in-out, opacity 0.7s ease-in-out, ' +
    'width 0.7s ease-in-out, height 0.7s ease-in-out';

    // 5. Připojíme animovaný klon k body elementu
    document.body.appendChild(animatedItem);

    // 6. Okamžitě skryjeme původní úkol (aby nevypadal, že je dvakrát)
    item.style.opacity = '0';
    item.style.pointerEvents = 'none'; // Aby se nedalo kliknout na "mizející" úkol

    // 7. Spustíme animaci koše (aby se objevil uprostřed)
    trashCan.classList.add('active');

    // Důležité: Nucené překreslení prohlížeče.
    // Tím zajistíme, že prohlížeč aplikoval počáteční styly před spuštěním přechodu.
    void animatedItem.offsetWidth;

    // 8. Nastavíme CÍLOVÉ styly pro animovaný klon
    // Pro úkol, aby se přesunul a vycentroval nad košem
    // Vypočítáme cílové top/left tak, aby střed úkolu byl nad středem koše
    const targetLeft = trashRect.left + (trashRect.width / 2) - (itemRect.width / 2);
    const targetTop = trashRect.top + (trashRect.height / 2) - (itemRect.height / 2);

    animatedItem.style.left = targetLeft + 'px';
    animatedItem.style.top = targetTop + 'px';
    animatedItem.style.transform = 'scale(0.1)'; // Zmenší se na velmi malou velikost (téměř zmizí)
    animatedItem.style.opacity = '0'; // Zcela zmizí
    animatedItem.style.width = '0px'; // Zmenší šířku
    animatedItem.style.height = '0px'; // Zmenší výšku


    // 9. Po dokončení animace (po skončení transition) odstraníme elementy
    animatedItem.addEventListener('transitionend', () => {
        item.remove(); // Odstraní původní úkol ze seznamu
        animatedItem.remove(); // Odstraní animovaný klon
        trashCan.classList.remove('active'); // Skryje animovaný koš
        saveTasks(); // Uložíme aktuální stav seznamu úkolů
    }, { once: true }); // { once: true } zajistí, že event listener se spustí jen jednou
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

// Mazání úkolu
document.getElementById('taskList').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
        deleteTask(e);
    }
});

// Event listenery pro tlačítka filtrů
filterAllBtn.addEventListener('click', () => setActiveFilterButton(filterAllBtn));
filterPendingBtn.addEventListener('click', () => setActiveFilterButton(filterPendingBtn));
filterCompletedBtn.addEventListener('click', () => setActiveFilterButton(filterCompletedBtn));

// Při načtení stránky načteme úkoly
document.addEventListener('DOMContentLoaded', loadTasks);