"use strict";
window.addEventListener("DOMContentLoaded", init);
let bloodArray = [];
let allStudents = [];
let halfArray = [];
let expelledArray = [];
let inquisitorialArray = [];
let prefectsArray = [];
let hack = false;

let filterValue;
let sortValue;

const Student = {
  firstname: "",
  middlename: "",
  lastname: "",
  nickname: "",
  photo: "",
  house: "",
  blood: "",
  gender: "",
  expelled: false,
  prefect: false,
  club: false,
};

function init() {
  fetchStudentList();
  fetchFamilyList();
}
async function fetchStudentList() {
  const response = await fetch(
    "https://petlatkea.dk/2020/hogwarts/students.json"
  );
  const jsonData = await response.json();

  prepareObjects(jsonData);
}
function fetchFamilyList() {
  fetch("http://petlatkea.dk/2020/hogwarts/families.json")
    .then((res) => res.json())
    .then((bloods) => {
      bloodArray = bloods;
      halfArray = bloods.half.map((x) => x);
      halfArray.push(bloods.half);
    });
}
function prepareObjects(jsonData) {
  allStudents = jsonData.map(preapareObject);

  buildList();
}

// when loaded, prepare data objects

function buildList() {
  let currentList = allStudents; // FUTURE: Filter and sort currentList before displaying
  displayList(currentList);
  document
    .querySelector("[data-field=sort]")
    .addEventListener("change", doSort);
  document
    .querySelector("[data-field=filter]")
    .addEventListener("change", doFilter);
  document.querySelector(".search").addEventListener("keyup", doSearch);
}

function doSearch(e) {
  console.log(e.target.value);
}

function doSort(e, currentList) {
  console.log(e.target.value);
  if (e.target.value == "First Name") {
    currentList = allStudents.sort((a, b) =>
      a.firstname > b.firstname ? 1 : -1
    );
    console.log(currentList);
  } else if (e.target.value == "Last Name") {
    console.log("should sort by LName");

    currentList = allStudents.sort((a, b) =>
      a.lastname > b.lastname ? 1 : -1
    );
    console.log(currentList);
  } else if (e.target.value == "House") {
    currentList = allStudents.sort((a, b) => (a.blood > b.blood ? 1 : -1));
  } else if (e.target.value == "Blood") {
    currentList = allStudents.sort((a, b) => (a.blood > b.blood ? 1 : -1));
  }

  displayList(currentList);
}
function doFilter(e, currentList) {
  if (e.target.value === "Gryffindor") {
    currentList = allStudents.filter((e) => e.house === "Gryffindor");
    displayList(currentList);
  }
  if (e.target.value === "Slytherin") {
    currentList = allStudents.filter((e) => e.house === "Slytherin");
    displayList(currentList);
  }
  if (e.target.value === "Ravenclaw") {
    currentList = allStudents.filter((e) => e.house === "Ravenclaw");
    displayList(currentList);
  }
  if (e.target.value === "Hufflepuff") {
    currentList = allStudents.filter((e) => e.house === "Hufflepuff");
    displayList(currentList);
  }
  if (e.target.value === "Expelled") {
    displayList(expelledArray);
  }
  if (e.target.value === "Prefects") {
    displayList(prefectsArray);
  }
  if (e.target.value === "Inquisitorial") {
    displayList(inquisitorialArray);
  }
}
function preapareObject(jsonObject) {
  const student = Object.create(Student);
  const houseName = jsonObject.house.trim();
  student.house =
    houseName.substring(0, 1).toUpperCase() +
    houseName.substring(1).toLowerCase();
  const genderName = jsonObject.gender.trim();
  student.gender =
    genderName.substring(0, 1).toUpperCase() +
    genderName.substring(1).toLowerCase();
  let letter = jsonObject.fullname;

  student.nickname = "";
  if (letter.indexOf('"') != -1) {
    student.nickname = true;
    student.nickname = letter.substring(
      letter.indexOf('"') - 1,
      letter.lastIndexOf('"') + 2
    );
    letter = letter.replace(student.nickname, " ");
    student.nickname = student.nickname.trim();
  }
  letter = letter.trim();

  student.fullname = letter;
  const noOfSpaces = letter.split(" ").length - 1;
  if (noOfSpaces > 0) {
    student.firstname = letter.substring(0, letter.indexOf(" ")); //letter.substring(0, indexOf(" ") )
    student.firstname =
      student.firstname[0].toUpperCase() +
      letter.substring(1, letter.indexOf(" ")).toLowerCase();
  } else if (!noOfSpaces == 0) {
    student.firstname =
      letter[0].toUpperCase() + letter.substring(1, -1).toLowerCase();
    if (letter.includes("-")) {
      student.firstname =
        letter.substring(0, letter.indexOf(" "))[0].toUpperCase() +
        letter.substring(1, letter.indexOf(" ")).toLowerCase();

      student.middlename = letter.substring(
        letter.indexOf(" "),
        letter.indexOf("-")
      );
    }
    student.lastname = letter.substring(letter.indexOf("-"));
  } else {
    student.lastname = letter.substring(letter.lastIndexOf(" ") + 1);
    student.lastname[0].toUpperCase() +
      student.lastname.substring(1, -1).toLowerCase();
    student.middlename = letter[letter.indexOf(" ") + 1].toUpperCase();
    /* halfArray.forEach((element) => {
      console.log(element);
      if (element.includes(student.lastname)) {
        student.blood == "half";
      } else student.blood == "pure";
    }) */
  }
  /* halfArray.includes(student.lastname)
    ? (student.blood = "Half")
    : (student.blood = "Pure"); */

  if (noOfSpaces == 1) {
    student.middlename = "";
  } else {
    student.middlename = letter.substring(
      letter.indexOf(" "),
      letter.lastIndexOf(" ")
    );
  }
  if (noOfSpaces == 0) {
    student.firstname = letter;
    student.middlename = "";
    student.lastname = "";
  }
  if (noOfSpaces == 1) {
    student.lastname = letter.substring(letter.lastIndexOf(" ") + 1);
    student.lastname =
      student.lastname[0].toUpperCase() +
      letter.substring(letter.lastIndexOf(" ") + 2).toLowerCase();
  }
  if (noOfSpaces == 2) {
    student.middlename =
      letter[letter.indexOf(" ") + 1].toUpperCase() +
      letter
        .substring(letter.indexOf(" ") + 2, letter.lastIndexOf(" "))
        .toLowerCase();
  }

  /* student.lastname.forEach((element) => {
    halfArray.includes(element)
      ? (student.blood = "Half")
      : console.log(student.lastname);
  });
 */
  student.blood = setBloodStatus(student.lastName, student.house);
  function setBloodStatus(lastName, house) {
    if (house === "Slytherin") return "Pure";
    const result = halfArray.includes(student.lastname);
    if (result == undefined) return "Pure";
    else return "Half";
  }
  return student;
}

function displayList(student) {
  // clear the display
  document.querySelector(".grid").innerHTML =
    "<span><strong>Full Name</strong></span><span>  <strong>House</strong></span><span>  <strong>See More</strong></span>";

  // build a new list
  student.forEach(showStudent);
}
function showStudent(student) {
  console.log(student.lastname);
  let template = document.querySelector("template.table").content;
  const copy = template.cloneNode(true);
  copy.querySelector(
    ".cloneName"
  ).textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;

  copy.querySelector(".cloneHouse").textContent = student.house;
  //ADDED MODAL ON CLICK ON BUTTON
  const modal = document.querySelector(".modal-background");
  modal.addEventListener("click", () => {
    modal.classList.add("hide");
  });
  copy
    .querySelector(".detail-btn")
    .addEventListener("click", (showStudents) => {
      showDetails(student);
    });

  function showDetails(students) {
    console.log(students);

    modal.querySelector(".modal-name").textContent =
      students.firstname + " " + student.middlename + " " + student.lastname;
    let fullname = students.fullname;
    modal.querySelector(".modal-gender span").textContent = student.gender;
    if (student.nickname == true) {
      modal.querySelector(
        ".modal-nickname span"
      ).textContent = `Nickname : ${student.nickname}`;
    }
    modal.dataset.theme = students.house;
    let logo = modal.querySelector("img.crest-image");
    logo.src = "imgs/" + students.house.toLowerCase() + ".jpg";
    let image = modal.querySelector("img.student-image");
    //set Image
    if (
      student.lastname !== "" &&
      student.lastname !== "Patil" &&
      !student.lastname.includes("-")
    ) {
      image.src =
        "images/" +
        student.lastname.toLowerCase() +
        "_" +
        student.firstname[0] +
        ".png";
    } else if (student.lastname == "Patil") {
      image.src =
        "images/" +
        student.lastname.toLowerCase() +
        "_" +
        student.firstname.toLowerCase() +
        ".png";
    } else if (student.lastname.includes("-")) {
      console.log("hypen");
      image.src =
        "images/" +
        student.lastname
          .substring(student.lastname.indexOf("-") + 1)
          .toLowerCase() +
        "_" +
        student.firstname[0].toLowerCase() +
        ".png";
    } else {
      image.src = "images/no_img.png";
    }
    modal.classList.remove("hide");
    //Change Blood
    let blood = modal.querySelector(".modal-blood");
    blood.textContent = `${student.blood} Blood`;
    //Expel
    modal.querySelector(".expel").addEventListener("click", (e) => {
      console.log(student);
      expelledArray.push(student);
      const index = allStudents.indexOf(student);
      console.log(index);
      allStudents.splice(index, 1);
      displayList(allStudents);
    });

    //Inquisitorial
    modal.querySelector(".inquis").addEventListener("click", (e) => {
      if ((e.target.innerHTML = "Add to Inquisitorial")) {
        inquisitorialArray.push(student);
        e.target.innerHTML = "Remove from Inquis";
      }
      if ((e.target.innerHTML = "Remove from Inquis")) {
        e.target.innerHTML = "Add to Inquisitorial";
        //remove from inquis
      }
    });

    //Prefects
    modal.querySelector(".prefect").addEventListener("click", (e) => {
      inquisitorialArray.push(student);
    });

    return fullname;
  }
  modal.querySelector(".modal-blood").textContent = `${student.blood}`;

  document.querySelector(".grid").appendChild(copy);
}
//hack

function hackTheSystem() {
  hack = true;
  const me = {
    firstname: "Susan",
    middlename: "",
    lastname: "Khatri",
    nickname: "",
    gender: "Boy",
    photo: "",
    house: "Slytherin",
    blood: "Pure",
    expelled: false,
    prefect: false,
    club: false,
  };
  allStudents.push(me);
  displayList(allStudents);

  if (hack == true) {
    console.log([...document.querySelectorAll("button.expel")]);
    //couldn't expel
    /*  Array.from(document.querySelectorAll("button.expel"))[
      allStudents.length
    ].style.display = "none"; */
    //set random blood
    //toggle add to inquiostorial
  }
}
//prefects
//max 2 from same house

//expelling stds
//remove from list and adds to expelArray

//Add to inquiostorial
/* only pure-blood or students from Slytherin. */
