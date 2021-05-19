'use strict';
//Получаем все элементы страницы
let addButton = document.getElementById('addTaskButton');
let selectPriority = document.getElementById('createTaskPriority');
let selectPriorityFilter = document.getElementById('selectPriorityFilter');
let textfield = document.getElementById('TextField');
let tasksBlock = document.querySelector('._Tasks');
let TasksCards;
let CheckMark;
let filterStatusActive = document.getElementById('FilterCheckBoxActive');
let filterStatusDone = document.getElementById('FilterCheckBoxDone');
let tasks = []; //Массив задач


function Update(){
CheckMark = document.querySelectorAll('.TaskBlockCardDone');
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
    FormatMinutes(){
        if (this.date.getMinutes() > 9) {
            return this.date.getMinutes();
        }
        else{
            switch (this.date.getMinutes()){
                case 0:
                    return '00';
                    break;
                case 1:
                    return '01';
                    break;
                case 2:
                    return '02';
                    break;
                case 3:
                    return '03';
                    break;
                case 4:
                    return '04';
                    break;
                case 5:
                    return '05';
                    break;
                case 6:
                    return '06';
                    break;
                case 7:
                    return '07';
                    break;
                case 8:
                    return '08';
                    break;
                case 9:
                    return '09';
                    break;
            }
        }
    }
    Draw() {
        tasksBlock.insertAdjacentHTML('afterbegin', this.generateHTML());
        Update();


    }

    getData(){
        return `${this.date.getDate()}.${this.date.getMonth() + 1}.${this.date.getFullYear()} `;
    }
    getTime(){
        return `${this.date.getHours()}:${this.FormatMinutes()}`;
    }
//функция получения даты
    //функция получения времени (резалт обеих юзать в отрисовке)
    generateHTML() {
        return ` <section class="TaskBlock" id="${this.id}"> 
                <p class="TaskBlockPriority ${this.priorityColor()}">${this.convertPriority()}</p>
                <section class="TaskBlockCard"><div class="TaskBlockCardTop">${this.text} <div class="TaskBlockCardDone">&#10004;</div></div>
                <p class="TaskBlockCardTime">${this.getData()} ${this.getTime()}</p></section>
                <aside class="deleteTask"><img src="image/delete.svg" alt="delete" style="height: 8vh"></aside>
               </section>`
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
    priorityColor(){
        switch (this.priority){
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

    takingUserPriority(){
        switch (this.priority){
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
//Получение всех элементов задач
    //Фильтр по приоритету
    PriorityFilter(){
        //Получаем все критерии фильтров

        let filter = 'Anyone';
        filter = this.takingUserPriority();
        if(filterStatusDone.checked == false && filterStatusActive.checked == false){
        }
       else if ((this.takingUserPriority() == selectPriorityFilter.value || selectPriorityFilter.value == 'Anyone') && ((this.done == filterStatusDone.checked) || (this.active == filterStatusActive.checked))){
            this.Draw();
        }

    }
        //Выполнение задачи
    Done(){

    }



}

addButton.addEventListener('click', function () {
    let priority = selectPriority.value;
    let text = textfield.value;
    let id = Math.round(Math.random() * 10000000);
    let task = new Task(priority, text, id);
    tasks.push(task);
    task.Draw();
    Update();

});

selectPriorityFilter.addEventListener('change', function (){
    while (tasksBlock.firstChild) {
        tasksBlock.removeChild(tasksBlock.firstChild);
    }
     TasksCards = document.querySelectorAll('.TaskBlock');
    for (let i = 0; i < tasks.length; i++){
        tasks[i].PriorityFilter();
    }
});
filterStatusActive.addEventListener('change', function (){
    while (tasksBlock.firstChild) {
        tasksBlock.removeChild(tasksBlock.firstChild);
    }
    for (let i = 0; i < tasks.length; i++){
        tasks[i].PriorityFilter();
    }

})
filterStatusDone.addEventListener('change', function (){
    while (tasksBlock.firstChild) {
        tasksBlock.removeChild(tasksBlock.firstChild);
    }
    for (let i = 0; i < tasks.length; i++){
        tasks[i].PriorityFilter();
    }

})






console.log(tasks);





