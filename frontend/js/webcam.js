const video = document.getElementById("video");
const status = document.getElementById("faceStatus");

// Start Camera
async function startCamera() {

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;

        status.innerHTML = "✅ Camera Active";

    } catch (error) {

        console.error(error);

        status.innerHTML = "❌ Camera Access Denied";
    }
}

startCamera();

// Monitor User Focus
setInterval(() => {

    if (document.hidden) {

        status.innerHTML = "⚠ User Left Screen";

        if (typeof handleDistraction === "function") {
            handleDistraction();
        }

    } else {

        status.innerHTML = "✅ User Focused";
    }

}, 3000);

// Camera Status Check
setInterval(() => {

    if (
        video.srcObject &&
        video.readyState >= 2
    ) {

        console.log("Camera Running");

    }

}, 5000);