const main = document.querySelector("#main_page");
const collectionBtn = main.querySelector("#collection");
const createBtn = main.querySelector("#create");
const createPage = document.querySelector("#create_page");
const collectionPage = document.querySelector("#collection_page");

function createBtnClicked(){
    main.classList.remove("flex");
    main.classList.add("hidden");
    createPage.classList.remove("hidden");
}

function collectionBtnClicked(){
    main.classList.remove("flex");
    main.classList.add("hidden");
    collectionPage.classList.remove("hidden");
}

createBtn.addEventListener("click", createBtnClicked);
collectionBtn.addEventListener("click", collectionBtnClicked);