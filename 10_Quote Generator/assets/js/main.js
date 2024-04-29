const quote = document.getElementById("quote");
const author = document.getElementById("author");
// const tags = document.getElementById("tags");

const api_url = "https://api.quotable.io/random";

async function getquote(url){
    const response = await fetch(url);
    var data = await response.json();
    //  console.log(data);
    quote.innerHTML = data.content;
    author.innerHTML = data.author;
    // tags.innerHTML = data.tags;
}

getquote(api_url);

function tweet()
{
    window.open("https://twitter.com/intent/tweet?text=" + quote.innerHTML + "---by " + author.innerHTML, "Tweet Window", "width=600, height=300");
}
