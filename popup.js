const tpo = document.querySelector(".ypo");
const ytlinks = document.querySelectorAll(".youtube-link");

ytlinks.forEach((link) =>{
    link.addEventListener("click", () =>{
        tpo.classList.add("active");
    });
});

tpo.addEventListener("click",() =>{
    tpo.classList.remove("active");
});