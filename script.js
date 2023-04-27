async function DataTable(config, data1) {
    let addBtn = document.createElement('button');
    addBtn.innerHTML = "Add user";
    addBtn.className = "btnAdd";

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
    table.className = "table";
    let amountOfCols = createHeaderTable(table, config, backendIInfo);
    let tbody = createTableBody(table, amountOfCols, users);
    if (backendIInfo){
      addBtn.onclick = function () {addUser(tbody)};
      div.appendChild(addBtn);
    }
    div.appendChild(table);
}

function createTableBody(table, amountOfCols, users){
    let tbody = document.createElement("tbody");
    let counter = 0;

    for (let userId in users){
      let user = users[userId];
      let row = tbody.insertRow();
      const information = [`${user.name}`, `${user.surname}`,`${user.avatar}`, `${user.birthday}`];

      for (let i = 0; i < amountOfCols; i++){
        let cell = row.insertCell(i);
        cell.style.padding = "10px";
        
        if (i === 0){
          cell.innerHTML = ++counter;
          user.id = userId;
          continue;
        }

        if (information[i-1] === user.avatar){
            let img = document.createElement('img');
            img.src = information[i-1];
            img.alt = information[i-1];
            cell.appendChild(img); 
        } 
        else if (information[i-1] === user.birthday){
            cell.innerHTML = birthdayOutput(user.birthday);
        }
        else if (information[i-1] === user.action){
          let button = document.createElement('button');
          button.innerHTML = "Delete";
          button.onclick = function () { deleteUser(user.id, users) };
          button.className = "deleteButton";
          cell.appendChild(button);
        }
        else {
          cell.innerHTML = information[i-1];
        }
      }
      tbody.appendChild(row);
    }

    table.appendChild(tbody);
    return tbody;
}

function addUser(tbody){
  let row = tbody.insertRow(0);
  addInputRow(row);
  tbody.appendChild(row);
  let existingRow = tbody.rows[0];
  tbody.insertBefore(row, existingRow);
}

function addInputRow(row){
  let inputText = row.insertCell(0);
  inputText.appendChild(document.createElement('p'));
  inputText.innerHTML = "Input information:"
  
  let nameInput = row.insertCell(1);
  let inputN = document.createElement('input');
  inputN.placeholder = "Name";
  nameInput.appendChild(inputN);
  nameInput.addEventListener('keydown', function(event) {
    
    if (event.keyCode === 13) {
      verify(inputN, inputS, inputBd)
    }
  });

  let surnameInput = row.insertCell(2);
  let inputS = document.createElement('input');
  inputS.placeholder = "Surname";
  surnameInput.appendChild(inputS);
  surnameInput.addEventListener('keydown', function(event) {

    if (event.keyCode === 13) {
      verify(inputN, inputS, inputBd)
    }
  });
  
  let photoInput = row.insertCell(3);
  let photo = document.createElement('input');
  photo.type = "file";
  photo.id = "photoInput";
  photoInput.appendChild(photo);

  let dateInput = row.insertCell(4);
  let inputBd = document.createElement('input');
  inputBd.placeholder = "Birthday (dd.mm.yyyy)";
  dateInput.appendChild(inputBd);

  dateInput.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
      verify(inputN, inputS, inputBd)
    }
  });

  let add = row.insertCell(5);
  let button = document.createElement('button');
  button.innerHTML = "Add";
  button.style.width = "100px";
  button.onclick = function () { verify(inputN, inputS, inputBd) };
  add.appendChild(button);
}

function verify(inputN, inputS, inputBd){
  let name = inputN.value;
  let surname = inputS.value;
  let birthday = inputBd.value;
  let fullInfo = true;

  if (name === ""){
    inputN.className = "warning";
    fullInfo = false;
  } else {
    inputN.className = "normal";
  }
  if (surname === ""){
    inputS.className = "warning";
    fullInfo = false;
  } else {
    inputS.className = "normal";
  }

  let photo = document.getElementById("photoInput"); 
  if (!photo.files || photo.files.length === 0){
    photo.style.color = "red";
    fullInfo = false;
  } else {
    photo.style.color = "black";;
  }
  let figureDate = checkBirthday(birthday);
  if (birthday === "" || figureDate === null){
    inputBd.className = "warning";
    fullInfo = false;
  } 
  else {
    inputBd.className = "normal";
  }

  if (fullInfo){
    sendInfoToBack(name, surname, photo.value, figureDate[0]);
  }
}

function sendInfoToBack(name, surname, photo, birthday) {
  fetch(config1.apiUrl, {
    method: 'POST',
    body: JSON.stringify({
      name: name,
      surname: surname,
      avatar: photo,
      birthday: birthday,
    }),
  })
    .then(response => response.json())
    .then(response => {console.log(JSON.stringify(response));
      console.log('User added successfully');
      console.log("redraw table");
      DataTable(config1);
      location.reload();}
      )
    .catch(error => {
      console.error(error);
    })

}

function checkBirthday(birthday){
  let regexp = /\d{2}\.\d{2}\.\d{4}/;
  return birthday.match(regexp);
}

function deleteUser(userId, users){
  
  for (let user in users){
    let toBeDeleted = users[user];

    if (toBeDeleted.id === userId){
      fetch(config1.apiUrl + `/${toBeDeleted.id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        console.log('User deleted successfully');
        console.log("redraw table");
        DataTable(config1);
        location.reload();
      })
      .catch(error => {
        console.error(error);
      })
      break; 
    }
  }
}

function birthdayOutput(birthday){
    let regexp1 = /\d{2}\.\d{2}\.\d{4}/;
    if (birthday.match(regexp1)){
      return birthday;
    }
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
    thead.className = "thead";
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
        alert("Error HTTP: " + response.status);
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
    {title: 'Actions', value: 'actions'},
  ],
   apiUrl: "https://mock-api.shpp.me/mkruchok/users"
 };
 
 let data1 = [
    {id: 30050, name: 'Вася', surname: 'Петров', age: 12},
    {id: 30051, name: 'Вася', surname: 'Васечкін', age: 15},
  ];
 
 DataTable(config1, data1=null);