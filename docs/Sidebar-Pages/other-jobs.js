// other-jobs.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Firebase Configuration and Initialization
const firebaseConfig = {
    apiKey: "AIzaSyCT9IhThW8qFhs2Yilyr-AsQaC8XNDloq0",
    authDomain: "cuvette-tech-8e3e2.firebaseapp.com",
    projectId: "cuvette-tech-8e3e2",
    storageBucket: "cuvette-tech-8e3e2.firebasestorage.app",
    messagingSenderId: "462947281460",
    appId: "1:462947281460:web:de37949441bb56756df861",
    measurementId: "G-Y3QJMC47GE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Variables to store search query
let currentFilters = {
    searchQuery: ""
};

// Function to show success modal
export function showSuccessModal(job) {
    const modal = document.getElementById("successModal");
    if (modal) {
        document.getElementById("successJobTitle").textContent = job.title;
        document.getElementById("successCompanyName").textContent = job.company_name;
        modal.style.display = "flex";
        
        const closeModal = document.getElementById("closeSuccessModal");
        const closeBtn = document.getElementById("closeSuccessBtn");
        
        const closeHandler = () => {
            modal.style.display = "none";
            closeModal.removeEventListener('click', closeHandler);
            closeBtn.removeEventListener('click', closeHandler);
        };
        
        closeModal.addEventListener("click", closeHandler);
        closeBtn.addEventListener("click", closeHandler);
    }
}

// Function to apply search filter based on title
function applySearchFilter() {
    let jobCards = document.querySelectorAll(".card");
    let noResults = document.getElementById("noResults");
    let visibleCards = 0;

    jobCards.forEach((card) => {
        let titleElement = card.querySelector(".company-name");
        if (!titleElement) return;

        let title = titleElement.textContent.split(" at ")[0].toLowerCase();
        let matchesSearch = title.includes(currentFilters.searchQuery.toLowerCase());

        if (matchesSearch) {
            card.style.display = "block";
            visibleCards++;
        } else {
            card.style.display = "none";
        }
    });

    if (noResults) {
        noResults.style.display = visibleCards === 0 ? "block" : "none";
    }
}

// Function to filter jobs based on search (real-time)
function filterJobs() {
    currentFilters.searchQuery = document.querySelector("#searchInput").value.trim().toLowerCase();
    applySearchFilter();
}

// Exported search listener function
export function searchListener() {
    const searchInput = document.querySelector("#searchInput");
    if (searchInput) {
        searchInput.addEventListener("keyup", filterJobs);
        applySearchFilter();
    } else {
        console.error("Search input not found in the DOM.");
    }
}

// Function to fetch and display other jobs
async function callOtherJobsContent() {
    try {
        const response = await fetch("https://cuvette-tech.vercel.app/");
        const jobs = await response.json();

        const jobListings = document.querySelector(".jobListings"); 
        if (!jobListings) {
            console.error("Job listings container not found!");
            return;
        }

        jobListings.innerHTML = "";

        jobs.forEach(job => {
            const jobCard = document.createElement("div");
            jobCard.className = "card mb-3 shadow-sm";
            jobCard.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="d-flex align-items-center">
                            <img src="${job.company_logo || 'default-logo.png'}" alt="${job.company_name || 'Company'} Logo" class="rounded-circle me-3" style="width: 40px; height: 40px;">
                            <div>
                                <h5 class="card-title company-name mb-1">${job.title || 'Job Title'} at ${job.company_name || 'Company Name'}</h5>
                                <p class="card-text text-muted mb-0 location">${job.location || 'Location'}</p>
                            </div>
                        </div>
                        <div class="text-end">
                            <span class="badge ${job.work_mode.toLowerCase().includes('remote') ? 'bg-primary' : job.work_mode.toLowerCase().includes('hybrid') ? 'bg-warning' : 'bg-success'} mb-2 work-mode">${job.work_mode || 'N/A'}</span>
                            <p class="card-text text-muted mb-0 salary">${job.salary_min || 'N/A'} - ${job.salary_max || 'N/A'} LPA</p>
                            <p class="card-text text-muted mb-0 experience">Year of experience - ${job.experience_range || 'N/A'}</p>
                        </div>
                    </div>
                    <div class="mt-3">
                        <span class="badge bg-light text-dark border skill-badge">${job.skills ? job.skills.split(",")[0] : 'N/A'}</span>
                    </div>
                    <div class="d-flex justify-content-end mt-3">
                        <button class="btn btn-primary apply-now" style="background: linear-gradient(90deg, #007bff, #00d4ff); border: none;">
                            Apply <i class="bi bi-box-arrow-up-right ms-1"></i>
                        </button>
                    </div>
                    <div class="text-center mt-3">
                        <a href="#" class="text-white text-decoration-none share-earn" style="background: linear-gradient(90deg, #007bff, #00d4ff); padding: 5px; border-radius: 0 0 5px 5px; display: block;">Click here to Share & Earn <i class="bi bi-currency-rupee"></i></a>
                    </div>
                </div>
            `;
            jobListings.appendChild(jobCard);
        });
    } catch (error) {
        console.error("Error fetching other jobs:", error);
    }
}

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        const authContainer = document.querySelector(".d-flex");
        if (!authContainer) {
            console.error("Auth container not found!");
            return;
        }

        if (user) {
            callOtherJobsContent();
        } else {
            authContainer.innerHTML = `
                <a href="../authentication/login/login.html" class="btn btn-primary me-2 login">Login</a>
                <a href="../authentication/sign-up/signup.html" class="btn btn-success signup">Sign Up</a>
            `;
        }
    });
});