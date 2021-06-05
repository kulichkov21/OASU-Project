'use strict';
//Получаем все элементы страницы
let addButton = document.getElementById('addTaskButton');
let selectPriority = document.getElementById('createTaskPriority');
let selectPriorityFilter = document.getElementById('selectPriorityFilter');
let textfield = document.getElementById('TextField');
let tasksBlock = document.querySelector('._Tasks');
let TasksCards;
let CheckMark;
let ReturnMark;
let DeleteBox;
let TaskBlockCardTop;
let TaskBlockCardText;
let SortByPriority = document.getElementById('SortPrior');
let SortByDate = document.getElementById('SortData');
let filterStatusActive = document.getElementById('FilterCheckBoxActive');
let filterStatusDone = document.getElementById('FilterCheckBoxDone');
let searchText = document.getElementById('searchtext');
let tasks = []; //Массив задач
const RequestLink = 'http://localhost:3000/items';
sendRequest('GET', RequestLink)
    .then(function (data){
     for (let i = 0; i < data.length; i++){
         tasks[i] = new Task(data[i].priority, data[i].text, data[i].id, data[i].active, data[i].done, data[i].date);
         tasks[i].Draw();
     }
        Clean();
        Recheck();
        Update();
    })

function sendRequest(method, url, body = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.send(JSON.stringify(body));
    })
}

//sendRequest('GET', RequestLink)
//.then(data => console.log(data))


//Очищаем все блоки с задачами
function Clean() {
    while (tasksBlock.firstChild) {
        tasksBlock.removeChild(tasksBlock.firstChild);
    }
}

//Делаем проверку по сортировкам и фильтрам
function Recheck() {
    if (tasks[0]) {
        tasks[0].Sort();
    }
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].PriorityFilter();
    }
}

//Обновляем список элементов, которым нужны слушатели событий
function Update() {
    CheckMark = [];
    CheckMark = document.querySelectorAll('.TaskBlockCardDone');
    DeleteBox = document.querySelectorAll('.deleteTask');
    TaskBlockCardTop = document.querySelectorAll('.TaskBlockCardTop');
    TaskBlockCardText = document.querySelectorAll('.TaskBlockCardText');
    ReturnMark = document.querySelectorAll('.TaskBlockCardReverse');
}

//Создаём функцию-конструктор объекта задач
class Task {
    constructor(priority, text, id, active, done, date) {
        this.priority = priority;
        this.text = text;
        this.id = id;
        this.active = active;
        this.done = done;
        this.date = new Date();
    }

//Форматируем время для отрисовки
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
            CheckMark[0].addEventListener('click', function (event) {
                    event.target.parentNode.parentNode.classList.add('greenTask');
                    for (let task of tasks) {
                        if (task.id == event.target.parentNode.parentNode.parentNode.id) {
                            task.Done();
                            sendRequest('PUT', `${RequestLink}/${task.id}`, task)
                               .then(function (data){
                                   task.done = data.done;
                                   task.active = data.active;
                                })
                        }
                        else {
                        }
                    }
                    event.target.parentNode.removeChild(event.target);
                Clean();
                Recheck();
                Update();

                }
            )
        }
        if (ReturnMark[0]){
            ReturnMark[0].addEventListener('click', function (event) {
                event.target.parentNode.parentNode.classList.remove('greenTask');
                for (let task of tasks) {
                    if (task.id == event.target.parentNode.parentNode.parentNode.id) {
                        task.Return();
                        sendRequest('PUT', `${RequestLink}/${task.id}`, task)
                        
                    }
                }
                Clean();
                Recheck();
                Update();
            })
        }
        if (DeleteBox[0]) {
            DeleteBox[0].addEventListener('click', function (event) {
                let check = confirm('Вы уверены?');
                if (check) {
                    event.target.parentNode.parentNode.style.display = 'none';
                    for (let i = 0; i < tasks.length; i++) {
                        if (tasks[i].id == event.target.parentNode.parentNode.id) {
                            sendRequest('DELETE', `${RequestLink}/${tasks[i].id}`, tasks[i])
                                .then(function (){
                                   alert('Задача удалена')
                                })
                            tasks.splice(i, 1);
                        }
                    }
                }
            })
        }
        if (TaskBlockCardText[0]) {
            TaskBlockCardText[0].addEventListener('click', function (event) {
                if (event.target.parentNode.lastChild.className == 'TaskBlockCardDone') {
                    let text = event.target.textContent;
                    event.target.innerHTML = `<input type="text" value="${text}" class="editText">`;
                    let editBlock = document.getElementsByClassName('editText');
                    editBlock[0].addEventListener('contextmenu', function (event) {
                        event.preventDefault();
                        for (let i = 0; i < tasks.length; i++) {
                            if (tasks[i].id == event.target.parentNode.parentNode.parentNode.parentNode.id) {
                                tasks[i].text = editBlock[0].value;
                                sendRequest('PUT', `${RequestLink}/${tasks[i].id}`, tasks[i])
                                    .then(function (data){

                                    })
                                event.target.parentNode.innerHTML = `<div className="TaskBlockCardText">${tasks[i].text}</div>`
                            }
                        }
                    })
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
                <section class="TaskBlockCard greenTask"><div class="TaskBlockCardTop">${this.text} <div class="TaskBlockCardReverse">&#10062</div></div> 
                <p class="TaskBlockCardTime">${this.getData()}</p></section>
                <aside class="deleteTask"><img src="image/delete.svg" alt="delete" style="height: 8vh"></aside>
               </section>`
        } else {
            return ` <section class="TaskBlock" id="${this.id}"> 
                <p class="TaskBlockPriority ${this.priorityColor()}">${this.convertPriority()}</p>
                <section class="TaskBlockCard"><div class="TaskBlockCardTop"><div class="TaskBlockCardText">${this.text}</div> <div class="TaskBlockCardDone">&#10004</div></div>
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
        if (SortByPriority.classList.contains('__SortActive')) {
            if (SortByPriority.classList.contains('_SortPriorUp')) {
                tasks.sort((a, b) => a.priority > b.priority ? 1 : -1);
            } else {
                tasks.sort((a, b) => a.priority < b.priority ? 1 : -1);
            }
        } else {
            if (SortByDate.classList.contains('_SortDataUp')) {
                tasks.sort((a, b) => a.date > b.date ? 1 : -1);
            } else {
                tasks.sort((a, b) => a.date < b.date ? 1 : -1);
            }
        }
    }

//Получение всех элементов задач
    //Фильтр по приоритету
    PriorityFilter() {
        //Получаем все критерии фильтров
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

    Return() {
        this.done = false;
        this.active = true;
    }

    //Поиск по тексту
    Find() {
        let find = new RegExp(searchText.value, 'gi');
        for (let i = 0; i < TaskBlockCardTop.length; i++) {
            if (!find.test(TaskBlockCardTop[i].textContent)) {
                TaskBlockCardTop[i].parentNode.parentNode.style.display = 'none';
            } else if (find.test(TaskBlockCardTop[i].textContent)) {
                TaskBlockCardTop[i].parentNode.parentNode.style.display = 'flex';
            }
        }
    }
}

addButton.addEventListener('click', function () {
    if (textfield.value) {
        let priority = selectPriority.value;
        let text = textfield.value;
        let id = null; //Math.round(Math.random() * 10000000); //=null;
        let task = new Task(priority, text, id, true, false);
        tasks.push(task);
        sendRequest('POST', RequestLink, tasks[tasks.length - 1])
            .then(function (data){
                task.id = data.id;
            })
        Clean();
        Recheck();
        Update();
    } else {
        alert('Вы забыли ввести текст задачи.')
    }
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
    if (SortByPriority.classList.contains('_SortPriorUp')) {
        SortByPriority.classList.remove('_SortPriorUp');
        SortByPriority.classList.add('_SortPriorDown');
    } else {
        SortByPriority.classList.remove('_SortPriorDown');
        SortByPriority.classList.add('_SortPriorUp');
    }
    ;
    Clean();
    Recheck();
    Update();
});
SortByDate.addEventListener('click', function () {
    if (!SortByDate.classList.contains('__SortActive')) {
        SortByDate.classList.add('__SortActive');
        SortByPriority.classList.remove('__SortActive');
    }
    if (SortByDate.classList.contains('_SortDataUp')) {
        SortByDate.classList.remove('_SortDataUp');
        SortByDate.classList.add('_SortDataDown');
    } else {
        SortByDate.classList.remove('_SortDataDown');
        SortByDate.classList.add('_SortDataUp');
    }
    Clean();
    Recheck();
    Update();
});

searchText.addEventListener('input', function () {
    TaskBlockCardTop = document.querySelectorAll('.TaskBlockCardTop');
    if (tasks[0]) {
        tasks[0].Find();
    }
})






