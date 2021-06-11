
(function () {
    let canvas = document.querySelector("canvas");
    const loader = document.querySelector('.loader');
    const message = document.querySelector('.loader .message');
    const detectorMessage = document.querySelector(".detector-message");
    const buttons = document.querySelectorAll("button");
    const video = document.querySelector("#video");
    const imgElement = document.querySelector("img");
    const placeholder = document.querySelector("div.source");
    const alert = document.querySelector(".alert");
    let modelsLoaded = false;

    loading = {};
    const loadingProxy = new Proxy(loading, {
        set: function (target, key, value) {
            target[key] = value;
            value ? loader.classList.add("active") : loader.classList.remove('active');
            return true;
        }
    });

    const displayError = (e, time) => {
        alert.innerHTML = e;
        alert.classList.add("active");
        if (time) {
            setTimeout(() => {
                alert.classList.remove("active");
            }, time)
        } else {
            return;
        }
    }

    const isLocalhost = () => {
        const host = location.host.split(":")[0];
        return (host === "localhost" || host === '127.0.0.1') ? true : false;
    }

    // Suspend app due to no support on non-https websites
    const isHttps = (() => {
        if (location.protocol !== "https:" && !isLocalhost()) {
            displayError("This app needs to be runned on HTTPS secured website!", 0);
            return false;
        }
        return true;
    })()

    if (!isHttps) return;

    const loadModels = async val => {
        // Enable loading screen
        loadingProxy.enabled = true;
        message.innerHTML = "Loading models";

        // Load models
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        modelsLoaded = true;
    }

    const displayResults = (detections, el) => {
        const displaySize = { width: el.offsetWidth, height: el.offsetHeight }
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        faceapi.matchDimensions(canvas, displaySize);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }

    const WebcamModule = (() => {
        let detectionStarted;

        const init = async () => {
            video.classList.add("selected");
            imgElement.classList.remove("selected");
            placeholder.classList.remove("selected");
            if (!modelsLoaded) {
                await loadModels();
            }
            loadWebcam().then(() => startDetection()).catch(e => e);
        };

        const checkDetection = () => detectionStarted ? detectionStarted : 0;

        const loadWebcam = () => {
            message.innerHTML = "Loading webcam";
            // Load webcam to the <video> tag
            if (navigator.mediaDevices.getUserMedia) {
                return new Promise(async (resolve, reject) => {
                    console.log("started promise")
                    setTimeout(() => {
                        console.log("waiting")
                        navigator.mediaDevices.getUserMedia({ video: true })
                            .then(async stream => {
                                video.srcObject = stream;
                                detectorMessage.innerHTML = "Detecting faces...";
                                resolve();
                            })
                            .catch(err => {
                                console.error("Error: ", err);
                                loadingProxy.enabled = false;
                                displayError(err);
                                reject();
                            });
                    }, 10000);
                });
            }
        }

        const startDetection = () => {
            // Start live detection
            const interval = setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video).withFaceExpressions();
                displayResults(detections, video);
            }, 100);
            loadingProxy.enabled = false;
            detectorMessage.innerHTML = "Displaying detection..."
            detectionStarted = interval;
        }

        return {
            init,
            checkDetection
        }
    })()

    const ImageModule = (() => {
        const fileInput = document.querySelector('.upload-image input');

        const init = () => {
            if (WebcamModule.checkDetection()) {
                clearInterval(WebcamModule.checkDetection());
            }
            const fileContainer = document.querySelector(".upload-image");
            fileContainer.classList.add("active");
            bindUploadEvent();
        }

        const bindUploadEvent = async () => {
            fileInput.addEventListener("change", async () => {
                if (!modelsLoaded) {
                    await loadModels();
                }
                swapToImage();
                imageUploaded();
            })
        }

        const swapToImage = () => {
            placeholder.classList.remove('selected')
            video.classList.remove("selected");
            imgElement.classList.add("selected");
        }

        const imageUploaded = async () => {
            const file = fileInput.files[0];
            const img = await faceapi.bufferToImage(file); // Parse image so it can be used to detect faces
            const detections = await faceapi.detectAllFaces(img).withFaceExpressions();
            imgElement.src = img.src;
            message.innerHTML = "Detecting";
            loadingProxy.enabled = false;
            displayResults(detections, imgElement);
        }

        return {
            init
        }
    })();

    // Bind events to buttons below placeholder
    buttons.forEach(button => {
        const val = button.dataset.value;
        button.addEventListener("click", async function () {
            val == "cam" ? WebcamModule.init() : ImageModule.init();
        });
    });

})()