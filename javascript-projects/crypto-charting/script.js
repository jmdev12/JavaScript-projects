'use strict';
(async function () {

    const clearSearchButton = document.querySelector(".clear");
    const loader = document.querySelector(".loader");
    const alert = document.querySelector(".alert");
    const listContainer = document.querySelector(".coins-list");
    const searchButton = document.querySelector(".search-button");
    let searched = false;
    let loadingVariable = {};
    let loading = new Proxy(loadingVariable, {
        set: function (target, key, value) {
            target[key] = value;
            console.log("loading", loadingVariable.isLoading)
            loadingVariable.isLoading ? loader.classList.add('active') : loader.classList.remove('active');
            return true;
        }
    })

    Array.prototype.swapContents = function (secondArray) {
        this.length = 0;
        this.splice(0, this.length, ...secondArray);
    }


    class Chart {
        constructor(el, data) {
            this.id = el.id;
            this.data = this.prepareData(data);
            this.initializeChart();
        }

        // Convert data to the format that can be used by D3
        prepareData(data) {
            return data.prices.map(d => {
                const convertedDate = new Date(d[0]).toLocaleDateString("pl-PL");
                return {
                    date: d3.timeParse("%d.%m.%Y")(convertedDate),
                    price: d[1]
                }
            });
        }

        initializeChart() {
            // Set chart container to visible
            document.querySelector(`#${this.id}`).classList.add('active')
            const containerWidth = document.querySelector(`#${this.id} .chart`).offsetWidth;
            let margin;

            // Set chart properties
            if (window.matchMedia("(max-width: 768px)").matches) {
                margin = { top: 10, right: 10, bottom: 30, left: 20 };
                this.width = containerWidth * 2 - margin.left - margin.right;
            } else {
                margin = { top: 10, right: 30, bottom: 30, left: 60 };
                this.width = containerWidth - margin.left - margin.right;
            }

            this.height = 400 - margin.top - margin.bottom;
            this.svg = d3.select(`#${this.id} .chart`)
                .append("svg")
                .attr("width", this.width + margin.left + margin.right)
                .attr("height", this.height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
            this.generateChart();
        }

        generateChart() {
            // Generate X axis
            const x = d3.scaleTime()
                .domain(d3.extent(this.data, function (d) { return d.date; }))
                .range([0, this.width]);

            this.svg.append("g")
                .attr("transform", "translate(0," + this.height + ")")
                .call(d3.axisBottom(x));

            // Generate Y axis
            const y = d3.scaleLinear()
                .domain([
                    Math.floor(d3.min(this.data, function (d) { return +d.price; }) / 10000) * 10000,
                    d3.max(this.data, function (d) { return +d.price; })])
                .range([this.height, 0]);

            this.svg.append("g")
                .call(d3.axisLeft(y));

            // Add the line
            this.svg.append("path")
                .datum(this.data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2.5)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.date) })
                    .y(function (d) { return y(d.price) })
                );
            this.addTooltip(x, y)
        }

        addTooltip(x, y) {
            let focus = this.svg.append("g")
                .attr("class", "focus")
                .style("display", "none");

            focus.append("circle")
                .attr("r", 4);

            focus.append("rect")
                .attr("class", "tooltip")
                .attr("width", 150)
                .attr("height", 60)
                .attr("x", 10)
                .attr("y", -22)
                .attr("rx", 4)
                .attr("ry", 4);

            focus.append("text")
                .attr("class", "tooltip-date")
                .attr("x", 18)
                .attr("y", -2);

            focus.append("text")
                .attr("class", "tooltip-price")
                .attr("x", 18)
                .attr("y", 18);

            this.xAssigned = x;
            this.yAssigned = y;
            this.focus = focus;

            this.svg.append("rect")
                .attr("class", "overlay")
                .attr("width", this.width)
                .attr("height", this.height)
                .on("mouseover", function () { focus.style("display", null); })
                .on("mouseout", function () { focus.style("display", "none"); })
                .on("mousemove", () => this.mousemove(this));
        }

        mousemove(self) {
            let bisectDate = d3.bisector(function (d) { return d.date; }).left,
                formatDate = d3.timeFormat("%m/%d/%y"),
                formatValue = d3.format(","),
                x0 = self.xAssigned.invert(d3.mouse(d3.event.target)[0]),
                i = bisectDate(self.data, x0, 1),
                d0 = self.data[i - 1],
                d1 = self.data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;

            // Update data on tooltip
            self.focus.attr("transform", "translate(" + self.xAssigned(d.date) + "," + self.yAssigned(d.price) + ")");
            self.focus.select(".tooltip-date").text(formatDate(d.date));
            self.focus.select(".tooltip-price").text(formatValue(d.price > 0.001 ? d.price.toFixed(4) : d.price) + "$");
        }
    }


    const APIServices = (function () {
        let currentPage = 1,
            pagesCalled = 0;
        const baseURL = 'https://api.coingecko.com/api/v3/coins';

        // Fetch all coins data
        const fetchPaginatedCoins = async function () {
            if (pagesCalled !== currentPage) {
                pagesCalled++;
                return await axios.get(
                    `${baseURL}/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=${currentPage}&sparkline=false`
                )
                    .then(res => {
                        currentPage++;
                        return res.data;
                    })
                    .catch(e => console.log(e));
            }
        }

        // Get data needed to render a chart
        const getSingleCoinPrice = async function (id) {
            return axios.get(`
                ${baseURL}/${id}/market_chart?vs_currency=usd&days=100&interval=daily`
            )
                .then(res => res.data)
                .catch(e => console.log(e));
        }

        // Get data to display when searching
        const getSingleCoinData = async function (id) {
            return axios.get(`${baseURL}/${id}`)
                .then(res => res.data).catch(e => {
                    alert.innerHTML = e.response.data.error;
                    alert.classList.add('active');
                    setTimeout(() => {
                        alert.classList.remove('active');
                    }, 2000)
                    return false;
                })
                .catch(e => console.log(e));
        }

        return {
            getSingleCoinPrice,
            fetchPaginatedCoins,
            getSingleCoinData
        }
    })();


    // Single symbol constructor
    const Symbol = function (data) {
        this.id = data.id;
        this.name = data.name;
        if (data.market_data) {
            this.img = data.image.small;
            this.percentage = data.market_data.price_change_percentage_24h.toFixed(3);
            this.price = data.market_data.current_price.usd;
        } else {
            this.img = data.image;
            this.price = data.current_price;
            this.percentage = data.price_change_percentage_24h.toFixed(3);
        }
    }


    const EventsModule = (function () {
        let lastCalled;

        const addRenderChartEvent = (el, symbol) => {
            const bindEventTo = el.querySelector(".list-element");
            bindEventTo.addEventListener("click", () => {
                const chart = document.querySelector(`#${symbol.id} .chart svg`);
                // Prevent from rendering chart multiple times
                if (!chart) {
                    ListModule.renderChart(el, symbol);
                }
                if (lastCalled) {
                    ListModule.clearChart(lastCalled);
                }
                lastCalled = symbol;
            });
        }

        const removeRenderChartListener = (el, symbol) => {
            el.removeEventListener("click", () => {
                ListModule.renderChart(el, symbol);
            });
        }

        const bindClearSearch = () => {
            clearSearchButton.classList.remove("hidden");
            clearSearchButton.addEventListener('click', SymbolsModule.clearSearch);
        }

        return {
            addRenderChartEvent,
            removeRenderChartListener,
            bindClearSearch
        }
    })()


    const SymbolsModule = (function () {

        const symbolsBackup = [];
        const symbolsArray = [];
        const SymbolProxy = {
            set(target, name, value) {
                target[name] = value;
                if (value) {
                    ListModule.renderList(value) // Update list everytime the list changes
                }
                return true;
            },
            get(target, name) {
                return target[name];
            }
        }

        const symbols = new Proxy(symbolsArray, SymbolProxy);

        const getSymbols = function () {
            return symbols;
        }

        const fetchSymbols = async function (resetPagination) {
            loading.isLoading = true;
            const results = await APIServices.fetchPaginatedCoins(resetPagination);
            loading.isLoading = false;
            setSymbols(results);
        };

        const setSymbols = async function (results) {
            Array.isArray(results) ? null : results = [results];
            results.forEach(result => {
                if (typeof result == 'object') {
                    const symbol = new Symbol(result);
                    symbols[symbols.length] = symbol;
                } else {
                    console.error("Wrong data passed: ", result);
                }
            });
        }

        const truncateData = () => {
            symbolsBackup.swapContents(symbols);
            symbols.length = 0;
            ListModule.clearList();
        }

        const handleSearch = async coin => {
            const searchedCoin = await APIServices.getSingleCoinData(coin);
            if (searchedCoin) {
                truncateData();
                setSymbols(searchedCoin);
                searched = true;
                return true;
            }
            return false;
        }

        const clearSearch = () => {
            searched = false;
            symbols.length = 0;
            ListModule.clearList();
            symbols.swapContents(symbolsBackup);
            ListModule.clearSearchInput();
            clearSearchButton.classList.add("hidden");
        }

        fetchSymbols()

        return {
            fetchSymbols,
            getSymbols,
            truncateData,
            handleSearch,
            clearSearch
        }
    })();


    const ListModule = (function () {
        const singleCoinTemplate = document.querySelector("#coin-template");
        const searchInput = document.querySelector("#search");

        const clearSearchInput = () => {
            searchInput.value = '';
        }

        const searchCoin = async function () {
            const value = searchInput.value;
            if (value) {
                const coinToSearch = prepareCoinValue(value);
                const searchSucceeded = await SymbolsModule.handleSearch(coinToSearch);
                if (searchSucceeded) {
                    EventsModule.bindClearSearch();
                }
            }
        }

        // Convert typed name to coin ID by removing whitespaces
        const prepareCoinValue = coin => {
            return coin.split(" ").join('').toLowerCase();
        }

        const clearList = () => {
            listContainer.innerHTML = '';
        }

        const renderList = symbol => {
            if (typeof symbol == 'object') {
                const coinTemplate = document.importNode(singleCoinTemplate.content, true);
                const mainElement = coinTemplate.querySelector("li");
                const percentageElement = coinTemplate.querySelector(".percentage");

                // Append data to element
                mainElement.setAttribute("id", `${symbol.id}`);
                coinTemplate.querySelector(".thumbnail").setAttribute("src", symbol.img);
                percentageElement.innerHTML = symbol.percentage + "%";
                coinTemplate.querySelectorAll(".name").forEach(el => el.innerHTML = symbol.name);
                coinTemplate.querySelectorAll(".price").forEach(el => el.innerHTML = symbol.price + "$");

                symbol.percentage > 0 ? // Change color of percentage number
                    percentageElement.classList.remove('negative') :
                    percentageElement.classList.add('negative');

                listContainer.appendChild(coinTemplate);
                EventsModule.addRenderChartEvent(mainElement, symbol);
            }
        }

        const renderChart = async (el, symbol) => {
            const prices = await APIServices.getSingleCoinPrice(symbol.id);
            new Chart(el, prices);
        }

        const clearChart = (symbol) => {
            const chartContainer = document.querySelector(`#${symbol.id}`);
            const chart = document.querySelector(`#${symbol.id} .chart svg`)
            if (chart) {
                chart.remove()
            }
            chartContainer.classList.remove('active');
        }

        return {
            renderList,
            clearChart,
            renderChart,
            searchCoin,
            clearList,
            clearSearchInput
        }

    })();

    searchButton.addEventListener('click', ListModule.searchCoin);
    window.addEventListener("scroll", () => {
        if ((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 30) && !searched) {
            SymbolsModule.fetchSymbols();
        }
    })

})();