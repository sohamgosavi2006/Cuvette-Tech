// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCT9IhThW8qFhs2Yilyr-AsQaC8XNDloq0",
    authDomain: "cuvette-tech-8e3e2.firebaseapp.com",
    projectId: "cuvette-tech-8e3e2",
    storageBucket: "cuvette-tech-8e3e2.firebasestorage.app",
    messagingSenderId: "462947281460",
    appId: "1:462947281460:web:de37949441bb56756df861",
    measurementId: "G-Y3QJMC47GE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check user authentication state
window.onload = function () {
    onAuthStateChanged(auth, (user) => {
        const authContainer = document.querySelector(".d-flex");
        if (!authContainer) {
            alert("Auth container not found!");
            return;
        }
        if (!user) {
            authContainer.innerHTML = `
                <a href="../authentication/login/login.html" class="btn btn-primary me-2 login">Login</a>
                <a href="../authentication/sign-up/signup.html" class="btn btn-success signup">Sign Up</a>
            `;
        }
    });
};

// Variables to store filter values
let currentFilters = {
    searchQuery: "",
    officeType: null,
    experienceFilter: "all",
    minSalaryFilter: 3
};

// Function to update progress bars
function updateProgressBars() {
    const minSalaryFilter = document.getElementById("minSalaryFilter");
    const experienceFilter = document.getElementById("experienceFilter");
    const salaryProgress = document.getElementById("salaryProgress");
    const experienceProgress = document.getElementById("experienceProgress");

    if (minSalaryFilter && salaryProgress) {
        let salaryValue = parseInt(minSalaryFilter.value);
        let progressPercentage = ((salaryValue - 3) / (12 - 3)) * 100;
        salaryProgress.style.width = `${progressPercentage}%`;
        salaryProgress.setAttribute("aria-valuenow", salaryValue);
        salaryProgress.textContent = `${salaryValue} LPA`;
    }

    if (experienceFilter && experienceProgress) {
        let experienceValue = experienceFilter.value;
        let progressPercentage = 0;
        switch (experienceValue) {
            case "0-1": progressPercentage = 20; break;
            case "1-3": progressPercentage = 40; break;
            case "3-5": progressPercentage = 70; break;
            case "5+": progressPercentage = 100; break;
            default: progressPercentage = 0; break;
        }
        experienceProgress.style.width = `${progressPercentage}%`;
        experienceProgress.setAttribute("aria-valuenow", progressPercentage);
        experienceProgress.textContent = experienceValue === "all" ? "N/A" : experienceValue;
    }
}


// Function to apply filters to existing job cards
function applyFilters() {
    let jobCards = document.querySelectorAll(".job-card");
    let noResults = document.getElementById("noResults");
    let visibleCards = 0;

    jobCards.forEach((card) => {
        let companyNameElement = card.querySelector("h5");
        let workModeElement = card.querySelector(".badge");
        let salaryElement = null;
        let experienceElement = null;

        // Find the paragraph containing "Job Offer:" and "Experience:"
        card.querySelectorAll("p").forEach(p => {
            if (p.textContent.includes("Job Offer:")) salaryElement = p;
            if (p.textContent.includes("Experience:")) experienceElement = p;
        });

        if (!companyNameElement || !workModeElement || !salaryElement || !experienceElement) return;

        let companyName = companyNameElement.textContent.toLowerCase();
        let workMode = workModeElement.textContent.trim().toLowerCase();
        let salaryText = salaryElement.textContent.match(/₹(\d+)/)?.[1] || "0";
        let salary = parseInt(salaryText);
        let experienceText = experienceElement.textContent.match(/(\d+-\d+|\d+\+|\d+)/)?.[1] || "0-0";

        // Parse experience range
        let minExperience = 0, maxExperience = Infinity;
        if (experienceText.includes("-")) {
            let range = experienceText.split("-").map(Number);
            minExperience = range[0] || 0;
            maxExperience = range[1] || Infinity;
        } else if (experienceText.includes("+")) {
            minExperience = parseInt(experienceText) || 0; // e.g., "2+" → minExperience = 2
            maxExperience = Infinity;
        } else {
            minExperience = parseInt(experienceText) || 0;
            maxExperience = minExperience;
        }

        // Update currentFilters with the latest values
        currentFilters.officeType = document.querySelector('input[name="officeType"]:checked')?.value || null;
        currentFilters.experienceFilter = document.getElementById("experienceFilter").value;
        currentFilters.minSalaryFilter = parseInt(document.getElementById("minSalaryFilter").value) || 3;

        // Apply filters
        let matchesSearch = companyName.includes(currentFilters.searchQuery);
        let matchesOfficeType = !currentFilters.officeType || 
            (currentFilters.officeType === "remote" && (workMode.includes("work from home") || workMode.includes("remote"))) || 
            (currentFilters.officeType === "onsite" && (workMode.includes("onsite") || workMode.includes("in-office"))) || 
            (currentFilters.officeType === "hybrid" && (workMode.includes("hybrid") || workMode.includes("remote") && workMode.includes("onsite")));
        let matchesExperience = currentFilters.experienceFilter === "all" ||
            (currentFilters.experienceFilter === "2+" && minExperience >= 2) || // 2+ includes 2-5 years
            (currentFilters.experienceFilter === "4+" && minExperience >= 4) || // 4+ excludes 2-3 years
            (currentFilters.experienceFilter === "6+" && minExperience >= 6);    // 6+ excludes 2-5 years
        let matchesSalary = salary >= currentFilters.minSalaryFilter;

        if (matchesSearch && matchesOfficeType && matchesExperience && matchesSalary) {
            card.style.display = "block";
            visibleCards++;
        } else {
            card.style.display = "none";
        }
    });

    // Show or hide "No jobs found" message
    if (visibleCards === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }
}


// Function to filter jobs based on search (real-time for search)
function filterJobs() {
    currentFilters.searchQuery = document.querySelector(".searchInput").value.toLowerCase();
    applyFilters();
}

// Function to clear filters
function clearFilters() {
    document.querySelectorAll('input[name="officeType"]').forEach(radio => radio.checked = false);
    document.getElementById("experienceFilter").value = "all";
    document.getElementById("minSalaryFilter").value = 3;
    currentFilters = {
        searchQuery: "",
        officeType: null,
        experienceFilter: "all",
        minSalaryFilter: 3
    };
    document.querySelector(".searchInput").value = ""; // Clear search input
    applyFilters();
    updateProgressBars();
}

// Function to attach event listeners
function attachSearchListeners() {
    const searchInput = document.querySelector(".searchInput");
    const applyFiltersBtn = document.getElementById("applyFilters");
    const clearFiltersBtn = document.getElementById("clearFilters");
    const minSalaryFilter = document.getElementById("minSalaryFilter");
    const experienceFilter = document.getElementById("experienceFilter");

    if (searchInput && applyFiltersBtn && clearFiltersBtn && minSalaryFilter && experienceFilter) {
        // Search functionality (real-time via keyup)
        searchInput.addEventListener("keyup", filterJobs);

        // Apply button to apply filters
        applyFiltersBtn.addEventListener("click", applyFilters);

        // Clear button to reset filters
        clearFiltersBtn.addEventListener("click", clearFilters);

        // Update progress bars on input change (real-time feedback)
        minSalaryFilter.addEventListener("input", updateProgressBars);
        experienceFilter.addEventListener("change", updateProgressBars);
    } else {
        console.error("One or more filter elements not found in the DOM.");
    }

    // Initial progress bar update
    updateProgressBars();
}

// Export the attachSearchListeners function
export { attachSearchListeners };