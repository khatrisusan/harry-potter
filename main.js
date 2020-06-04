"use strict";
window.addEventListener("DOMContentLoaded", init);
let bloodArray = [];
let allStudents = [];
let halfArray = [];

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
    .querySelector("[data-field=filter]")
    .addEventListener("change", halfStart);
  document
    .querySelector("[data-field=sort]")
    .addEventListener("change", halfStart);
}
function halfStart(e, currentList) {
  console.log(e.target.value);
  if (e.target.value == "First Name") {
    console.log("should sort by FName");
    currentList = allStudents.sort();
    console.log(currentList);
  } else if (e.target.value == "Last Name") {
    console.log("should sort by LName");
    /* let roots = numbers.map(function(num) {
    return Math.sqrt(num) */

    currentList = allStudents.map((student) => student.lastname).sort();
    console.log(currentList);
    //currentList = allStudents.sort();
  }
  if (e.target.value == "House") {
    console.log("should sort by house");
  }
  if (e.target.value == "Blood") {
    console.log("should sort by blood");
  }
  displayList(currentList);
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
    halfArray.forEach((element) => {
      console.log(element);
      if (element == student.lastname) {
        student.blood == "pure";
      } else student.blood == "pure";
    });
  }
  /*   let LName = letter
      .substring(letter.lastIndexOf(" ") + 1)[0]
      .toUpperCase()
      .substring(1, -1)
      .toLowerCase();
    if (halfArray.includes(LName)) {
      student.blood = "half";
    } else {
      student.blood = "pur";
    } */

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

  return student;
}

function displayList(student) {
  // clear the display
  //document.querySelector("main").innerHTML = "";

  // build a new list
  student.forEach(showStudent);
}
function showStudent(student) {
  console.log(student);
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
    halfArray.includes(student.lastname)
      ? (blood.textContent = "Half Blood")
      : (blood.textContent = "Pure Blood");
    console.log(halfArray);
    console.log(student.lastname);

    return fullname;
  }
  modal.querySelector(".modal-blood").textContent = `${student.blood}`;

  document.querySelector(".grid").appendChild(copy);
}
