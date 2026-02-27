let acc = document.getElementsByClassName("accordion");
let accActive = document.getElementsByClassName('active');

let i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {

        if (this.classList.contains('blocked')) {

        }
        else {
            this.classList.toggle("active");
            let panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        }
    });
}

window.addEventListener('resize', function() {
    for (i = 0; i < accActive.length; i++) {
        if (accActive[i].classList.contains("active")) {
            let panel = accActive[i].nextElementSibling;

            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    }
});
