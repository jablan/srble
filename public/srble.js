
const currentRowContainer = function () {
  return $($(".srble-row")[currentRowIndex]);
};

const letterInput = function () {
  return $(currentRowContainer().find("div.letter")[currentLetter]);
};

const inputChar = function (char) {
  if (char.toUpperCase() == "ENTER") {
    return sendWord();
  }
  if (char == "BACKSPACE") {
    if (letterInput().text() == "") {
      if (currentLetter > 0) {
        currentLetter--;
      }
    }
    letterInput().text("");
  } else {
    if (!allLetters.includes(char)) {
      return;
    }
    letterInput().text(char);
    if (currentLetter < 4) {
      currentLetter++;
    }
  }
};

const sendWord = function () {
  const word = currentRowContainer()
    .find("div.letter")
    .map(function (i) {
      return $(this).text();
    })
    .get()
    .join("");
  console.log(word);
  $.post("/word", { q: word }, function (response) {
    processResponse(response);
  }).fail(function (response) {
    if (response.responseJSON.error == "UNKNOWN_WORD") {
      $("#alert-not-found").show();
    }
    console.log(response);
  });
};

const getBadgeClass = function (code) {
  switch (code) {
    case 1:
      return "bg-warning";
      break;
    case 2:
      return "bg-success";
      break;
    default:
      return "bg-secondary";
      break;
  }
};

const processResponse = function (response) {
  console.log(response);
  const inputs = currentRowContainer().find("div.letter");

  response.forEach(function (letterResponse, i) {
    const input = inputs[i];
    $(input)
      .removeClass("bg-light bg-secondary bg-success bg-warning text-dark")
      .addClass(getBadgeClass(letterResponse.code))
      .text(letterResponse.letter);

    acknowledgeLetterResponse(letterResponse);
  });
  currentRowIndex++;
  currentLetter = 0;
};

const acknowledgeLetterResponse = function (letterResponse) {
  console.log(letterResponse);
  const key = $(
    "#keyboard button[data-letter='" + letterResponse.letter + "']"
  );
  if (letterResponse.code == 2) {
    key
      .removeClass("btn-light btn-warning btn-secondary")
      .addClass("btn-success");
  } else if (letterResponse.code == 1) {
    if (key.hasClass("btn-light")) {
      key.removeClass("btn-light").addClass("btn-warning");
    }
  } else {
    if (key.hasClass("btn-light")) {
      key.removeClass("btn-light").addClass("btn-secondary");
    }
  }
};

