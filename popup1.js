const tpo = document.querySelector(".ypo");
const ytlinks = document.querySelectorAll(".youtube-link");
const iframe = document.querySelector(".popup video");

ytlinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const videoUrl = link.dataset.videoUrl; // Assuming you have data-video-url attribute on each .youtube-link element
        const videoUrlWithoutAutoplay = videoUrl.replace('autoplay=1', 'autoplay=0');
        iframe.src = videoUrlWithoutAutoplay;
        tpo.classList.add("active");
    });
});

tpo.addEventListener("click", () => {
    tpo.classList.remove("active");
    iframe.src = ""; // Stop the video when the popup is closed
});
