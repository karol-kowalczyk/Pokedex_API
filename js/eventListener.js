window.addEventListener("resize", handleResize);

document.addEventListener("DOMContentLoaded", function () {
    const tooltip = document.getElementById("tooltip");
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!isMobile) { // Only add event listeners if the device is not mobile
        isNotMobileDevice();
    }
});

function isNotMobileDevice() {
    document.querySelectorAll("[data-tooltip]").forEach((element) => {
        let timer;

        mouseEnter(element, timer);
        mouseMove(element);
        mouseLeave(element, timer);
    });
}

function mouseEnter(element, timer) {
    element.addEventListener("mouseenter", function (event) {
        tooltip.innerText = event.target.getAttribute("data-tooltip");
        tooltip.style.opacity = "1";
        tooltipTimeout(timer);
    });
}

function tooltipTimeout(timer) {
    timer = setTimeout(() => {
        tooltip.style.opacity = "0";
    }, 3000);
}

function mouseMove(element) {
    element.addEventListener("mousemove", function (event) {
        tooltip.style.left = event.pageX + 10 + "px";
        tooltip.style.top = event.pageY + 10 + "px";
    });
}

function mouseLeave(element, timer) {
    element.addEventListener("mouseleave", function () {
        clearTimeout(timer);
        tooltip.style.opacity = "0";
    });
}