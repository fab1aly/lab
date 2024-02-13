

/******************************************************************/

// Disable Article Function
function disableHome() {
    const home_link = document.querySelector('#nav-home');
    home_link.textContent = "Home";
    home_link.classList.remove("selected");

    const home_article = document.querySelector('#home');
    home_article.style.display = "none";
}
function disableLab_1() {
    const lab_1_link = document.querySelector('#nav-lab_1');
    lab_1_link.textContent = "lab_1";
    lab_1_link.classList.remove("selected")

    const lab_1_article = document.querySelector('#lab_1');
    lab_1_article.style.display = "none";
}
function disableLab_2() {
    const lab_2_link = document.querySelector('#nav-lab_2');
    lab_2_link.textContent = "lab_2";
    lab_2_link.classList.remove("selected")

    const lab_2_article = document.querySelector('#lab_2');
    lab_2_article.style.display = "none";
}

// Circle Element for Nav link
const circle_element = '<span style="font-size: 1.4rem;">&#x25CF;</span>'

// Nav Function
function displayHome() {
    const home_link = document.querySelector('#nav-home');
    home_link.innerHTML = circle_element;
    home_link.classList.add("selected");

    const home_article = document.querySelector('#home');
    home_article.style.display = "flex";

    disableLab_1();
    disableLab_2();

    history.replaceState("null", "", "#home");
}
function displayLab_1() {
    const lab_1_link = document.querySelector('#nav-lab_1');
    lab_1_link.innerHTML = circle_element;
    lab_1_link.classList.add("selected");

    const lab_1_article = document.querySelector('#lab_1');
    lab_1_article.style.display = "flex";

    disableHome();
    disableLab_2();

    history.replaceState("null", "", "#lab_1");
}
function displayLab_2() {
    const lab_2_link = document.querySelector('#nav-lab_2');
    lab_2_link.innerHTML = circle_element;
    lab_2_link.classList.add("selected");

    const lab_2_article = document.querySelector('#lab_2');
    lab_2_article.style.display = "flex";

    disableHome();
    disableLab_1();

    history.replaceState("null", "", "#lab_2");
}

/******************************************************************/

// Hash in URL
const hash = window.location.hash;
// console.log(hash)
switch (hash) {
    case "#home":
        displayHome();
        break;
    case "#lab_1":
        displayLab_1();
        break;
    case "#lab_2":
        displayLab_2();
        break;

    default:
        displayHome();
        break;
}

/******************************************************************/

// one Project display

const details = document.querySelectorAll("details");
// Add the onclick listeners.
details.forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (detail.open) setTargetDetail(detail);
  });
});

// Close all the details that are not targetDetail.
function setTargetDetail(targetDetail) {
  details.forEach((detail) => {
    if (detail !== targetDetail) {
      detail.open = false;
    }
  });
}

/******************************************************************/