const searchContainer = document.getElementById("search_container");
const searchBar = document.getElementById("search");
const templates = document.querySelectorAll("input[type='radio']");
const chosenTemplate = document.querySelector("#chosen_one");
const titleContainer = document.querySelector("#title_container");
const savedTopster = document.getElementById("save_topster");
const searchResults = document.getElementById("search_result_container");
const eachResultContainers = document.querySelectorAll(".each_result");

let templateId;
let draggedItemClass;
let titleLoaded;
let eachTitles;

const api_key = "cc9cd7dbf841a2ea2bc6a05f10edd789";
const url = "https://ws.audioscrobbler.com/2.0";


searchContainer.addEventListener("submit", onSearch); // search for album title or artist
function onSearch(evt){
    evt.preventDefault();
    //update result for each search; ohterwise album cover is stacked and shows past result together
    if(eachResultContainers[0].hasChildNodes()){
        eachResultContainers.forEach(container => {
            container.innerHTML = '';
        });
    }
    loadAlbums();
}

//LastFm api request for albums and load result
async function loadAlbums(){
    try {
        const response = await fetch(`${url}?method=album.search&limit=24&album=${searchBar.value}&api_key=${api_key}&format=json`);
        const result = await response.json();
        for(i=0;i<24;i++){
            let imageURL = result.results.albummatches.album[i].image[3]['#text'];
            let titleName = result.results.albummatches.album[i].name;
            let imageChild = document.createElement("img");
            if(imageURL === '') {
                imageChild.src = "empty.png";
                imageChild.alt = titleName;
                imageChild.draggable = false;
            }
            else imageChild.src = imageURL;
            imageChild.id = `pic${i+1}`;
            eachResultContainers[i].appendChild(imageChild);
            imageChild.addEventListener("dragstart", dragStart);
            imageChild.addEventListener("dragover", dragOver);
            imageChild.addEventListener("dragend", dragEnd);
        }
    }catch (e) {
        alert("no matches found");
    }
}




savedTopster.addEventListener("submit", onSave);
function onSave(evt){
    evt.preventDefault();
    //save the topster to the collection (maybe use local storage)
    //localStorage.setItem("collection 1", document.querySelectorAll(".album").innerHTML);
}



templates.forEach(temp => {
    temp.addEventListener("click", tempClicked);
});//user selects templates to create and click on it
function tempClicked(event){
    templateId = event.target.value;
    if(!chosenTemplate.hasChildNodes()){ //get id of selected templates so that it can create div for templates, if statement to check if templates are selected not the empty space of the temp container
        //document.querySelector("#templates_container").classList.add("hidden");
        document.querySelector("#chosen_one_container").classList.remove("hidden");
        createTemp(templateId);
    }else{
        while(chosenTemplate.hasChildNodes()) chosenTemplate.removeChild(chosenTemplate.lastChild);
        createTemp(templateId);
    }
}
function createTemp(size){// instead of having html for every templates written down beforehand, create only for the selected template to save lines of code for html file
    for(i=0; i<size; i++){
        let albumContainer = document.createElement("div");
        albumContainer.classList.add("album");
        albumContainer.style.cssText = `height: calc(87vh/${Math.sqrt(size)});`;
        albumContainer.id = `num${i+1}`;
        chosenTemplate.appendChild(albumContainer);
    }
    chosenTemplate.style.cssText = `grid-template-columns: repeat(${Math.sqrt(size)}, calc(87vh/${Math.sqrt(size)})`; //this cant be done in css as the noOfColuns varies for each template
    let albums = document.querySelectorAll(".album"); //get all independent album as an array
    albums.forEach(album => {
        album.addEventListener("dragenter", dragEnter);
        album.addEventListener("dragleave", dragLeave);
        album.addEventListener("dragover", dragOver);
        album.addEventListener("drop", drop);
    });
}
//drag and drop events
let origin;
function dragStart(e){
    e.target.style.opacity = '0.6';
    draggedItemClass = e.target.className;
    e.dataTransfer.setData("text/plain", e.target.id);
}
function dragOver(e){
    e.preventDefault();
}
function dragEnter(){
    if(!this.hasChildNodes()) this.style.border = "dashed 1.5px white";
}
function dragLeave(){
    if(!this.hasChildNodes()) this.style.border = "solid 1.5px white";
}
function dragEnd(e){
    e.target.style.opacity = '1';
}
function drop(e){
    e.preventDefault();
    this.style.border = "0";
    const data = e.dataTransfer.getData("text");
    if(!this.hasChildNodes()){

        if(draggedItemClass != "copiedAlbum"){
            const nodeCopy = document.getElementById(data).cloneNode(true);
            nodeCopy.style.opacity = '1';
            nodeCopy.id = Date.now() + Math.random();
            nodeCopy.className = "copiedAlbum";
            this.appendChild(nodeCopy);
            nodeCopy.addEventListener("dragstart", e =>{
                origin = e.target.parentElement;
                draggedItemClass = e.target.className;
                e.target.style.opacity = "0.6";
                e.dataTransfer.setData("text/plain", e.target.id);
            });
            nodeCopy.addEventListener("dragover", e => e.preventDefault());
            nodeCopy.addEventListener("dragend", e => e.target.style.opacity = '1');
        }else{
            this.appendChild(document.getElementById(data));
            if(!origin.hasChildNodes()){
                origin.style.border = "solid 1.5px white";
            }
        }
    } else return;
}