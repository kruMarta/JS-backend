async function DataTable(config, data1) {
    let users;
    let backendIInfo;
    if (data1 === null || data1 === undefined){
        users = await getInformation(config);
        backendIInfo = true;
    } else {
        users = data1;
        backendIInfo = false;
    }

    let div = document.getElementById("usersTable");
    let table = document.createElement('table');
    let amountOfCols = createHeaderTable(table, config, backendIInfo);
    createTableBody(table, amountOfCols, users);
    div.appendChild(table);
}

function createTableBody(table, amountOfCols, users){
    let tbody = document.createElement("tbody");
    let counter = 0;

    for (let userId in users){
      let user = users[userId];

      let row = tbody.insertRow();

      const information = [`${user.name}`, `${user.surname}`,`${user.avatar}`, `${user.birthday}`];
      if (counter%2 ===0){
        row.style.backgroundColor = "#ff8de2";
      } else {
        row.style.backgroundColor = "#ffddff";
      }
      
      row.style.padding = "20px";

      for (let i = 0; i < amountOfCols; i++){
        let cell = row.insertCell(i);
        cell.style.padding = "10px";
        
        if (i === 0){
          cell.innerHTML = ++counter;
          continue;
        }

        if (information[i-1] === user.avatar){
            var img = document.createElement('img');
            img.src = information[i-1];
            img.alt = information[i-1];
            cell.appendChild(img); 
        } 
        else if (information[i-1] === user.birthday){
            cell.innerHTML = birthdayOutput(user.birthday);
        }
        else {
            cell.innerHTML = information[i-1];
        }
      }
      tbody.appendChild(row);
    }

    table.style.width ="100%";
    table.style.fontSize ="18px";
    table.style.textAlign ="center";
    table.style.border = "3px solid purple";
    table.style.borderCollapse = "collapse";

    table.appendChild(tbody);
}

function birthdayOutput(birthday){
    let regexp = /[\d-]{10}/;
    let figureDate = birthday.match(regexp);
    let replacedStr = figureDate[0].replace(/-/g, ".");
    let parts = replacedStr.split(".");
    return  parts[2] + "." + parts[1] + "." + parts[0];
}

 function createHeaderTable(table, config, backendIInfo){
    
    let thead = table.createTHead();
    let row = thead.insertRow();
    let amountOfCols = 0;
    let th = document.createElement("th");
    th.textContent="№";
    row.appendChild(th);
    amountOfCols++;
    let columnsChoice;
    if (backendIInfo) {
        columnsChoice = config.columns2;
    } else {
        columnsChoice = config.columns1;
    }

    for (let key of columnsChoice) {
        let th = document.createElement("th");
        let text = `${key.title}`;
        th.textContent=text;
        row.appendChild(th);
        amountOfCols++;
    }

    thead.appendChild(row);
    thead.style.textAlign ="start";
    thead.style.fontSize ="20px";
    thead.style.border = "3px solid purple";
    thead.style.color = "purple";

    table.appendChild(thead);
    return amountOfCols;
}

async function getInformation(config){
    let response = await fetch(config.apiUrl);

    if (response.ok) { 
        let json = await response.json();
        let users = json.data;
        return users;
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
 }
 
 const config1 = {
   parent: '#usersTable',
   columns1: [
     {title: 'Ім’я', value: 'name'},
     {title: 'Прізвище', value: 'surname'},
     {title: 'Вік', value: 'age'},
   ],
   columns2: [
    {title: 'Name', value: 'name'},
    {title: 'Surname', value: 'surname'},
    {title: 'Avatar', value: 'avatar'},
    {title: 'Birthday', value: 'birthday'},
  ],
   apiUrl: "https://mock-api.shpp.me/mkruchok/users"
 };
 
 let data1 = [
    {id: 30050, name: 'Вася', surname: 'Петров', age: 12},
    {id: 30051, name: 'Вася', surname: 'Васечкін', age: 15},
  ];
 
 DataTable(config1, data1 = null);