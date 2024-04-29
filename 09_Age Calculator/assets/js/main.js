let userInput = document.getElementById("date");
userInput.max = new Date().toISOString().split("T")[0];
let result = document.getElementById("result");

function calculateAge(){
  let birthDate = new Date(userInput.value);

  let d1 = birthDate.getDate();
}
