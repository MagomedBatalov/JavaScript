

`use strict`

function calculateProbability(currentCity, unvisitedCities) { // функция которая считает веротяность перехода из текущего города во всей остальные 
  const probabilities = []; // Массив вероятностей для текущего города
  let total = 0;

  for (let city of unvisitedCities) {    // считает знаменатель формулы вероятности перехода из текущего города в следующий
      const probability = Math.pow(pheromones[currentCity][city], alpha) * Math.pow(1 / cities[currentCity][city], beta);
      probabilities.push({ city, probability });
      total += probability;
  }
  for (let prob of probabilities) {  // делит числитель на знаменятель - тем самым заполняет таблицу вероятностей перехода их текущего города в следующий
      prob.probability /= total;
  }
  return probabilities; // возвращает массив вероятностей для текущего города
}

function print(arg) {
  console.log(arg);
}

function antColonyOptimization() {
  const antTours = []
  for (let iteration = 0; iteration < numIterations; iteration++) {                                   // Количество итераций
    for (let ant = 0; ant < numAnts; ant++) {                                      //одна итерация - один поход муравья
      let currentCity = Math.floor(Math.random() * n);
      let unvisitedCities = [...Array(n).keys()].filter(city => city !== currentCity);
      let tour = [currentCity];
      while (unvisitedCities.length > 0) {
        const probabilities = calculateProbability(currentCity, unvisitedCities); // массив вероятностей для текущего города
        const nextCity = probabilities.reduce((prev, curr) => prev.probability > curr.probability ? prev : curr).city; //возвращает город с наибольшей вроятностью
        tour.push(nextCity); //добавляет посещенный город
        unvisitedCities = unvisitedCities.filter(city => city !== nextCity); //обновляет список непосещенных городов
        currentCity = nextCity; // меняет текущий город на последний добавленный
      }
      antTours.push(tour);
    }
    for (let i = 0; i < antTours[iteration].length - 1; i++) { 
      pheromones[antTours[iteration][i]][antTours[iteration][i + 1]] += (Q / cities[antTours[iteration][i]][antTours[iteration][i + 1]]); // Добавление феромонов в зависимотсти от близости города, после похода одного муравья
      pheromones[antTours[iteration][i + 1]][antTours[iteration][i]] += (Q / cities[antTours[iteration][i]][antTours[iteration][i + 1]]); // в силу симмметричности, также дублируем это значение
    }
    //  Обновляем феромоны, после того, как все муравьи обошли все города и расставили феромонов
    // Испарение феромонов после походов всех муравьев
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        pheromones[i][j] *= evaporationRate;
      }
    }
    graphToFile(antTours[iteration], iteration);
    // console.log('bingo');
  }
  //Находим лучший путь
  let bestTourLength = Infinity;
  let bestTour;
  for (let i = Math.ceil( antTours.length / 2); i < antTours.length; i++) {
    let tourLength = 0;
    for (let j = 0; j < n - 1; j++) {
      if (j != n) {
        tourLength += cities[antTours[i][j]][antTours[i][j + 1]];
      } else {
        tourLength += cities[antTours[i][0]][antTours[i][antTours[i].length - 1]];
      }
    }
    if (tourLength < bestTourLength) {
      bestTourLength = tourLength;
      bestTour = antTours[i];
    }
  }
  return bestTour;
}

function spotChek(city1, city2, road) {
  const n = road.length - 2;
  let idx = road.indexOf(city1);
  let nextIdx = idx + 1;
  let previousIdx = idx - 1;
  if (idx < 0) { return false; }
  return (road[nextIdx] == city2) || (road[previousIdx] == city2) || (road[n] == city1 && road[0] == city2) || (road[n] == city2 && road[0] == city1);
}

function salesmanProblemResult(resultRoad) {
  const radius = 100*n;
  let graph = [];
  const path = require('path');
  const fs = require('fs');
  const fileNameGraph = `salesmanProblemResult.graph`;
  const filePath = path.join(__dirname, fileNameGraph);
  fs.writeFileSync(filePath, '');
  // записываем данные в файл
  //let data = fs.readFileSync(filePath, 'utf8');
  //data = data.slice(0, -1);
  fs.appendFileSync(filePath, `{"x0":-270,"y0":-20,"vertices":[`);
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 / n) * i;
    fs.appendFileSync(filePath, `{"x":${Math.round(radius * Math.cos(angle))},"y":${Math.round(radius * Math.sin(angle))},"name":"${resultRoad[i]}","radius":${n * Math.PI},"background":"#ffffff","fontSize":${radius / n},"color":"#000000","border":"#000000"}`);
    if (i != n - 1 ) {
    fs.appendFileSync(filePath, `,\n`);
    }
  }
  fs.appendFileSync(filePath, `],\n"edges":[`)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      /*if (spotChek(i, j, resultRoad)) {
        console.log(`i = ${i}; j = ${j} ${spotChek(i, j, resultRoad)}`);
        graph.push(`{"vertex1":${i},"vertex2":${j},"weight":"${cities[i][j]}","isDirected":false,"controlStep":0,"fontSize":18,"lineWidth":3,"background":"#000000","color":"#000000"}`);
        //fs.appendFileSync(filePath, `{"vertex1":${resultRoad[i]},"vertex2":${resultRoad[j]},"weight":"${cities[resultRoad[i]][resultRoad[j]]}","isDirected":false,"controlStep":0,"fontSize":18,"lineWidth":3,"background":"#000000","color":"#000000"}`);
        console.log(`cities[i][j] = ${cities[i][j]}`);
      } else  {
        console.log(`i = ${i}; j = ${j} ${spotChek(i, j, resultRoad)}`);
        graph.push(`{"vertex1":${i},"vertex2":${j},"weight":"${cities[i][j]}","isDirected":false,"controlStep":0,"fontSize":18,"lineWidth":2,"background":"#9e9e9e","color":"#9e9e9e"}`);
        //fs.appendFileSync(filePath, `{"vertex1":${i},"vertex2":${j},"weight":"${cities[i][j]}","isDirected":false,"controlStep":0,"fontSize":18,"lineWidth":2,"background":"#9e9e9e","color":"#9e9e9e"}`);
        console.log(`cities[i][j] = ${cities[i][j]}`);
      } */
          graph.push(`{"vertex1":${i},"vertex2":${j},"weight":"${cities[i][j]}","isDirected":false,"controlStep":0,"fontSize":18,"lineWidth":2,"background":"#9e9e9e","color":"#9e9e9e"}\n`);
      }
    }
  
  fs.appendFileSync(filePath, `${graph}`);
  fs.appendFileSync(filePath, `],"texts":[]}`);
  //fs.appendFileSync(cities, `${cities}`);
}

function graphToFile(resultRoad, iteration) {
  const radius = 100*n;
  let graph = [];
  const path = require('path');
  const fs = require('fs');
  const fileNameGraph = `Ant's path № ${iteration}.graph`;
  const fileNameCities = 'citiesGeneration.txt';
  const resultDirectory = 'results';
  if (!fs.existsSync(resultDirectory)){
    fs.mkdirSync(resultDirectory);
  }
  const filePath = path.join(__dirname, resultDirectory, fileNameGraph);
  const citiesPath = path.join(__dirname, fileNameCities);
  fs.writeFileSync(filePath, '');
  fs.writeFileSync(citiesPath, '');
  // записываем данные в файл
  //let data = fs.readFileSync(filePath, 'utf8');
  //data = data.slice(0, -1);
  fs.appendFileSync(filePath, `{"x0":-270,"y0":-20,"vertices":[`);
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 / n) * i;
    fs.appendFileSync(filePath, `{"x":${Math.round(radius * Math.cos(angle))},"y":${Math.round(radius * Math.sin(angle))},"name":"${resultRoad[i]}","radius":${n * Math.PI},"background":"#ffffff","fontSize":${radius / n},"color":"#000000","border":"#000000"}`);
    if (i != n - 1 ) {
    fs.appendFileSync(filePath, `,\n`);
    }
  }
  fs.appendFileSync(filePath, `],\n"edges":[`)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      /*if (spotChek(i, j, resultRoad)) {
        console.log(`i = ${i}; j = ${j} ${spotChek(i, j, resultRoad)}`);
        graph.push(`{"vertex1":${i},"vertex2":${j},"weight":"${cities[i][j]}","isDirected":false,"controlStep":0,"fontSize":18,"lineWidth":3,"background":"#000000","color":"#000000"}`);
        //fs.appendFileSync(filePath, `{"vertex1":${resultRoad[i]},"vertex2":${resultRoad[j]},"weight":"${cities[resultRoad[i]][resultRoad[j]]}","isDirected":false,"controlStep":0,"fontSize":18,"lineWidth":3,"background":"#000000","color":"#000000"}`);
        console.log(`cities[i][j] = ${cities[i][j]}`);
      } else  {
        console.log(`i = ${i}; j = ${j} ${spotChek(i, j, resultRoad)}`);
        graph.push(`{"vertex1":${i},"vertex2":${j},"weight":"${cities[i][j]}","isDirected":false,"controlStep":0,"fontSize":18,"lineWidth":2,"background":"#9e9e9e","color":"#9e9e9e"}`);
        //fs.appendFileSync(filePath, `{"vertex1":${i},"vertex2":${j},"weight":"${cities[i][j]}","isDirected":false,"controlStep":0,"fontSize":18,"lineWidth":2,"background":"#9e9e9e","color":"#9e9e9e"}`);
        console.log(`cities[i][j] = ${cities[i][j]}`);
      } */
          graph.push(`{"vertex1":${i},"vertex2":${j},"weight":"${cities[i][j]}","isDirected":false,"controlStep":0,"fontSize":18,"lineWidth":2,"background":"#9e9e9e","color":"#9e9e9e"}\n`);
      }
    }
  
  fs.appendFileSync(filePath, `${graph}`);
  fs.appendFileSync(filePath, `],"texts":[]}`);
  //fs.appendFileSync(cities, `${cities}`);
}

function citiesGeneration(n) {
  let cities = []
  // заполняем только верхнюю половину массива случайными числами и ставим нули на главной диагонали
  for (let i = 0; i < n; i++) {
    cities[i] = [];
    for (let j = 0; j <= i; j++) {
      if (j === i) {
        cities[i][j] = 0;
      } else {
        cities[i][j] = Math.floor(Math.random()*50+10);
      }
    }
  }
  // Дописываем нижнюю половину массива, копируя верхнюю
  for (let i = 0; i < n; i++) {
    for (let j = i+1; j < n; j++) {
      cities[i][j] = cities[j][i];
    }
  }
  return cities;
}

function swap(arr, a, b) {
  let t = arr[a];
  arr[a] = arr[b];
  arr[b] = t;
}

// Длина пути
function RoadSum(road) {
  let sum = 0;
  for (let i = 0; i < road.length - 1; i++) {
    sum += cities[road[i]][road[i+1]];
  }
  sum += cities[road[0]][road.at(-1)];  
  return sum;
}

function simulatedAnnealing() {
  let road = Array.from({ length: n }, (_, i) => i);
  let temperature = 100;
  let coolingRate = 0.000000001;
  let currentLenght = RoadSum(road);
  while (temperature > 1) {
    let row = Math.floor(Math.random() * n);
    let col = Math.floor(Math.random() * n);
    // Проверка на то, что города не совпадают и что исходная точка не меняется
    if (row == 0 || col == 0 || row == col) {       
      while (row == 0 || col == 0 || row == col) {
        row = Math.floor(Math.random() * n);
        col = Math.floor(Math.random() * n);
      }
    }
    swap(road, row, col);
    let newLenght = RoadSum(road);
    if (newLenght < currentLenght) {
      currentLenght = newLenght;
    } else if (Math.random() < 1 / Math.exp((newLenght - currentLenght) / temperature)) {
      currentLenght = newLenght;
    } else {
      swap(road, row, col);
    }
    temperature *= 1 - coolingRate;
  }
  road.push(currentLenght);
  return road;
}

function toMatrixLatex() {
  const path = require('path');
  const fileNameGraph = 'latexMatrix.txt';
  const fs = require('fs');
  const filePath = path.join(__dirname, fileNameGraph);
  try {
    fs.writeFileSync(filePath, '');
    fs.appendFileSync(filePath, '\\hline \n № Города ');
    for (let i = 1; i <= n; i++) {
      fs.appendFileSync(filePath, `& ${i} `);
    }
    fs.appendFileSync(filePath, '\\\\ \\hline\n');
    for (let i = 0; i < n; i++) {
      fs.appendFileSync(filePath, `${i + 1} ` );
      for (let j = 0; j < n; j++) {
        fs.appendFileSync(filePath, `& ${cities[i][j]} `);
      } 
      fs.appendFileSync(filePath, '\\\\ \n\\hline \n');
    }
    console.log('Файл успешно создан и данные записаны.');
  } catch (err) {
    console.error('Произошла ошибка при создании файла:', err);
  }
  // // let graph = [];
  // const path = require('path');
  // const fs = require('fs');
  // const fileNameGraph = `latexMatrix.txt`;
  // const filePath = path.join(__dirname, fileNameGraph);
  // fs.writeFileSync(filePath, '');
  // fs.appendFileSync(filePath, `\\hline \n № Города & `);
  // for (let i = 1; i <= n; i++) {
  //   fs.appendFileSync(filePath, `& ${i}`);
  // }
  // fs.appendFileSync(filePath, `\\\\ \\hline`);
  // for (let i = 0; i < n; i++) {
  //   fs.appendFileSync(filePath, `${i} `);
  //   for (let j = 0; j < n; j++) {
  //     fs.appendFileSync(filePath, `& ${cities[i][j]}`);
  //   } 
  //   fs.appendFileSync(filePath, `\\\\ \n \\hline`);
  // }
}


//Готовый граф

const cities = [
  [
     0, 22, 38, 42, 10, 10,  8, 48, 18, 21, 13,  3,
    48, 39, 31,  1, 17, 41, 43, 49, 28, 22, 27, 12,
    30, 37, 17,  1, 27, 42, 38, 14, 49, 16, 32, 32,
     3, 14, 24, 44, 43, 27, 43,  6, 40, 24, 10, 49,
    31, 33, 47, 18, 21, 16, 42, 26, 24, 50, 20, 44,
    30, 40, 42, 18, 36, 38
  ],
  [
    22,  0, 45,  3, 21, 27, 31, 35, 42, 15, 33, 33,
    25, 25, 26, 47, 49, 40, 14, 49, 30, 45, 33, 35,
    36,  8, 20, 38,  2, 13, 12, 33, 39, 28, 11, 18,
    33,  6, 50, 50,  7, 13, 10,  6, 15, 12, 14,  2,
    44, 41, 17,  8, 18, 23,  7,  3, 45,  6, 39, 42,
    33, 41, 50, 16, 43, 31
  ],
  [
    38, 45,  0, 44,  2,  5, 34, 14, 39, 25, 44, 21,
    17, 14, 15, 35, 14, 48, 25, 44, 32,  9, 39, 34,
    42,  7, 45, 15,  6, 46, 14, 13, 43, 47,  2, 46,
     5, 36, 31, 32, 35, 24, 35,  9, 14, 17, 22, 15,
    10, 23,  7, 39,  7, 34,  1, 33,  5, 22, 30, 48,
     7, 19, 29, 13, 18, 16
  ],
  [
    42,  3, 44,  0, 47, 46, 41, 18, 47, 40, 47,  5,
    38, 31, 10, 16, 42, 13, 44, 13, 11, 41, 15, 23,
    34, 45, 45,  8, 32, 30, 15, 37, 21,  8, 43,  9,
    12, 21, 29, 21, 49, 46, 43, 18,  2,  3, 27, 23,
    15, 14,  5, 21, 46,  6, 27, 15, 30, 34,  8, 40,
    31, 22, 29, 28, 37,  8
  ],
  [
    10, 21,  2, 47,  0, 27, 36, 36,  7, 23, 28, 35,
    41, 38, 31,  9, 38, 23,  5, 43,  2,  6,  6, 38,
     2, 28, 45, 26, 10, 45,  4, 14,  4,  6, 38, 22,
    31, 23,  3, 15, 40,  5, 24, 31, 22, 30, 39, 30,
    40, 46,  1, 48,  7, 19, 28, 42, 15,  3, 39, 33,
    33, 13,  9, 12, 43,  1
  ],
  [
    10, 27,  5, 46, 27,  0, 33, 49,  8,  1, 16,  6,
    15, 32, 27, 14,  9,  8,  3, 36, 39, 27, 28, 15,
    14, 15, 11, 40, 22, 24, 39, 34, 35, 50, 38, 37,
    44, 33, 21, 42, 49, 41, 45,  6, 26, 41, 45, 22,
    16, 50, 41, 33, 13, 45, 19, 43,  9, 42,  5, 23,
    28, 20, 38, 17, 46,  1
  ],
  [
     8, 31, 34, 41, 36, 33,  0, 31,  1, 47, 43, 34,
    20,  6, 42, 46, 46, 17, 49,  3, 38, 34,  8, 41,
     2, 36, 19, 44, 26, 35, 13, 18, 27, 30, 39, 44,
    24,  7,  9, 49,  9, 13, 15, 39, 24,  5, 40, 32,
    23, 47,  2, 15, 43, 45, 12, 48, 22,  3, 21, 16,
    29, 11, 46,  1, 36, 29
  ],
  [
    48, 35, 14, 18, 36, 49, 31,  0, 32, 20, 27, 21,
    41, 48, 46, 37, 39, 17, 50, 19, 31, 22, 30, 13,
    49, 19,  9, 38, 31, 36, 37,  5,  1, 43, 24, 36,
    13, 36,  7, 43, 46, 23, 38, 35, 22, 20, 50, 40,
     4, 26, 44, 32, 35, 45, 37, 25,  7, 17,  1, 34,
    25, 25, 27, 47, 17, 17
  ],
  [
    18, 42, 39, 47,  7,  8,  1, 32,  0, 14, 14, 47,
    10, 39, 32, 15, 37,  1,  5, 37,  1, 33, 45, 50,
    13, 32, 34, 18, 25, 22, 26, 39,  7, 21,  3, 37,
     6, 17,  5, 10,  9, 44, 46, 12, 29,  3, 32, 50,
    22, 31, 15, 18, 41, 38, 21, 38, 26, 42,  8, 44,
    48, 16, 26,  1, 29, 30
  ],
  [
    21, 15, 25, 40, 23,  1, 47, 20, 14,  0, 23, 44,
    48, 37,  3, 12, 49, 36,  7,  8, 34, 27, 36,  6,
    20,  3, 34,  1,  1, 44,  2, 15, 39, 40, 24, 42,
    46, 24, 45, 38, 32,  2, 44, 46, 47,  1, 20, 43,
     9, 38, 22, 19, 47, 40, 42,  7, 43, 20,  9, 24,
    44, 39, 41, 30, 50,  1
  ],
  [
    13, 33, 44, 47, 28, 16, 43, 27, 14, 23,  0,  3,
    16, 44, 36,  8, 41, 24, 25, 22, 48, 22, 49, 46,
     3, 44, 19, 13, 39, 18, 39,  4, 10,  9,  9, 23,
     8, 22, 17,  5,  8, 35, 39, 30, 35, 23, 22,  9,
    28, 39, 29, 35, 21,  4, 44, 50, 14, 27, 40, 32,
    34,  5,  2, 25,  9,  6
  ],
  [
     3, 33, 21,  5, 35,  6, 34, 21, 47, 44,  3,  0,
    41, 41, 33, 16, 25, 23, 28, 35, 11, 10, 38,  7,
     2, 26, 14,  3, 13, 29,  6,  6, 12,  9,  3,  5,
    16,  8, 43, 39, 36, 48, 25, 31, 35,  5, 17, 39,
    40, 31, 41, 49, 13, 29,  6, 26,  1, 44, 29, 50,
     5, 17, 45, 48, 18, 41
  ],
  [
    48, 25, 17, 38, 41, 15, 20, 41, 10, 48, 16, 41,
     0, 31, 47, 16, 31, 43,  6, 47, 19, 43, 21, 44,
    13,  9, 13, 49, 41, 50, 35, 20, 30, 11, 42, 36,
    19, 47, 34, 49, 29,  6, 46, 44, 15,  3, 20, 15,
    30, 29, 41,  3,  7, 30,  7, 44,  4, 29,  2, 27,
    24,  9, 46, 38,  2,  9
  ],
  [
    39, 25, 14, 31, 38, 32,  6, 48, 39, 37, 44, 41,
    31,  0, 30, 27, 40, 30, 27, 26, 39,  1, 27,  7,
    23,  1, 25,  9, 13, 26, 34,  7, 18, 44, 28, 43,
    42, 25, 14, 50, 23, 40,  1, 19, 39, 32,  9, 41,
    10, 23,  2, 14, 32, 42,  4, 38, 40, 23, 32, 37,
    43, 49, 45, 12, 20, 30
  ],
  [
    31, 26, 15, 10, 31, 27, 42, 46, 32,  3, 36, 33,
    47, 30,  0, 32, 21,  7, 12,  2, 34, 26, 41,  6,
     7, 34,  6,  7, 24, 21, 14, 10, 48, 50,  3, 27,
    34,  6, 20, 39, 33, 48, 17,  6, 22,  2,  1, 18,
    17, 39,  4, 12, 49,  5, 17, 47, 22, 14, 13, 16,
    44, 35, 28, 39, 17,  7
  ],
  [
     1, 47, 35, 16,  9, 14, 46, 37, 15, 12,  8, 16,
    16, 27, 32,  0, 24, 50, 19, 32, 44,  5, 26,  2,
    32, 37,  1,  8, 21,  3, 46, 38, 37,  2, 27, 37,
    32,  2, 36, 12,  5,  2, 50, 31, 35, 50, 30, 12,
    35,  7, 15, 10, 37, 48, 34, 10, 17, 34, 28, 33,
    50,  5, 27, 33,  8, 48
  ],
  [
    17, 49, 14, 42, 38,  9, 46, 39, 37, 49, 41, 25,
    31, 40, 21, 24,  0, 21, 23,  3, 14,  6, 50, 26,
     2,  8, 23, 28, 24, 10,  3, 20, 27, 25,  6, 14,
    36, 43,  2, 49, 26, 25, 30, 37, 50, 36,  4,  8,
    28, 29, 46,  8,  5,  9, 21, 47,  3, 44, 35,  4,
    10, 41, 23,  2,  4, 17
  ],
  [
    41, 40, 48, 13, 23,  8, 17, 17,  1, 36, 24, 23,
    43, 30,  7, 50, 21,  0, 38,  5, 23, 46,  7, 19,
    10, 37, 39, 21, 46, 39,  1, 50, 47, 15, 13, 22,
    26, 26, 38,  5, 22,  5, 17, 49,  4, 34, 45, 14,
    34, 29,  6,  4, 10, 25, 42, 11, 39, 33, 39, 41,
    34, 33,  6, 10, 25,  2
  ],
  [
    43, 14, 25, 44,  5,  3, 49, 50,  5,  7, 25, 28,
     6, 27, 12, 19, 23, 38,  0, 48, 27, 30, 39, 31,
    48, 30, 49, 38,  6, 13, 37, 18, 23, 13, 27, 31,
    49, 15,  7, 43,  5, 25, 49, 34, 45, 22, 49, 18,
    15, 19, 28,  5, 22, 12, 12, 22, 20, 31, 49, 41,
    40, 36, 15,  3, 39,  1
  ],
  [
    49, 49, 44, 13, 43, 36,  3, 19, 37,  8, 22, 35,
    47, 26,  2, 32,  3,  5, 48,  0, 34, 23, 48, 22,
    22, 19, 13, 13,  1, 28, 17, 38, 39, 46, 32, 15,
    16, 21, 42, 19, 29, 40, 44, 45,  2, 22, 35,  8,
     7,  3, 29, 23, 33, 21, 35, 23, 14, 36, 33,  1,
    10, 26, 45,  6, 41, 26
  ],
  [
    28, 30, 32, 11,  2, 39, 38, 31,  1, 34, 48, 11,
    19, 39, 34, 44, 14, 23, 27, 34,  0, 24,  8, 25,
     2, 14, 19, 37, 48, 36, 46, 25, 24, 24, 33,  4,
    46, 34, 29, 39, 33, 35, 18, 13,  9, 39, 29, 41,
     2, 20, 22, 45, 23, 16, 47, 27, 33,  3,  2, 27,
    12, 39, 18, 40, 18, 19
  ],
  [
    22, 45,  9, 41,  6, 27, 34, 22, 33, 27, 22, 10,
    43,  1, 26,  5,  6, 46, 30, 23, 24,  0, 47, 30,
    35, 50, 32, 39, 37, 25, 47,  5,  2, 15, 34, 26,
    11, 11, 40, 39,  5,  4, 19, 36, 10, 50,  2, 50,
    25, 32,  8, 39,  6, 34, 45, 36,  2, 25, 50, 11,
    19, 39, 15, 27, 37, 41
  ],
  [
    27, 33, 39, 15,  6, 28,  8, 30, 45, 36, 49, 38,
    21, 27, 41, 26, 50,  7, 39, 48,  8, 47,  0, 24,
    26, 21, 12, 46, 35, 11, 15, 44, 29, 48, 15,  6,
     4, 28, 49, 31, 19,  4, 50, 41, 46, 35, 34, 27,
    36, 24, 39,  3, 48, 14, 42, 31, 39,  9, 16, 20,
    38, 11,  6, 38, 44, 12
  ],
  [
    12, 35, 34, 23, 38, 15, 41, 13, 50,  6, 46,  7,
    44,  7,  6,  2, 26, 19, 31, 22, 25, 30, 24,  0,
    42,  7, 15, 41, 29, 23, 49, 11, 45,  4, 40,  2,
    16, 36,  1, 41, 33,  5, 30, 15, 43, 46, 13,  5,
     5, 39, 49, 30,  1,  7, 25, 29, 16, 31, 26, 11,
    23, 11, 31, 33,  6, 37
  ],
  [
    30, 36, 42, 34,  2, 14,  2, 49, 13, 20,  3,  2,
    13, 23,  7, 32,  2, 10, 48, 22,  2, 35, 26, 42,
     0, 48, 13, 36, 32, 28,  2, 24, 30, 32, 19, 22,
    34, 33,  3,  7, 21, 16, 50, 33, 43, 27,  4, 34,
    45, 47, 13,  1, 43, 25, 36, 47, 35, 25, 44,  8,
    18, 22,  7,  1, 45, 44
  ],
  [
    37,  8,  7, 45, 28, 15, 36, 19, 32,  3, 44, 26,
     9,  1, 34, 37,  8, 37, 30, 19, 14, 50, 21,  7,
    48,  0, 45, 14,  6, 15, 50, 23, 14,  3, 11, 43,
    28, 13, 24, 46, 24,  1, 30, 31, 10, 26, 20, 18,
    17, 18, 28, 42,  9, 16, 17, 10,  1, 22,  6, 14,
    13, 13, 24, 32, 23,  7
  ],
  [
    17, 20, 45, 45, 45, 11, 19,  9, 34, 34, 19, 14,
    13, 25,  6,  1, 23, 39, 49, 13, 19, 32, 12, 15,
    13, 45,  0, 26, 27, 39, 44, 47, 45, 13, 44,  4,
    38, 25, 29, 23, 48, 27, 15, 26, 50, 20, 48, 37,
    33, 20,  5, 30, 12, 31,  3, 22, 33, 22,  9, 15,
     4, 47, 46, 43, 40, 46
  ],
  [
     1, 38, 15,  8, 26, 40, 44, 38, 18,  1, 13,  3,
    49,  9,  7,  8, 28, 21, 38, 13, 37, 39, 46, 41,
    36, 14, 26,  0,  4, 41, 38,  5, 17, 36, 33, 29,
    31,  4,  6, 39,  5,  8,  5, 48, 11, 23, 38, 45,
    14, 35, 48, 47, 39, 34, 38,  2, 47,  2, 40, 14,
    49, 27, 41, 36, 47, 21
  ],
  [
    27,  2,  6, 32, 10, 22, 26, 31, 25,  1, 39, 13,
    41, 13, 24, 21, 24, 46,  6,  1, 48, 37, 35, 29,
    32,  6, 27,  4,  0, 44, 31,  4, 50,  4, 33, 18,
    34, 22,  1,  6, 44, 18, 23,  1, 39, 46,  5, 32,
    36, 37, 27,  3, 29, 21, 32, 50,  3, 14,  2, 43,
    26, 13, 14, 37, 47, 43
  ],
  [
    42, 13, 46, 30, 45, 24, 35, 36, 22, 44, 18, 29,
    50, 26, 21,  3, 10, 39, 13, 28, 36, 25, 11, 23,
    28, 15, 39, 41, 44,  0, 32, 32, 48, 38, 14, 13,
    50, 23, 30, 11, 38, 15,  5, 43,  5, 35, 21, 32,
     4, 50, 16,  6, 31, 14, 13, 34, 36, 19, 27, 29,
    46,  3, 29, 36, 36,  7
  ],
  [
    38, 12, 14, 15,  4, 39, 13, 37, 26,  2, 39,  6,
    35, 34, 14, 46,  3,  1, 37, 17, 46, 47, 15, 49,
     2, 50, 44, 38, 31, 32,  0, 33,  1,  5, 34, 48,
    14, 38, 27, 34, 33,  6, 33, 35,  9, 27,  7, 21,
    31,  2, 11,  9, 31, 16, 49, 14,  2, 44,  2, 35,
    34,  5, 29, 49, 32, 25
  ],
  [
    14, 33, 13, 37, 14, 34, 18,  5, 39, 15,  4,  6,
    20,  7, 10, 38, 20, 50, 18, 38, 25,  5, 44, 11,
    24, 23, 47,  5,  4, 32, 33,  0, 25, 26, 21, 29,
    50, 28,  4, 26, 24, 42, 29,  3, 13, 16, 38, 21,
    43, 23, 43, 45, 13, 18, 12, 20, 36,  4, 47, 40,
    16,  4, 13, 10,  5,  2
  ],
  [
    49, 39, 43, 21,  4, 35, 27,  1,  7, 39, 10, 12,
    30, 18, 48, 37, 27, 47, 23, 39, 24,  2, 29, 45,
    30, 14, 45, 17, 50, 48,  1, 25,  0, 25, 30,  4,
    22, 39,  6, 12, 24, 26, 23, 24, 43,  3, 32, 45,
    30, 22, 12,  2, 49, 26, 50, 33, 38, 49,  5, 26,
    50, 48, 35, 25, 39, 43
  ],
  [
    16, 28, 47,  8,  6, 50, 30, 43, 21, 40,  9,  9,
    11, 44, 50,  2, 25, 15, 13, 46, 24, 15, 48,  4,
    32,  3, 13, 36,  4, 38,  5, 26, 25,  0, 17, 50,
    32, 34, 35, 15, 39, 17, 40, 34, 35, 26, 16, 44,
    48, 34, 25, 25,  9, 24, 36, 49, 37, 31, 30, 20,
    31, 30, 20, 17,  1, 37
  ],
  [
    32, 11,  2, 43, 38, 38, 39, 24,  3, 24,  9,  3,
    42, 28,  3, 27,  6, 13, 27, 32, 33, 34, 15, 40,
    19, 11, 44, 33, 33, 14, 34, 21, 30, 17,  0, 17,
    27, 19, 40, 40, 50, 37, 38, 31, 14, 35,  7, 36,
    38, 39, 30, 31, 47, 23, 37, 21, 29, 32, 19, 23,
     1, 32, 47, 36,  3, 34
  ],
  [
    32, 18, 46,  9, 22, 37, 44, 36, 37, 42, 23,  5,
    36, 43, 27, 37, 14, 22, 31, 15,  4, 26,  6,  2,
    22, 43,  4, 29, 18, 13, 48, 29,  4, 50, 17,  0,
    20, 39, 49,  2,  8, 15, 47, 17, 37,  5, 33, 46,
    50, 35,  2, 25, 40, 27, 26, 44,  5, 20,  6,  3,
    18,  5, 47,  7, 28, 13
  ],
  [
     3, 33,  5, 12, 31, 44, 24, 13,  6, 46,  8, 16,
    19, 42, 34, 32, 36, 26, 49, 16, 46, 11,  4, 16,
    34, 28, 38, 31, 34, 50, 14, 50, 22, 32, 27, 20,
     0,  7,  7, 49,  6,  9,  8,  7, 24, 46, 49, 16,
    35, 22,  2, 20, 32, 41, 38, 42, 27, 48, 22, 17,
    40, 12, 23,  8, 35, 39
  ],
  [
    14,  6, 36, 21, 23, 33,  7, 36, 17, 24, 22,  8,
    47, 25,  6,  2, 43, 26, 15, 21, 34, 11, 28, 36,
    33, 13, 25,  4, 22, 23, 38, 28, 39, 34, 19, 39,
     7,  0, 21, 24, 21,  7, 10, 17, 11,  9, 14, 21,
    42,  6, 12, 15, 32, 18, 17,  4, 36, 39, 21, 12,
    45, 25, 14, 22, 34, 49
  ],
  [
    24, 50, 31, 29,  3, 21,  9,  7,  5, 45, 17, 43,
    34, 14, 20, 36,  2, 38,  7, 42, 29, 40, 49,  1,
     3, 24, 29,  6,  1, 30, 27,  4,  6, 35, 40, 49,
     7, 21,  0,  2, 20, 47, 41, 35, 21, 32, 29, 50,
    28,  3,  7, 11, 44, 35, 30, 48, 41, 11, 14, 43,
    20, 36, 30, 21, 42, 25
  ],
  [
    44, 50, 32, 21, 15, 42, 49, 43, 10, 38,  5, 39,
    49, 50, 39, 12, 49,  5, 43, 19, 39, 39, 31, 41,
     7, 46, 23, 39,  6, 11, 34, 26, 12, 15, 40,  2,
    49, 24,  2,  0, 15, 43, 42, 42,  4, 43,  1, 40,
     6, 27, 19, 43, 40, 36, 23, 47,  6, 15,  3, 38,
    13, 49, 39, 33,  8, 28
  ],
  [
    43,  7, 35, 49, 40, 49,  9, 46,  9, 32,  8, 36,
    29, 23, 33,  5, 26, 22,  5, 29, 33,  5, 19, 33,
    21, 24, 48,  5, 44, 38, 33, 24, 24, 39, 50,  8,
     6, 21, 20, 15,  0, 39, 18, 13, 16, 24,  1, 36,
    48, 38, 11, 20, 27, 32, 18, 32, 49,  2, 14, 45,
    41, 47, 13, 26, 23, 35
  ],
  [
    27, 13, 24, 46,  5, 41, 13, 23, 44,  2, 35, 48,
     6, 40, 48,  2, 25,  5, 25, 40, 35,  4,  4,  5,
    16,  1, 27,  8, 18, 15,  6, 42, 26, 17, 37, 15,
     9,  7, 47, 43, 39,  0, 41, 46, 19, 39, 33, 31,
    14, 18, 12, 14, 12, 10, 35, 41, 47, 47, 41, 29,
    41, 11, 40, 17, 13, 43
  ],
  [
    43, 10, 35, 43, 24, 45, 15, 38, 46, 44, 39, 25,
    46,  1, 17, 50, 30, 17, 49, 44, 18, 19, 50, 30,
    50, 30, 15,  5, 23,  5, 33, 29, 23, 40, 38, 47,
     8, 10, 41, 42, 18, 41,  0,  1, 15, 39, 21,  9,
    25,  2, 38, 22, 36, 14, 47,  1, 24, 42, 23, 40,
    17, 15, 46, 31, 40, 10
  ],
  [
     6,  6,  9, 18, 31,  6, 39, 35, 12, 46, 30, 31,
    44, 19,  6, 31, 37, 49, 34, 45, 13, 36, 41, 15,
    33, 31, 26, 48,  1, 43, 35,  3, 24, 34, 31, 17,
     7, 17, 35, 42, 13, 46,  1,  0, 17, 35,  9,  8,
    23,  4, 10, 35, 36,  9, 38, 30, 38,  2, 11, 43,
    25,  5, 17, 33, 20, 15
  ],
  [
    40, 15, 14,  2, 22, 26, 24, 22, 29, 47, 35, 35,
    15, 39, 22, 35, 50,  4, 45,  2,  9, 10, 46, 43,
    43, 10, 50, 11, 39,  5,  9, 13, 43, 35, 14, 37,
    24, 11, 21,  4, 16, 19, 15, 17,  0, 37,  9,  1,
    49, 10, 40, 23, 20, 19, 39, 38,  2, 40, 19, 50,
    27, 24, 12, 35, 11, 40
  ],
  [
    24, 12, 17,  3, 30, 41,  5, 20,  3,  1, 23,  5,
     3, 32,  2, 50, 36, 34, 22, 22, 39, 50, 35, 46,
    27, 26, 20, 23, 46, 35, 27, 16,  3, 26, 35,  5,
    46,  9, 32, 43, 24, 39, 39, 35, 37,  0,  8,  2,
    15, 35, 35, 39,  7, 36, 42, 20, 29, 43, 31, 43,
    35,  4, 33, 24, 22, 38
  ],
  [
    10, 14, 22, 27, 39, 45, 40, 50, 32, 20, 22, 17,
    20,  9,  1, 30,  4, 45, 49, 35, 29,  2, 34, 13,
     4, 20, 48, 38,  5, 21,  7, 38, 32, 16,  7, 33,
    49, 14, 29,  1,  1, 33, 21,  9,  9,  8,  0, 38,
    28, 15, 41, 27, 30, 24, 48,  3, 31,  7, 15, 32,
     1, 34, 15, 27, 49, 48
  ],
  [
    49,  2, 15, 23, 30, 22, 32, 40, 50, 43,  9, 39,
    15, 41, 18, 12,  8, 14, 18,  8, 41, 50, 27,  5,
    34, 18, 37, 45, 32, 32, 21, 21, 45, 44, 36, 46,
    16, 21, 50, 40, 36, 31,  9,  8,  1,  2, 38,  0,
    12, 14,  1, 14, 42, 18,  2, 21, 18, 49,  7, 42,
    12, 24, 35, 12, 16,  8
  ],
  [
    31, 44, 10, 15, 40, 16, 23,  4, 22,  9, 28, 40,
    30, 10, 17, 35, 28, 34, 15,  7,  2, 25, 36,  5,
    45, 17, 33, 14, 36,  4, 31, 43, 30, 48, 38, 50,
    35, 42, 28,  6, 48, 14, 25, 23, 49, 15, 28, 12,
     0, 31,  8, 22, 19, 41, 27, 42, 18,  5,  2, 50,
    41, 15, 38, 11,  6, 15
  ],
  [
    33, 41, 23, 14, 46, 50, 47, 26, 31, 38, 39, 31,
    29, 23, 39,  7, 29, 29, 19,  3, 20, 32, 24, 39,
    47, 18, 20, 35, 37, 50,  2, 23, 22, 34, 39, 35,
    22,  6,  3, 27, 38, 18,  2,  4, 10, 35, 15, 14,
    31,  0, 23, 50, 36, 48, 22, 36, 34, 20, 29, 32,
    23, 18, 42, 21, 22, 18
  ],
  [
    47, 17,  7,  5,  1, 41,  2, 44, 15, 22, 29, 41,
    41,  2,  4, 15, 46,  6, 28, 29, 22,  8, 39, 49,
    13, 28,  5, 48, 27, 16, 11, 43, 12, 25, 30,  2,
     2, 12,  7, 19, 11, 12, 38, 10, 40, 35, 41,  1,
     8, 23,  0, 49, 21, 38, 11, 18, 45, 34, 23, 50,
    33, 34, 43,  2, 17,  9
  ],
  [
    18,  8, 39, 21, 48, 33, 15, 32, 18, 19, 35, 49,
     3, 14, 12, 10,  8,  4,  5, 23, 45, 39,  3, 30,
     1, 42, 30, 47,  3,  6,  9, 45,  2, 25, 31, 25,
    20, 15, 11, 43, 20, 14, 22, 35, 23, 39, 27, 14,
    22, 50, 49,  0, 13, 41,  9, 29, 18, 38, 47, 43,
    20, 35, 19, 24,  6,  4
  ],
  [
    21, 18,  7, 46,  7, 13, 43, 35, 41, 47, 21, 13,
     7, 32, 49, 37,  5, 10, 22, 33, 23,  6, 48,  1,
    43,  9, 12, 39, 29, 31, 31, 13, 49,  9, 47, 40,
    32, 32, 44, 40, 27, 12, 36, 36, 20,  7, 30, 42,
    19, 36, 21, 13,  0, 15, 30, 10, 14, 14,  3, 41,
    19, 35, 32,  4, 48, 15
  ],
  [
    16, 23, 34,  6, 19, 45, 45, 45, 38, 40,  4, 29,
    30, 42,  5, 48,  9, 25, 12, 21, 16, 34, 14,  7,
    25, 16, 31, 34, 21, 14, 16, 18, 26, 24, 23, 27,
    41, 18, 35, 36, 32, 10, 14,  9, 19, 36, 24, 18,
    41, 48, 38, 41, 15,  0, 11, 21, 21, 10, 41, 23,
    29, 50,  6,  3,  6, 48
  ],
  [
    42,  7,  1, 27, 28, 19, 12, 37, 21, 42, 44,  6,
     7,  4, 17, 34, 21, 42, 12, 35, 47, 45, 42, 25,
    36, 17,  3, 38, 32, 13, 49, 12, 50, 36, 37, 26,
    38, 17, 30, 23, 18, 35, 47, 38, 39, 42, 48,  2,
    27, 22, 11,  9, 30, 11,  0, 10,  3,  2,  4, 14,
    22, 26, 44, 35, 24, 14
  ],
  [
    26,  3, 33, 15, 42, 43, 48, 25, 38,  7, 50, 26,
    44, 38, 47, 10, 47, 11, 22, 23, 27, 36, 31, 29,
    47, 10, 22,  2, 50, 34, 14, 20, 33, 49, 21, 44,
    42,  4, 48, 47, 32, 41,  1, 30, 38, 20,  3, 21,
    42, 36, 18, 29, 10, 21, 10,  0, 39, 13, 49, 40,
    20, 43, 17, 23, 32, 12
  ],
  [
    24, 45,  5, 30, 15,  9, 22,  7, 26, 43, 14,  1,
     4, 40, 22, 17,  3, 39, 20, 14, 33,  2, 39, 16,
    35,  1, 33, 47,  3, 36,  2, 36, 38, 37, 29,  5,
    27, 36, 41,  6, 49, 47, 24, 38,  2, 29, 31, 18,
    18, 34, 45, 18, 14, 21,  3, 39,  0, 14, 27,  8,
    27, 35, 23, 41, 33, 29
  ],
  [
    50,  6, 22, 34,  3, 42,  3, 17, 42, 20, 27, 44,
    29, 23, 14, 34, 44, 33, 31, 36,  3, 25,  9, 31,
    25, 22, 22,  2, 14, 19, 44,  4, 49, 31, 32, 20,
    48, 39, 11, 15,  2, 47, 42,  2, 40, 43,  7, 49,
     5, 20, 34, 38, 14, 10,  2, 13, 14,  0,  3, 36,
    23, 12, 31, 28, 33, 25
  ],
  [
    20, 39, 30,  8, 39,  5, 21,  1,  8,  9, 40, 29,
     2, 32, 13, 28, 35, 39, 49, 33,  2, 50, 16, 26,
    44,  6,  9, 40,  2, 27,  2, 47,  5, 30, 19,  6,
    22, 21, 14,  3, 14, 41, 23, 11, 19, 31, 15,  7,
     2, 29, 23, 47,  3, 41,  4, 49, 27,  3,  0, 40,
    36, 22, 42, 39,  4, 33
  ],
  [
    44, 42, 48, 40, 33, 23, 16, 34, 44, 24, 32, 50,
    27, 37, 16, 33,  4, 41, 41,  1, 27, 11, 20, 11,
     8, 14, 15, 14, 43, 29, 35, 40, 26, 20, 23,  3,
    17, 12, 43, 38, 45, 29, 40, 43, 50, 43, 32, 42,
    50, 32, 50, 43, 41, 23, 14, 40,  8, 36, 40,  0,
    13,  3, 33, 13, 26, 35
  ],
  [
    30, 33,  7, 31, 33, 28, 29, 25, 48, 44, 34,  5,
    24, 43, 44, 50, 10, 34, 40, 10, 12, 19, 38, 23,
    18, 13,  4, 49, 26, 46, 34, 16, 50, 31,  1, 18,
    40, 45, 20, 13, 41, 41, 17, 25, 27, 35,  1, 12,
    41, 23, 33, 20, 19, 29, 22, 20, 27, 23, 36, 13,
     0, 36, 48,  7, 27, 46
  ],
  [
    40, 41, 19, 22, 13, 20, 11, 25, 16, 39,  5, 17,
     9, 49, 35,  5, 41, 33, 36, 26, 39, 39, 11, 11,
    22, 13, 47, 27, 13,  3,  5,  4, 48, 30, 32,  5,
    12, 25, 36, 49, 47, 11, 15,  5, 24,  4, 34, 24,
    15, 18, 34, 35, 35, 50, 26, 43, 35, 12, 22,  3,
    36,  0,  5, 37, 40, 16
  ],
  [
    42, 50, 29, 29,  9, 38, 46, 27, 26, 41,  2, 45,
    46, 45, 28, 27, 23,  6, 15, 45, 18, 15,  6, 31,
     7, 24, 46, 41, 14, 29, 29, 13, 35, 20, 47, 47,
    23, 14, 30, 39, 13, 40, 46, 17, 12, 33, 15, 35,
    38, 42, 43, 19, 32,  6, 44, 17, 23, 31, 42, 33,
    48,  5,  0,  1, 30, 47
  ],
  [
    18, 16, 13, 28, 12, 17,  1, 47,  1, 30, 25, 48,
    38, 12, 39, 33,  2, 10,  3,  6, 40, 27, 38, 33,
     1, 32, 43, 36, 37, 36, 49, 10, 25, 17, 36,  7,
     8, 22, 21, 33, 26, 17, 31, 33, 35, 24, 27, 12,
    11, 21,  2, 24,  4,  3, 35, 23, 41, 28, 39, 13,
     7, 37,  1,  0, 19, 32
  ],
  [
    36, 43, 18, 37, 43, 46, 36, 17, 29, 50,  9, 18,
     2, 20, 17,  8,  4, 25, 39, 41, 18, 37, 44,  6,
    45, 23, 40, 47, 47, 36, 32,  5, 39,  1,  3, 28,
    35, 34, 42,  8, 23, 13, 40, 20, 11, 22, 49, 16,
     6, 22, 17,  6, 48,  6, 24, 32, 33, 33,  4, 26,
    27, 40, 30, 19,  0, 28
  ],
  [
    38, 31, 16,  8,  1,  1, 29, 17, 30,  1,  6, 41,
     9, 30,  7, 48, 17,  2,  1, 26, 19, 41, 12, 37,
    44,  7, 46, 21, 43,  7, 25,  2, 43, 37, 34, 13,
    39, 49, 25, 28, 35, 43, 10, 15, 40, 38, 48,  8,
    15, 18,  9,  4, 15, 48, 14, 12, 29, 25, 33, 35,
    46, 16, 47, 32, 28,  0
  ]
];

const n = cities.length;
// const cities = citiesGeneration(n);
const evaporationRate = 0.9;
const numIterations = 100;
const numAnts = 60;
const Q = 4;
const beta = 3;
const alpha = 1.5;
let pheromones = Array.from({ length: n }, () => Array(n).fill(1));
// print(cities);
console.time('ants colony optimization'); //замеряет начало отсчета времени
let resAnt = antColonyOptimization();
console.timeEnd('ants colony optimization'); // конец отсчета времени
console.log(resAnt);
print(RoadSum(resAnt));
// graphToFile(resultRoad);
// минимальный высчитанный путь для 66 городов == 148, за 2.345 секунд
toMatrixLatex();
salesmanProblemResult(resAnt);













// console.time('simulated annealing'); //замеряет начало отсчета времени
// let resAnn = simulatedAnnealing();
// console.timeEnd('simulated annealing'); // конец отсчета времени




//console.time('myCode'); //замеряет начало отсчета времени
//let resultRoad = simulatedAnnealing(n, cities);
//console.timeEnd('myCode'); // конец отсчета времени
// console.log(resultRoad);
// graphToFile(n, cities, resultRoad);








//cities.forEach(row => console.log(row.join(', ')));

//citiesGeneration(n).forEach(row => console.log(row.join(' ')));




/* ************************************************************************************* */
/* РЕШЕНИЕ ЗАДАЧИ КОММИВОЯЖЕРА МЕТОДОМ ПЕРЕБОРА ДЛЯ ПРОВЕРКИ РЕЗУЛЬТАТОВ */

function travelingSalesmanProblem(graph) {
  let numCities = graph.length;
  let bestPath = null;
  let shortestDistance = Infinity;

  function permute(arr, start) {
    if (start === numCities - 1) {
      let distance = calculateDistance(arr);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        bestPath = arr.slice();
      }
    } else {
      for (let i = start; i < numCities; i++) {
        swap(arr, start, i);
        permute(arr, start + 1);
        swap(arr, start, i);
      }
    }
  }

  function calculateDistance(path) {
    let distance = 0;
    for (let i = 0; i < numCities - 1; i++) {
      distance += graph[path[i]][path[i+1]];
    }
    distance += graph[path[numCities-1]][path[0]];
    return distance;
  }

  function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  permute(Array.from(Array(numCities).keys()), 0);

  return {path: bestPath, distance: shortestDistance};
}

// Пример использования
// let graph = [
//   [0, 10, 15, 20],
//   [10, 0, 35, 25],
//   [15, 35, 0, 30],
//   [20, 25, 30, 0]
// ];




