/**
 * Event listener for window resize events.
 * @param {Event} event - The resize event object.
 */
window.addEventListener("resize", handleResize);

/**
 * Event listener for when the DOM content is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    const tooltip = document.getElementById("tooltip");
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
        isNotMobileDevice();
    }
});

/**
 * Function to handle operations when the device is not mobile.
 */
function isNotMobileDevice() {
    // Select all elements with data-tooltip attribute and attach event listeners
    document.querySelectorAll("[data-tooltip]").forEach((element) => {
        let timer; // Timer variable for tooltip timeout
        mouseEnter(element, timer); // Attach mouseenter event listener
        mouseMove(element); // Attach mousemove event listener
        mouseLeave(element, timer); // Attach mouseleave event listener
    });
}

/**
 * Function to handle mouseenter event for showing tooltip.
 * @param {HTMLElement} element - The element triggering the event.
 * @param {number} timer - Timer variable for tooltip timeout.
 */
function mouseEnter(element, timer) {
    element.addEventListener("mouseenter", function (event) {
        tooltip.innerText = event.target.getAttribute("data-tooltip");
        tooltip.style.opacity = "1";
        tooltipTimeout(timer);
    });
}

/**
 * Function to set a timeout to hide the tooltip.
 * @param {number} timer - Timer variable for tooltip timeout.
 */
function tooltipTimeout(timer) {
    timer = setTimeout(() => {
        tooltip.style.opacity = "0";
    }, 3000);
}

/**
 * Function to handle mousemove event for positioning tooltip.
 * @param {HTMLElement} element - The element triggering the event.
 */
function mouseMove(element) {
    element.addEventListener("mousemove", function (event) {
        tooltip.style.left = event.pageX + 10 + "px";
        tooltip.style.top = event.pageY + 10 + "px";
    });
}

/**
 * Function to handle mouseleave event for hiding tooltip.
 * @param {HTMLElement} element - The element triggering the event.
 * @param {number} timer - Timer variable for tooltip timeout.
 */
function mouseLeave(element, timer) {
    element.addEventListener("mouseleave", function () {
        clearTimeout(timer); // Clear the tooltip timeout
        tooltip.style.opacity = "0"; // Hide the tooltip
    });
}