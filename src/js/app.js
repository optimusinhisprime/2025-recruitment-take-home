import HomeController from "../features/home/presentation/controller.js";
import LoginController from "../features/login/presentation/controller.js";
import Framework7 from "framework7/bundle";
import Helper from "../utils/helper.js";
import Chart from "chart.js/auto";
import routes from "./routes.js";
import store from "./store.js";
import "framework7/css/bundle";
import App from "../app.f7";
import "../css/icons.css";
import "../css/app.css";

var app = new Framework7({
    name: "Prepaid+ Merchant Portal", // App name
    theme: "auto", // Automatic theme detection
    colors: {
        primary: "#002060",
    },

    el: "#app", // App root element
    component: App, // App main component
    // App store
    store: store,
    // App routes
    routes: routes,
});

/**
 * Initializes the app by setting up the necessary controllers and services.
 *
 * @param {Object} app The application object used to initialize components.
 */
app.on("init", function () {
    new HomeController(app); //start here
    new LoginController(app);
    new Helper().registerServiceWorker();

    /**
     * Renders all dashboard charts using Chart.js.
     * This includes line, bar, pie, and doughnut charts for various dashboard sections.
     */
    const renderChart = () => {
        // Line Chart (Daily Transactions)
        /**
         * Renders the daily transactions line chart.
         */
        const canvas = document.getElementById("lineChart");
        if (canvas) {
            const ctx = canvas.getContext("2d");
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [
                        {
                            label: "Transactions",
                            data: [1200, 1900, 3000, 500, 2000, 3000, 4500],
                            borderColor: "#007A33",
                            backgroundColor: "rgba(0, 122, 51, 0.1)",
                            fill: true,
                            tension: 0.3,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }

        // Bar Chart for Merchants Stats
        /**
         * Renders the merchant region bar chart.
         */
        const merchantBar = document.getElementById("merchantBarChart");
        if (merchantBar) {
            const merchantBarCtx = merchantBar.getContext("2d");
            new Chart(merchantBarCtx, {
                type: "bar",
                data: {
                    labels: [
                        "Kgatleng",
                        "Kweneng",
                        "Chobe",
                        "Boteti",
                        "Central",
                    ],
                    datasets: [
                        {
                            label: "Transaction Volume",
                            data: [3200, 2100, 1800, 2600, 1500],
                            backgroundColor: [
                                "#002060",
                                "#007A33",
                                "#E67C30",
                                "#5B2C6F",
                                "#C0392B",
                            ],
                            borderRadius: 8, // Optional: rounded bars
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }

        // Pie Chart for Merchants by City
        /**
         * Renders the merchants by city pie chart.
         */
        const merchantsPie = document.getElementById("merchantsPieChart");
        if (merchantsPie) {
            const pieCtx = merchantsPie.getContext("2d");
            new Chart(pieCtx, {
                type: "pie",
                data: {
                    labels: ["Maun", "Gaborone", "Francistown"],
                    datasets: [
                        {
                            data: [350, 700, 198], // Example numbers, update as needed
                            backgroundColor: ["#0288D1", "#5D4037", "#E67C30"],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: "bottom",
                        },
                    },
                },
            });
        }

        /**
         * Renders all trigger-related charts (bar, line, pie, doughnut).
         * These are initialized after DOMContentLoaded to ensure elements exist.
         */
        document.addEventListener("DOMContentLoaded", function () {
            /**
             * Renders the trigger events bar chart.
             */
            const barCtx = document.getElementById("triggerBarChart");
            if (barCtx) {
                new Chart(barCtx, {
                    type: "bar",
                    data: {
                        labels: ["Kazang", "BPC", "Orange", "Mascom"],
                        datasets: [
                            {
                                label: "Events",
                                data: [12, 19, 7, 14],
                                backgroundColor: [
                                    "#ffc000",
                                    "#002060",
                                    "#E67C30",
                                    "#7B1FA2",
                                ],
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { display: false } },
                    },
                });
            }

            /**
             * Renders the trigger trends line chart.
             */
            const lineCtx = document.getElementById("triggerLineChart");
            if (lineCtx) {
                new Chart(lineCtx, {
                    type: "line",
                    data: {
                        labels: [
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                        ],
                        datasets: [
                            {
                                label: "Trigger Trends",
                                data: [5, 9, 7, 8, 5, 4, 6],
                                borderColor: "#0288D1",
                                backgroundColor: "rgba(2,136,209,0.1)",
                                fill: true,
                                tension: 0.4,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { display: false } },
                    },
                });
            }

            /**
             * Renders the trigger distribution pie chart.
             */
            const pieCtx = document.getElementById("triggerPieChart");
            if (pieCtx) {
                new Chart(pieCtx, {
                    type: "pie",
                    data: {
                        labels: ["Kazang", "BPC", "Orange"],
                        datasets: [
                            {
                                data: [300, 50, 100],
                                backgroundColor: [
                                    "#ffc000",
                                    "#002060",
                                    "#E67C30",
                                ],
                            },
                        ],
                    },
                    options: { responsive: true },
                });
            }

            /**
             * Renders the trigger status doughnut chart.
             */
            const doughnutCtx = document.getElementById("triggerDoughnutChart");
            if (doughnutCtx) {
                new Chart(doughnutCtx, {
                    type: "doughnut",
                    data: {
                        labels: ["Active", "Inactive"],
                        datasets: [
                            {
                                data: [80, 20],
                                backgroundColor: ["#007A33", "#C0392B"],
                            },
                        ],
                    },
                    options: { responsive: true },
                });
            }
        });

        // // The following block is duplicated and can be removed for clarity.
        // // (You may want to keep only one instance of this DOMContentLoaded block.)
        // document.addEventListener("DOMContentLoaded", function () {
        //     // ... same chart initialization code as above ...
        // });
    };

    // Wait for the page to load before trying to render the chart
    /**
     * Initializes charts when the "home" page is loaded.
     * @param {Object} page - The page object from Framework7.
     */
    app.on("pageInit", function (page) {
        if (page.name === "home") {
            renderChart();
        }
    });
});
