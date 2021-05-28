'use strict';
//Получаем все элементы страницы
let addButton = document.getElementById('addTaskButton');
let selectPriority = document.getElementById('createTaskPriority');
let selectPriorityFilter = document.getElementById('selectPriorityFilter');
let textfield = document.getElementById('TextField');
let tasksBlock = document.querySelector('._Tasks');
let TasksCards;
let CheckMark;
let DeleteBox;
let SortByPriority = document.getElementById('SortPrior');
let SortByDate = document.getElementById('SortData');
let filterStatusActive = document.getElementById('FilterCheckBoxActive');
let filterStatusDone = document.getElementById('FilterCheckBoxDone');
let tasks = []; //Массив задач

function Clean() {
    while (tasksBlock.firstChild) {
        tasksBlock.removeChild(tasksBlock.firstChild);
    }
}

function Recheck() {
    if (tasks[0]){
        tasks[0].Sort();
    }
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].PriorityFilter();
    }
}

function Update() {
    CheckMark = [];
    CheckMark = document.querySelectorAll('.TaskBlockCardDone');
    DeleteBox = document.querySelectorAll('.deleteTask');
}

//Создаём функцию-конструктор объекта задач
class Task {
    constructor(priority, text, id) {
        this.priority = priority;
        this.text = text;
        this.id = id;
        this.active = true;
        this.done = false;
        this.date = new Date();
    }

    FormatMinutes() {
        if (this.date.getMinutes() > 9) {
            return this.date.getMinutes();
        } else {
            return '0' + this.date.getMinutes()
        }
    }

    Draw() {
        tasksBlock.insertAdjacentHTML('afterbegin', this.generateHTML());
        Update();
        if (CheckMark[0]) {
            CheckMark[0].addEventListener('click', function () {
                    event.target.parentNode.parentNode.classList.add('greenTask');
                    event.target.style.display = 'none';
                    for (let task of tasks) {
                        if (task.id == event.target.parentNode.parentNode.parentNode.id) {
                            task.Done();
                        }
                    }
                }
            )
        }
        if (DeleteBox[0]) {
            DeleteBox[0].addEventListener('click', function () {
                event.target.parentNode.parentNode.style.display = 'none';
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].id == event.target.parentNode.parentNode.id) {
                        tasks.splice(i, 1);
                    }
                }
            })
        }
    }

    getData() {
        return `${this.date.getDate()}.${this.date.getMonth() + 1}.${this.date.getFullYear()} ${this.date.getHours()}:${this.FormatMinutes()}`;
    }

//функция получения даты
    //функция получения времени (резалт обеих юзать в отрисовке)
    generateHTML() {
        if (this.done) {
            return ` <section class="TaskBlock" id="${this.id}"> 
                <p class="TaskBlockPriority ${this.priorityColor()}">${this.convertPriority()}</p>
                <section class="TaskBlockCard greenTask"><div class="TaskBlockCardTop">${this.text}</div>
                <p class="TaskBlockCardTime">${this.getData()}</p></section>
                <aside class="deleteTask"><img src="image/delete.svg" alt="delete" style="height: 8vh"></aside>
               </section>`
        } else {
            return ` <section class="TaskBlock" id="${this.id}"> 
                <p class="TaskBlockPriority ${this.priorityColor()}">${this.convertPriority()}</p>
                <section class="TaskBlockCard"><div class="TaskBlockCardTop">${this.text} <div class="TaskBlockCardDone">&#10004</div></div>
                <p class="TaskBlockCardTime">${this.getData()}</p></section>
                <aside class="deleteTask"><img src="image/delete.svg" alt="delete" style="height: 8vh"></aside>
               </section>`
        }
    }

    convertPriority() {
        switch (this.priority) {
            case '1':
                return 'Низкий';
                break;
            case '2':
                return 'Средний';
                break;
            case '3':
                return 'Высокий';
                break;
        }
    }

    priorityColor() {
        switch (this.priority) {
            case '1':
                return 'redPriority';
                break;
            case '2':
                return 'yellowPriority';
                break;
            case '3':
                return 'greenPriority';
                break;
        }
    }

    takingUserPriority() {
        switch (this.priority) {
            case '1':
                return 'Low';
                break;
            case '2':
                return 'Middle';
                break;
            case '3':
                return 'High';
                break;
        }
    }

    Sort() {
       if (SortByPriority.classList.contains('__SortActive')){
           if (SortByPriority.classList.contains('_SortPriorUp')){
               tasks.sort((a, b) => a.priority > b.priority ? 1 : -1);
           }
           else {
               tasks.sort((a, b) => a.priority < b.priority ? 1 : -1);
           }
       }
       else{
           if (SortByDate.classList.contains('_SortDataUp')){
               tasks.sort((a, b) => a.date > b.date ? 1 : -1);
           }
           else {
               tasks.sort((a, b) => a.date < b.date ? 1 : -1);
           }
       }
    }

//Получение всех элементов задач
    //Фильтр по приоритету
    PriorityFilter() {
        //Получаем все критерии фильтров
        this.Sort()
        let filter = 'Anyone';
        filter = this.takingUserPriority();
        if (!filterStatusDone.checked && !filterStatusActive.checked) {
        } else if ((this.takingUserPriority() == selectPriorityFilter.value || selectPriorityFilter.value == 'Anyone') && ((this.done == filterStatusDone.checked) || (this.active == filterStatusActive.checked))) {
            this.Draw();
        }

    }

    //Выполнение задачи
    Done() {
        this.done = true;
        this.active = false;
    }
}

addButton.addEventListener('click', function () {
    let priority = selectPriority.value;
    let text = textfield.value;
    let id = Math.round(Math.random() * 10000000);
    let task = new Task(priority, text, id);
    tasks.push(task);
    Clean();
    Recheck();
    Update();
});

selectPriorityFilter.addEventListener('change', function () {
    Clean();
    Update();
    TasksCards = document.querySelectorAll('.TaskBlock');
    Recheck();
});

filterStatusActive.addEventListener('change', function () {
    Clean();
    Recheck();
    Update();
});

filterStatusDone.addEventListener('change', function () {
    Clean();
    Recheck();
    Update();
});

SortByPriority.addEventListener('click', function () {
    if (!SortByPriority.classList.contains('__SortActive')) {
        SortByPriority.classList.add('__SortActive');
        SortByDate.classList.remove('__SortActive');
    }
    if (SortByPriority.classList.contains('_SortPriorUp')){
        SortByPriority.classList.remove('_SortPriorUp');
        SortByPriority.classList.add('_SortPriorDown');
    }
    else {
        SortByPriority.classList.remove('_SortPriorDown');
        SortByPriority.classList.add('_SortPriorUp');
    };
    Clean();
    Recheck();
    Update();
});
SortByDate.addEventListener('click', function () {
    if (!SortByDate.classList.contains('__SortActive')) {
        SortByDate.classList.add('__SortActive');
        SortByPriority.classList.remove('__SortActive');
    }
    if (SortByDate.classList.contains('_SortDataUp')){
        SortByDate.classList.remove('_SortDataUp');
        SortByDate.classList.add('_SortDataDown');
    }
    else {
        SortByDate.classList.remove('_SortDataDown');
        SortByDate.classList.add('_SortDataUp');
    }
    Clean();
    Recheck();
    Update();
});


console.log(tasks);





