const main = document.querySelector("#main_page");
const createBtn = main.querySelector("#create");
const createPage = document.querySelector("#create_page");

function createBtnClicked(){
    main.classList.remove("flex");
    main.classList.add("hidden");
    createPage.classList.remove("hidden");
}
createBtn.addEventListener("click", createBtnClicked);