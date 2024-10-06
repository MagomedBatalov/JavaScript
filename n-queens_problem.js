`use strict`

function calculateConflicts() {
  let conflicts = 0;
  for (let i = 0; i < queens.length; i++) {
    for (let j = i + 1; j < queens.length; j++) {
      if (queens[i] == queens[j]) {   
        conflicts++;
      }
      if (Math.abs(queens[i] - queens[j]) == Math.abs(i - j)) { 
        conflicts++;
      }
    }
  }
  return conflicts;
}

function simulatedAnnealing(queens) {
  let temperature = 100;
  let coolingRate = 0.000001; 
  let board = new Array(n).fill(null).map(() => new Array(n).fill(0)); 
  for (let i = 0; i < n; i++) {
    board[queens[i]][i] = 1;
  }
  let currentConflicts = calculateConflicts(queens);
  while (temperature > 1) {
    let row = Math.floor(Math.random() * n);
    let col = Math.floor(Math.random() * n);
    let oldCol = queens[row];
    queens[row] = col;
    let newConflicts = calculateConflicts(queens);
    if (newConflicts == 0) {
      break; 
    }
    if (newConflicts < currentConflicts) {
      board[oldCol][row] = 0;
      board[col][row] = 1;
      currentConflicts = newConflicts;
    } else {
      if (Math.random() < 1 / Math.exp((newConflicts - currentConflicts) / temperature)) {
        // console.log( Math.exp((newConflicts - currentConflicts) / temperature));
        board[oldCol][row] = 0;
        board[col][row] = 1;
        currentConflicts = newConflicts;
      } else {
        queens[row] = oldCol;
      }
    }
    temperature *= 1 - coolingRate;
  }
  return queens;
}

function isSafe(solutions) {
  let equal = 0;
  for (let i = 0; i < solutions.length; i++) {
    for (let j = 0; j < n; j++) {
      if (solutions[i][j] == queens[j]) {
        equal++;
      } else {
        break;
      }
    }
    if (equal == n) {
      return false;
    }else {
      equal = 0;
    }
  }
  return true;
}

function findAllSolutionsWithSimulatedAnnealing(solutions, queens, temperature) {
  let coolingRate = 0.01
  if (calculateConflicts(queens) == 0 && isSafe(solutions, queens)) {
    // console.log(` push    ${temperature}`);
    solutions.push([...queens]);
    findAllSolutionsWithSimulatedAnnealing(solutions, simulatedAnnealing(queens), temperature);
  } else if (temperature > 1) {
    // console.log(`not push ${temperature}`);
    temperature *= 1 - coolingRate;
    findAllSolutionsWithSimulatedAnnealing(solutions, simulatedAnnealing(queens), temperature);
  }
  return;
}

let temperature = 100;
const n = 9;
console.log(n);
let queens = new Array(n).fill(-1);


for (let i = 0; i < n; i++) {
  queens[i] = Math.floor(Math.random() * n);
}
console.log(queens);
// const solution = simulatedAnnealing(queens);
// console.log(solution);
// console.log(`Конфликты: ${calculateConflicts(solution)}`);
let solutions = [];

// findAllSolutionsWithSimulatedAnnealing(solutions, queens, temperature);
console.time('all solutions search time'); //замеряет начало отсчета времени
let res = simulatedAnnealing(queens);
console.timeEnd('all solutions search time'); // конец отсчета времени
console.log(queens);

console.log(calculateConflicts(res));
// const fs = require('fs');
// const path = require('path');
// const fileName = 'resultNumberTwo.txt';
// const filePath = path.join(__dirname, fileName);
// fs.writeFileSync(filePath, '');
// // записываем данные в файл
// fs.appendFileSync(filePath, `n = ${n}\n`);
// fs.appendFileSync(filePath, `Количество досок: ${solutions.length}\n`);
// for (let i = 0; i < solutions.length; i++) {
//   fs.appendFileSync(filePath, `${i+1}: {${solutions[i]}}\n`);
// }


/* 
  Описание кода:
  1. Генерируется рандомная доска n*n с n ферзями на ней
  2. Вызывается функция findAllSolutionsWithSimulatedAnnealing,
  в которую передается массив solutions, в котором будут содержаться 
  все возможные расстановки ферзей, которые не бьют друг друга.
  При помощи имитации отжига создается queens, которая поступает в 
  фунцкию findAllSolutionsWithSimulatedAnnealing. Далее идет проверка
  если на доске нет конфликтов и если ее нет в solutions, то queens 
  пушится в solutions, после чего мы снова вызываем функцию. 
      Иначе, если конфликты есть или если доска повторилась, то мы снова 
      вызываем функцию findAllSolutionsWithSimulatedAnnealing, но уже с
      каждым разом все реже и реже. Чтобы достичь максимального числа 
      неповторяющихся досок, в которых нет конфликтов.
    3. Проверяется



  Несколько вариантов реализации данной задачи:
    1 Как заполнить массив solution(Массив всех возможных расстановок)
      1.1 Пушить queens в solutions при помощи алгоритма отжига
      1.2 Пушить queens в solutions до тех пор, пока хотя бы одна пара queens не повторится
    2 Какие queens пушить в solution?
      2.1 Каждый раз генерировать рандомную доску, при вызове алгоритма отжига
      2.2 Передать через параметры уже одну и ту же доску и переставлять на ней ферзи (можно попробовать в сочетании в пунтом 1.1)
    3 Если взять одну доску queens и в дальнейшем менять ферзри только на ней, вместо того, что генерировать каждый
      раз новую доску и тратить на это уйму времени, и запушить ее в findAllSolutionsWithSimulatedAnnealing
      то можно не только сэкономить время, но и найти бОльшее количество досок. Если не получиться найти больше досок, 
      но время сэкономлено, то можно увелечить параметр температуры, или уменьшить coolingRate в findAllSolutionsWithSimulatedAnnealing
*/



/*
[1,3,0,2,4]
[0,2,4,1,3]
[4,2,0,3,1]
[3,0,2,4,1]
[4,1,3,0,2]
[1,4,2,0,3]
[2,4,1,3,0]
[2,0,3,1,4]
[0,3,1,4,2]
[3,1,4,2,0]
Количество досок: 10 */
