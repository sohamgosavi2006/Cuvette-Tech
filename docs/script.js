
// Import Firebase SDK functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { attachSearchListeners } from '/docs/Sidebar-Pages/full-time-job.js';
import { deleteAppliedJob, initSearchJobListener } from './Sidebar-Pages/applied-jobs.js';
import { showSuccessModal, searchListener as initOtherJobsSearch } from './Sidebar-Pages/other-jobs.js'; // Import searchListener renamed

// Firebase configuration
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
const analytics = getAnalytics(app);




// Update authentication UI based on user state
function updateAuthUI(user) {
    const authContainer = document.querySelector(".d-flex");
    if (!authContainer) {
        console.error("Auth container not found!");
        return;
    }

    if (user) {
        authContainer.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-primary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    ${user.displayName || user.email.split('@')[0] || "User"}
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" id="profileBtn">Profile</a></li>
                    <li><a class="dropdown-item text-danger" href="#" id="logoutBtn">Logout</a></li>
                </ul>
            </div>
        `;

        const profileBtn = document.querySelector("#profileBtn");
        if (profileBtn) {
            profileBtn.removeEventListener('click', openProfileModalHandler);
            profileBtn.addEventListener('click', openProfileModalHandler);
        }

        const closeProfileModal = document.querySelector("#closeProfileModal");
        if (closeProfileModal) {
            closeProfileModal.removeEventListener('click', closeProfileModalHandler);
            closeProfileModal.addEventListener('click', closeProfileModalHandler);
        }

        const closeProfileBtn = document.querySelector("#closeProfileBtn");
        if (closeProfileBtn) {
            closeProfileBtn.removeEventListener('click', closeProfileModalHandler);
            closeProfileBtn.addEventListener('click', closeProfileModalHandler);
        }

        const logoutBtn = document.querySelector("#logoutBtn");
        if (logoutBtn) {
            logoutBtn.removeEventListener('click', logoutHandler);
            logoutBtn.addEventListener('click', logoutHandler);
        }
    } else {
        authContainer.innerHTML = `
            <a href="../authentication/login/login.html" class="btn btn-primary me-2 login">Login</a>
            <a href="../authentication/sign-up/signup.html" class="btn btn-success signup">Sign Up</a>
        `;
    }
}

// Modal handler functions
function openProfileModalHandler() {
    const modal = document.getElementById("profileModal");
    if (modal) {
        modal.style.display = "flex";
        const user = auth.currentUser;
        if (user) {
            document.getElementById("userName").value = user.displayName || "No Name";
            document.getElementById("userEmail").value = user.email;
        }
    }
}

function closeProfileModalHandler() {
    const modal = document.getElementById("profileModal");
    if (modal) modal.style.display = "none";
}

async function logoutHandler() {
    try {
        await signOut(auth);
        location.reload();
    } catch (error) {
        console.error("Logout Error:", error);
    }
}

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    updateAuthUI(user);
});

// Full Time Jobs section
const fullTimeJobElement = document.querySelector('#fullTimeJob');
fullTimeJobElement.setAttribute('href', 'javascript:void(0)');
fullTimeJobElement.addEventListener('click', (event) => {
    event.preventDefault();
    const contentContainer = document.querySelector('.content');
    if (contentContainer) {
        document.startViewTransition(() => {
            fetch('./Sidebar-Pages/full-time-job.html')
                .then(response => response.text())
                .then(html => {
                    contentContainer.innerHTML = html;
                    setTimeout(() => {
                        attachSearchListeners();
                        const jobListingsContainer = document.querySelector('.jobListings');
                        if (jobListingsContainer) {
                            fetch('https://cuvette-tech.vercel.app/api/jobs')
                                .then(response => response.json())
                                .then(jobs => {
                                    jobListingsContainer.innerHTML = '';
                                    jobs.forEach((job) => {
                                        const jobCard = document.createElement('div');
                                        jobCard.classList.add('job-card', 'border', 'p-3', 'mb-3', 'rounded', 'shadow-sm');
                                        let workModeBadge = job.work_mode ? `<span class="badge ${job.work_mode === 'Work From Home' ? 'bg-info' : 'bg-secondary'}">${job.work_mode}</span>` : '';
                                        const skillsBadges = job.technologies ? job.technologies.map(skill => `<span class="badge bg-light text-dark me-2">${skill}</span>`).join('') : '';
                                        const highApplicantsWarning = job.high_applicants ? `<p class="text-danger">High Applicants | Chances of getting a reply/selection are lower</p>` : '';
                                        jobCard.innerHTML = `
                                            <div class="d-flex justify-content-between">${workModeBadge}</div>
                                            <h5 class="fw-bold mt-2">${job.company_name || 'Company Name'}</h5>
                                            <p class="text-muted">${job.company_name || 'Company'} | ${job.location || 'Location'}</p>
                                            <div class="d-flex flex-wrap mb-2">${skillsBadges}</div>
                                            <div class="row"><div class="col-6"><p><strong>Job Offer:</strong> ₹${job.salary_min || 'N/A'} LPA - ₹${job.salary_max || 'N/A'} LPA</p></div><div class="col-6"><p><strong>Start Date:</strong> ${job.start_date ? new Date(job.start_date).toDateString() : 'Immediate'}</p></div></div>
                                            <div class="row"><div class="col-6"><p><strong>#Openings:</strong> ${job.openings || 'N/A'}</p></div><div class="col-6"><p><strong>Experience:</strong> ${job.experience_range || 'N/A'}</p></div></div>
                                            <p><strong>Probation Duration:</strong> ${job.probation_duration || 'N/A'} Months</p>
                                            <p class="text-primary">${job.applicants || 'N/A'}+ applicants</p>
                                            ${highApplicantsWarning}
                                            <div class="d-flex justify-content-end"><button class="btn btn-primary apply-now" data-link="${job.linkedin_url || '#'}">Apply Now</button></div>
                                        `;
                                        jobListingsContainer.appendChild(jobCard);
                                    });
                                    document.querySelectorAll('.apply-now').forEach(button => {
                                        button.addEventListener('click', (event) => {
                                            const jobLink = event.target.getAttribute('data-link');
                                            if (jobLink && jobLink !== '#') {
                                                window.open(jobLink, '_blank');
                                            } else {
                                                const jobCard = event.target.closest('.job-card');
                                                const job = {
                                                    title: jobCard.querySelector('h5').textContent,
                                                    company_name: jobCard.querySelector('h5').textContent.split(' at ')[1] || jobCard.querySelector('h5').textContent
                                                };
                                                trackAppliedJob(job);
                                                alert('You have successfully applied for this job!');
                                            }
                                        });
                                    });
                                })
                                .catch(error => console.error('Error fetching or processing job data:', error));
                        }
                        onAuthStateChanged(auth, updateAuthUI);
                    }, 100);
                })
                .catch(error => console.error('Error loading content:', error));
        });
    }
});

// Other Jobs section 
const otherJobElement = document.querySelector('#otherJobs');
otherJobElement.setAttribute('href', 'javascript:void(0)');
otherJobElement.addEventListener('click', (event) => {
    event.preventDefault();
    const contentContainer = document.querySelector('.content');
    if (contentContainer) {
        document.startViewTransition(() => {
            fetch('./Sidebar-Pages/other-jobs.html')
                .then(response => response.text())
                .then(html => {
                    contentContainer.innerHTML = html;
                    setTimeout(() => {
                        initOtherJobsSearch(); // Initialize search listener from other-jobs.js
                        const jobListingsContainer = document.querySelector('.jobListings');
                        if (jobListingsContainer) {
                            fetch('https://cuvette-tech.vercel.app/api/other-jobs')
                                .then(response => response.json())
                                .then(jobs => {
                                    jobListingsContainer.innerHTML = '';
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
                                        jobListingsContainer.appendChild(jobCard);
                                        jobCard.querySelector(".apply-now").addEventListener("click", () => {
                                            const job = {
                                                title: jobCard.querySelector('.company-name').textContent.split(' at ')[0],
                                                company_name: jobCard.querySelector('.company-name').textContent.split(' at ')[1] || 'Unknown Company'
                                            };
                                            trackAppliedJob(job);
                                            showSuccessModal(job);
                                        });
                                    });
                                })
                                .catch(error => console.error('Error fetching or processing job data:', error));
                        }
                        onAuthStateChanged(auth, updateAuthUI);
                    }, 100);
                })
                .catch(error => console.error('Error loading content:', error));
        });
    }
});



// Applied Jobs section with delete functionality and search job button listener
const appliedJobElement = document.querySelector('#appliedJobs');
appliedJobElement.setAttribute('href', 'javascript:void(0)');

appliedJobElement.addEventListener('click', (event) => {
    event.preventDefault();
    const contentContainer = document.querySelector('.content');
    if (contentContainer) {
        document.startViewTransition(() => {
            fetch('./Sidebar-Pages/applied-jobs.html')
                .then(response => response.text())
                .then(html => {
                    contentContainer.innerHTML = html;
                    setTimeout(() => {
                        const noAppliedJobs = document.getElementById('noAppliedJobs');
                        const appliedJobsList = document.getElementById('appliedJobsList');
                        const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];

                        if (appliedJobs.length === 0) {
                            noAppliedJobs.classList.remove('d-none');
                            appliedJobsList.classList.add('d-none');
                        } else {
                            noAppliedJobs.classList.add('d-none');
                            appliedJobsList.classList.remove('d-none');
                            appliedJobsList.innerHTML = '';

                            appliedJobs.forEach((job) => {
                                const jobCard = document.createElement('div');
                                jobCard.className = 'card mb-3';
                                jobCard.innerHTML = `
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h5 class="card-title mb-1">${job.title || 'Job Title'}</h5>
                                                <p class="card-text text-muted mb-1">at ${job.company_name || 'Company Name'}</p>
                                            </div>
                                            <div>
                                                <button class="btn btn-secondary me-2" disabled>Applied</button>
                                                <button class="btn btn-danger delete-job" data-title="${job.title}" data-company="${job.company_name}">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                `;
                                appliedJobsList.appendChild(jobCard);
                            });

                            document.querySelectorAll('.delete-job').forEach(button => {
                                button.addEventListener('click', (e) => {
                                    const title = e.target.getAttribute('data-title');
                                    const company = e.target.getAttribute('data-company');
                                    deleteAppliedJob(title, company);
                                    e.target.closest('.card').remove();
                                    const updatedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];
                                    if (updatedJobs.length === 0) {
                                        noAppliedJobs.classList.remove('d-none');
                                        appliedJobsList.classList.add('d-none');
                                    }
                                });
                            });
                        }

                        // Initialize the search job button listener from applied-jobs.js
                        initSearchJobListener();
                    }, 100);
                })
                .catch(error => console.error('Error loading content:', error));
        });
    }
});

// Track applied jobs in localStorage
function trackAppliedJob(job) {
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];
    if (!appliedJobs.some(j => j.title === job.title && j.company_name === job.company_name)) {
        appliedJobs.push(job);
        localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
    }
}

// For Profile Modal (For Sidebars) ->




// Dynamic content loader
function loadContent(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => {
            const contentContainer = document.querySelector(".container");
            if (contentContainer) {
                contentContainer.innerHTML = data;
                onAuthStateChanged(auth, updateAuthUI);
            } else {
                console.error("Content container not found!");
            }
        })
        .catch(error => console.error("Error loading content:", error));
}

// Sidebar click event delegation
document.addEventListener("click", (event) => {

    if (event.target.id === "logoutBtn") {
        signOut(auth).then(() => {
            location.reload();
        }).catch((error) => {
            console.error("Logout Error: ", error);
        });
    }

    // Handle profile button click to open the profile modal
    if (event.target.id === "profileBtn") {
        openProfileModalHandler();
    }
    if (event.target.id === "fullTimeJob") {
        loadContent("Sidebar-Pages/full-time-job.html");
    }
    if (event.target.id === "otherJobs") {
        loadContent("Sidebar-Pages/other-jobs.html");
    }
    if (event.target.id === "appliedJobs") {
        loadContent("Sidebar-Pages/applied-jobs.html");
    }
    if (event.target.id === "about") {
        loadContent("Sidebar-Pages/about.html");
    }
});

// Load default About page
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        fetch('Sidebar-Pages/about.html')
            .then(response => response.text())
            .then(html => {
                mainContent.innerHTML = html;
                onAuthStateChanged(auth, updateAuthUI);
            })
            .catch(error => console.error('Error loading about page:', error));
    }
});

