`use strict`

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
    // graphToFile(antTours[iteration], iteration);
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
  const resultDirectory = 'Ant\'s Path';
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

function citiesGeneration() {
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

function coordinates() {
  const fs = require('fs');
  const data = fs.readFileSync(file, 'utf8').split('\n');
  const n = parseInt(data[0]); // количество узлов
  // console.log(n, data[0]);
  const node_coords = data.slice(1).map(line => line.split(' ').map(Number)); // парсим координаты городов
  return node_coords;
}

function createAdjacencyMatrixFromTSP(file) {
  const fs = require('fs');
  const data = fs.readFileSync(file, 'utf8').split('\n');
  console.log(data);
  const n = parseInt(data[0]); // количество узлов
  // const node_coords = data.slice(1).map(line => line.split(' ').map(Number)); // парсим координаты городов
  // let adjacencyMatrix = new Array(n).fill(null).map(() => new Array(n).fill(Infinity));
  
  const path = require('path');
  const fileName = 'cities.tsp';
  if (!fs.existsSync(path)){
    fs.mkdirSync(path);
  }
  const filePath = path.join(__dirname, path, fileName);


  for (let i = 0; i < n; i++) {
      adjacencyMatrix[i][i] = 0; // Расстояние от города до самого себя равно 0
      for (let j = i + 1; j < n; j++) {
          const distance = Math.round(Math.sqrt((node_coords[i][1] - node_coords[j][1]) ** 2 + (node_coords[i][2] - node_coords[j][2]) ** 2));
          adjacencyMatrix[i][j] = distance;
          adjacencyMatrix[j][i] = distance;
      }
  }

  return adjacencyMatrix;
}

function roadToTextfile(road) {  //Создает файл окончательного маршрута
  const node_coords = coordinates();
  const path = require('path');
  //const fileName = 'resultPath.tsp';
  const fs = require('fs');
  const resultDirectory = 'resultsTSP';
  const fileNameGraph = `Result path.graph`;
  if (!fs.existsSync(resultDirectory)){
    fs.mkdirSync(resultDirectory);
  }
  const filePath = path.join(__dirname, resultDirectory, fileNameGraph);
  try {
    fs.appendFileSync(filePath, '');
    for (let i = 0; i < road.length - 1; i++) {
      fs.appendFileSync(filePath, `${node_coords[road[i]][1]} ${node_coords[road[i]][2]} ${node_coords[road[i + 1]][1]} ${node_coords[road[i + 1]][2]}\n`);
    }
    fs.appendFileSync(filePath, `${node_coords[road[0]][1]} ${node_coords[road[0]][2]} ${node_coords[road.length - 1][1]} ${node_coords[road.length - 1][2]}\n`);
    fs.appendFileSync(filePath, `${RoadSum(road)}`);
    console.log('Файл успешно создан и данные записаны.');
  } catch (err) {
    console.error('Произошла ошибка при создании файла:', err);
  }
}


// Пример использования
const file = './qa194.tsp'; // Предполагается, что файл содержит данные в формате TSP
const cities = createAdjacencyMatrixFromTSP(file);
// console.log(cities);


const n = 100;
console.log(n);
// const cities = citiesGeneration();
const evaporationRate = 0.9;
const numIterations = 200;
const numAnts = 10;
const Q = 4;
const beta = 3;
const alpha = 2.5;
let pheromones = Array.from({ length: n }, () => Array(n).fill(1));
// console.time('ants colony optimization'); //замеряет начало отсчета времени
// let res = antColonyOptimization();
// for (let i = 0; i < 10; i++) {
//   let resAnt = antColonyOptimization();
//   if (RoadSum(res) > RoadSum(resAnt)) {
//     res = resAnt;
//   }
// }
// console.timeEnd('ants colony optimization'); // конец отсчета времени
// print(res);
// console.log(RoadSum(res));
// roadToTextfile(res);
// минимальный высчитанный путь для 66 городов == 148, за 2.345 секунд
// toMatrixLatex();
// salesmanProblemResult(resAnt);





console.time('simulated annealing'); //замеряет начало отсчета времени
// let resAnn = simulatedAnnealing();
console.timeEnd('simulated annealing'); // конец отсчета времени






