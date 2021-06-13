(async function () {

    const baseUrl = 'https://free.currconv.com/api/v7';
    const urlEnd = 'apiKey=e6ec7c97debcb9156a8a';
    const currencyTemplate = document.querySelector("#currency-template");
    const converted = document.querySelector(".convert-input input");
    const submitBtn = document.querySelector(".submit-convert");
    const dropdowns = document.querySelectorAll("#currency");
    const startingDropdown = document.querySelector(".starting-currency");
    const targetDropdown = document.querySelector(".target-currency");
    const convertedContainer = document.querySelector(".display-results");

    const currencies = await axios.get(`${baseUrl}/currencies?${urlEnd}`)
        .then(res => res.data)
        .catch(e => console.error(e));

    const InputsModule = (() => {
        let currentRatio, lastStartingCurr, lastTargetCurr;

        const calculateConversion = () => {
            const convertedQuantity = converted.value;
            const parsedQuant = parseFloat(convertedQuantity)
            if (parsedQuant != NaN) { // Check if value parsed was not string
                return convertedQuantity * currentRatio;
            } else {
                return false;
            }
        }

        const displayResults = (result, convertedCurr) => {
            convertedContainer.innerText = result.toFixed(3) + " " + convertedCurr;
        }

        const sameCurrencies = (startingCurr, targetCurr) => {
            if (startingCurr == lastStartingCurr && targetCurr == lastTargetCurr) {
                return true;
            } else {
                lastStartingCurr = startingCurr;
                lastTargetCurr = targetCurr;
                return false;
            }
        }

        const sendConversion = async (convertedCurr, toConvertCurr) => {
            // Avoid downloading same data if user is converting same currencies multiple times
            if (!sameCurrencies(convertedCurr, toConvertCurr)) {
                const currenciesSymbol = `${convertedCurr}_${toConvertCurr}`;
                const url = `${baseUrl}/convert?q=${currenciesSymbol}&compact=ultra&${urlEnd}`;
                const ratio = await axios.get(url)
                    .then(res => res.data[currenciesSymbol])
                    .catch(e => console.error(e));
                currentRatio = ratio;
            }
            const result = calculateConversion();
            if (result) {
                displayResults(result, convertedCurr)
            } else {
                console.error("Typed value is not a number!");
                return;
            }
        }

        const submitConversion = () => {
            const startingCurr = startingDropdown.value;
            const targetCurr = targetDropdown.value;
            if (startingCurr && targetCurr && startingCurr !== targetCurr) {
                sendConversion(startingCurr, targetCurr);
            } else {
                console.error("Can't convert");
                return false;
            }
        }

        const listenForSubmit = () => {
            submitBtn.addEventListener("click", submitConversion);
        }

        const renderList = (() => {
            Object.keys(currencies.results).sort().forEach(curr => {
                dropdowns.forEach(dropdown => {
                    const template = document.importNode(currencyTemplate.content, true);
                    const option = template.querySelector("option");
                    option.innerText = curr;
                    option.setAttribute("id", curr);
                    option.setAttribute("value", curr);
                    dropdown.appendChild(option);
                });
            });
            listenForSubmit();
        })();

    })();

})()