const topBar = document.querySelector("#top-bar");
const exteriorColorSection = document.querySelector("#exterior-buttons");
const interiorColorSection = document.querySelector("#interior-buttons");
const exteriorImage = document.querySelector("#exterior-image");
const interiorImage = document.querySelector("#interior-image");
const wheelButtonsSection = document.querySelector("#wheel-buttons");
const performancePackageButton = document.querySelector("#performance-package-button");
const totalPriceElement = document.querySelector("#total-price");
const accessoryCheckboxes = document.querySelector("#accessory-checkboxes");
const fullSelfDrivingCheckbox = document.querySelector("#full-self-driving-checkbox");
const downPaymentElement = document.querySelector("#down-payment");
const loanTermElement = document.querySelector("#loan-term");
const interestRateElement = document.querySelector("#interest-rate");
const monthlyPaymentElement = document.querySelector("#monthly-payment");

const basePrice = 52490;
let totalPrice = basePrice;
let selectedColor = "Stealth Grey";
const selectedOptions = {
    "Performance Wheels": false,
    "Performance Package": false,
    "Full Self-Driving": false,
    "Accessories": {
        "Center Console Trays": false,
        "Sunshade": false,
        "All-Weather Interior Liners": false,
    },
}

const optionPrices = {
    "Performance Wheels": 2500,
    "Performance Package": 5000,
    "Full Self-Driving": 8500,
    "Accessories": {
        "Center Console Trays": 35,
        "Sunshade": 105,
        "All-Weather Interior Liners": 225,
    }
}

// Handle Top Bar on Scroll
const handleScroll = () => {
    const atTop = window.scrollY === 0;
    topBar.classList.toggle("visible-bar", atTop);
    topBar.classList.toggle("hidden-bar", !atTop);
}

// Image Mapping
const exteriorImages = {
    "Stealth Grey": "./images/model-y-stealth-grey.jpg",
    "Pearl White": "./images/model-y-pearl-white.jpg",
    "Deep Blue": "./images/model-y-deep-blue-metallic.jpg",
    "Solid Black": "./images/model-y-solid-black.jpg",
    "Ultra Red": "./images/model-y-ultra-red.jpg",
    "Quicksilver": "./images/model-y-quicksilver.jpg",
}

const interiorImages = {
    "Dark": "./images/model-y-interior-dark.jpg",
    "Light": "./images/model-y-interior-light.jpg",
}

// Handle Color Selection
const handleColorButtonClick = (event) => {
    let button;
    
    if (event.target.tagName === "IMG"){
        button = event.target.closest("button");
    } else if (event.target.tagName === "BUTTON"){
        button = event.target;
    }

    if (button) {
        const buttons = event.currentTarget.querySelectorAll("button");
        buttons.forEach((btn) => btn.classList.remove("btn-selected"));
        button.classList.add("btn-selected");

        // Change exterior image
        if (event.currentTarget === exteriorColorSection){
            selectedColor = button.querySelector('img').alt;
            updateExteriorImage();
        }

        // Change interior image
        if (event.currentTarget === interiorColorSection){
            const color = button.querySelector("img").alt;
            interiorImage.src = interiorImages[color];
        }
    }
}

const handleWheelButtonClick = (event) => {
    if (event.target.tagName === "BUTTON"){
        const buttons = document.querySelectorAll("#wheel-buttons button");
        // Remove 'selected' styles
        buttons.forEach((btn) => btn.classList.remove("bg-gray-700", "text-white"));
        
        // Add 'selected' styles
        event.target.classList.add("bg-gray-700", "text-white");

        // Change exterior image based on wheels
        selectedOptions["Performance Wheels"] = event.target.textContent.includes("Performance");
        
        updateExteriorImage();
        updateTotalPrice()
    }
}

// Update exterior image based on current configuration settings
const updateExteriorImage = () => {
    const performanceSuffix = selectedOptions["Performance Wheels"] ? "-performance" : "";
    const colorKey = selectedColor in exteriorImages ? selectedColor : "Stealth Grey";
    exteriorImage.src = exteriorImages[colorKey].replace(".jpg", `${performanceSuffix}.jpg`);
}

const handlePerformancePackageButtonClick = () => {
    performancePackageButton.classList.toggle("bg-gray-700");
    performancePackageButton.classList.toggle("text-white");
    selectedOptions["Performance Package"] = !selectedOptions["Performance Package"];
    updateTotalPrice()
}

// Update the total price based on current configuration settings
const updateTotalPrice = () => {
    totalPrice = basePrice;
    for (const [key, val] of Object.entries(selectedOptions)) {
        if (val && typeof(val) !== "object"){
            totalPrice += Number(optionPrices[key]);
        }
        else if (typeof(val) === "object"){
            for (const [innerKey, innerVal] of Object.entries(val)) {
                if (innerVal){
                    totalPrice += Number(optionPrices["Accessories"][innerKey]);
                }
            }
        }
    }

    let formattedTotalPrice = new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(totalPrice);

      totalPriceElement.textContent = formattedTotalPrice;
      updateEstimatedPaymentBreakdown();
}

const updateEstimatedPaymentBreakdown = () => {
    // Get and parse the down payment
    const downPaymentText = downPaymentElement.textContent || "0";
    const downPayment = parseFloat(downPaymentText.replace(/[^0-9.-]/g, ""));
    console.log("Down Payment:", downPayment);

    // Get and parse the loan term
    const loanTermText = loanTermElement.textContent || "0";
    const loanTerm = parseInt(loanTermText.replace(/[^0-9]/g, ""), 10);
    console.log("Loan Term:", loanTerm);

    // Get and parse the interest rate
    const interestRateText = interestRateElement.textContent || "0";
    const interestRate = parseFloat(interestRateText.replace(/[^0-9.-]/g, "")) / 100;
    console.log("Interest Rate:", interestRate);

    const loanAmount = totalPrice - downPayment;
    console.log("Loan Amount:", loanAmount);

    const monthlyRate = interestRate / 12;
    const monthlyPayment = loanAmount * (monthlyRate * (1 + monthlyRate) ** loanTerm) / ((1 + monthlyRate) ** loanTerm - 1);
    
    console.log("Estimated Monthly Payment:", monthlyPayment.toFixed(2));

    monthlyPaymentElement.textContent = `$${monthlyPayment.toFixed(2)}`;
};

const handleAccessoryCheckboxChange = (event) => {
    if (event.target.tagName === "INPUT"){
        for (accessory in selectedOptions["Accessories"]){
            selectedLabel = event.target.closest("label").textContent.includes(accessory);
            if (selectedLabel){
                selectedOptions["Accessories"][`${accessory}`] = !selectedOptions["Accessories"][`${accessory}`];
            }
        }
        
        updateTotalPrice();
    }
}

const handleFullSelfDrivingChange = (event) => {
    selectedOptions["Full Self-Driving"] = event.target.checked;
    updateTotalPrice();
}

// Event Listeners
window.addEventListener("scroll", () => requestAnimationFrame(handleScroll));
exteriorColorSection.addEventListener("click", handleColorButtonClick);
interiorColorSection.addEventListener("click", handleColorButtonClick);
wheelButtonsSection.addEventListener("click", handleWheelButtonClick);
performancePackageButton.addEventListener("click", handlePerformancePackageButtonClick);
accessoryCheckboxes.addEventListener("change", handleAccessoryCheckboxChange);
fullSelfDrivingCheckbox.addEventListener("change", handleFullSelfDrivingChange);