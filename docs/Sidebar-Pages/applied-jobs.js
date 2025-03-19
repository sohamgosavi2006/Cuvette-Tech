
// Import necessary functions
import { searchListener as initOtherJobsSearch } from './other-jobs.js';


// Updated redirectToFullTimeJobs function
export function redirectToFullTimeJobs() {
    const contentContainer = document.querySelector('.content');
    if (contentContainer) {
        document.startViewTransition(() => {
            fetch('./Sidebar-Pages/other-jobs.html')
                .then(response => response.text())
                .then(html => {
                    contentContainer.innerHTML = html;
                    setTimeout(() => {
                        // Initialize search listener for Other Jobs
                        initOtherJobsSearch();
                        
                        // Fetch and render Other Jobs
                        const jobListingsContainer = document.querySelector('.jobListings');
                        if (jobListingsContainer) {
                            fetch('https://cuvette-tech-h8aj.vercel.app/')
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
                                    });
                                })
                                .catch(error => console.error('Error fetching or processing job data:', error));
                        }
                    }, 100);
                })
                .catch(error => console.error('Error loading content:', error));
        });
    }
}

// Function to initialize search job button listener
export function initSearchJobListener() {
    const searchJobBtn = document.getElementById('searchJobBtn');
    if (searchJobBtn) {
        searchJobBtn.addEventListener('click', (event) => {
            event.preventDefault();
            redirectToFullTimeJobs();
        });
    } else {
        console.warn('Search job button not found in DOM');
    }
}

// Function to delete an applied job
export function deleteAppliedJob(jobTitle, companyName) {
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];
    const updatedJobs = appliedJobs.filter(job => !(job.title === jobTitle && job.company_name === companyName));
    localStorage.setItem('appliedJobs', JSON.stringify(updatedJobs));
    return updatedJobs;
}

// Function to display applied jobs (if needed in this file)
export function displayAppliedJobs() {
    const noAppliedJobs = document.getElementById('noAppliedJobs');
    const appliedJobsList = document.getElementById('appliedJobsList');
    if (!noAppliedJobs || !appliedJobsList) return;

    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];
    
    if (appliedJobs.length === 0) {
        noAppliedJobs.classList.remove('d-none');
        appliedJobsList.classList.add('d-none');
        return;
    }

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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    displayAppliedJobs();
    initSearchJobListener();
});