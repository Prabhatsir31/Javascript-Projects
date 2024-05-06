const accessKey = "ss3TsIr6pJhdSNytiildtnAVddtcahhehC-UigZXmjs";

const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");

let keyword = "";
let page = 1;

async function searchImages(){
    keyword = searchBox.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=15`;

    const response = await fetch(url);
    const data = await response.json();
    if(page === 1)
    {
        searchResult.innerHTML = "";
    }
    
    const results = data.results;

    results.map((result) =>{
        const image = document.createElement("img");
        image.src = result.urls.small;
        const imageLink = document.createElement("a");
        imageLink.href = result.links.html;
        imageLink.target = "_blanks";


        imageLink.appendChild(image);
        searchResult.appendChild(imageLink);
    })

    showMoreBtn.style.display = "block";
}

searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    page = 1;
    searchImages();
});

showMoreBtn.addEventListener("click", ()=>{
    page++;
    searchImages();
})



// const searchForm = document.getElementById("search-form");
// const searchBox = document.getElementById("search-box");
// const searchResult = document.getElementById("search-result");
// const searchMoreBtn = document.getElementById("search-more-btn");

// let keyword = "";
// let page = 1;
// const perPage = 10; // Number of images per page
// const accessKey = "YOUR ACCESSKEY"; // Replace with your actual Unsplash access key

// async function searchImages() {
//     try {
//         keyword = searchBox.value;
//         const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}`;

//         const response = await fetch(url);
//         const data = await response.json();

//         // Render the search results
//         renderResults(data.results);
//     } catch (error) {
//         console.error("Error fetching images:", error);
//     }
// }

// function renderResults(images) {
//     // Clear previous search results
//     searchResult.innerHTML = "";

//     // Render each image
//     images.forEach(image => {
//         const imgElement = document.createElement("img");
//         imgElement.src = image.urls.regular;
//         searchResult.appendChild(imgElement);
//     });

//     // Show more button if there are more pages
//     if (images.length === perPage) {
//         searchMoreBtn.style.display = "block";
//     } else {
//         searchMoreBtn.style.display = "none";
//     }
// }

// searchForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     page = 1;
//     searchImages();
// });

// searchMoreBtn.addEventListener("click", () => {
//     page++;
//     searchImages();
// });
