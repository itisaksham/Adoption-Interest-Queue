"use strict";

/*
 * Adoption Interest Queue
 * Ticket: ENG-22666
 * Vanilla JavaScript ES6+
 */

const STORAGE_KEY = "adoptionInterestQueue";

const state = {
    queue: loadQueue(),
    searchTerm: "",
    statusFilter: "all",
    isLoading: false
};

const elements = {
    form: document.getElementById("interestForm"),

    applicantName: document.getElementById("applicantName"),
    animalName: document.getElementById("animalName"),
    contact: document.getElementById("contact"),
    interestDate: document.getElementById("interestDate"),

    submitButton: document.getElementById("submitButton"),

    searchInput: document.getElementById("searchInput"),
    statusFilter: document.getElementById("statusFilter"),

    queueContainer: document.getElementById("queueContainer"),
    loadingIndicator: document.getElementById("loadingIndicator"),

    totalCount: document.getElementById("totalCount"),
    waitingCount: document.getElementById("waitingCount"),
    reviewCount: document.getElementById("reviewCount"),
    approvedCount: document.getElementById("approvedCount")
};


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
    setDefaultDate();
    bindEvents();
    renderApplication();
}


/* =========================================================
   EVENTS
   ========================================================= */

function bindEvents() {
    elements.form.addEventListener("submit", handleFormSubmit);

    elements.searchInput.addEventListener("input", handleSearch);

    elements.statusFilter.addEventListener(
        "change",
        handleStatusFilter
    );

    elements.queueContainer.addEventListener(
        "click",
        handleQueueAction
    );
}


/* =========================================================
   FORM SUBMISSION
   ========================================================= */

function handleFormSubmit(event) {
    event.preventDefault();

    clearValidationErrors();

    const formData = {
        applicantName: elements.applicantName.value.trim(),
        animalName: elements.animalName.value.trim(),
        contact: elements.contact.value.trim(),
        interestDate: elements.interestDate.value
    };

    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
        displayValidationErrors(errors);
        return;
    }

    const sanitizedData = {
        applicantName: sanitizeText(formData.applicantName),
        animalName: sanitizeText(formData.animalName),
        contact: sanitizeText(formData.contact),
        interestDate: sanitizeText(formData.interestDate)
    };

    simulateAsyncOperation(function () {
        const newEntry = {
            id: createId(),
            applicantName: sanitizedData.applicantName,
            animalName: sanitizedData.animalName,
            contact: sanitizedData.contact,
            interestDate: sanitizedData.interestDate,
            status: "Waiting"
        };

        state.queue.push(newEntry);

        saveQueue();

        elements.form.reset();
        setDefaultDate();

        renderApplication();

        logAnalytics();
    });
}


/* =========================================================
   VALIDATION
   ========================================================= */

function validateForm(data) {
    const errors = {};

    if (!data.applicantName) {
        errors.applicantName = "Applicant name is required.";
    } else if (data.applicantName.length < 2) {
        errors.applicantName =
            "Applicant name must contain at least 2 characters.";
    }

    if (!data.animalName) {
        errors.animalName = "Animal name is required.";
    } else if (data.animalName.length < 2) {
        errors.animalName =
            "Animal name must contain at least 2 characters.";
    }

    if (!data.contact) {
        errors.contact = "Contact email is required.";
    } else if (!isValidEmail(data.contact)) {
        errors.contact = "Enter a valid email address.";
    }

    if (!data.interestDate) {
        errors.interestDate = "Interest date is required.";
    }

    return errors;
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}


/* =========================================================
   VALIDATION UI
   ========================================================= */

function displayValidationErrors(errors) {
    Object.entries(errors).forEach(function ([fieldName, errorMessage]) {
        const field = elements[fieldName];

        if (!field) {
            return;
        }

        field.setAttribute("aria-invalid", "true");

        const errorElement = document.getElementById(
            fieldName + "Error"
        );

        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
    });

    const firstInvalidField = Object.keys(errors)[0];

    if (elements[firstInvalidField]) {
        elements[firstInvalidField].focus();
    }
}

function clearValidationErrors() {
    const fields = [
        elements.applicantName,
        elements.animalName,
        elements.contact,
        elements.interestDate
    ];

    fields.forEach(function (field) {
        field.removeAttribute("aria-invalid");
    });

    const errorFields = [
        "applicantName",
        "animalName",
        "contact",
        "interestDate"
    ];

    errorFields.forEach(function (fieldName) {
        const errorElement = document.getElementById(
            fieldName + "Error"
        );

        if (errorElement) {
            errorElement.textContent = "";
        }
    });
}


/* =========================================================
   SEARCH
   ========================================================= */

function handleSearch(event) {
    state.searchTerm = event.target.value.trim().toLowerCase();

    renderQueue();
}


/* =========================================================
   STATUS FILTER
   ========================================================= */

function handleStatusFilter(event) {
    state.statusFilter = event.target.value;

    renderQueue();
}


/* =========================================================
   QUEUE ACTION
   ========================================================= */

function handleQueueAction(event) {
    const button = event.target.closest(
        "[data-action='change-status']"
    );

    if (!button) {
        return;
    }

    const id = Number(button.dataset.id);

    const entry = state.queue.find(function (item) {
        return item.id === id;
    });

    if (!entry) {
        return;
    }

    const nextStatus = getNextStatus(entry.status);

    simulateAsyncOperation(function () {
        entry.status = nextStatus;

        saveQueue();

        renderApplication();

        logAnalytics();
    });
}

function getNextStatus(currentStatus) {
    const statuses = [
        "Waiting",
        "In Review",
        "Approved"
    ];

    const currentIndex = statuses.indexOf(currentStatus);

    if (currentIndex === -1) {
        return "Waiting";
    }

    return statuses[(currentIndex + 1) % statuses.length];
}


/* =========================================================
   RENDER APPLICATION
   ========================================================= */

function renderApplication() {
    renderStatistics();
    renderQueue();
}


/* =========================================================
   STATISTICS
   ========================================================= */

function renderStatistics() {
    const total = state.queue.length;

    const waiting = state.queue.filter(function (entry) {
        return entry.status === "Waiting";
    }).length;

    const review = state.queue.filter(function (entry) {
        return entry.status === "In Review";
    }).length;

    const approved = state.queue.filter(function (entry) {
        return entry.status === "Approved";
    }).length;

    elements.totalCount.textContent = total;
    elements.waitingCount.textContent = waiting;
    elements.reviewCount.textContent = review;
    elements.approvedCount.textContent = approved;
}


/* =========================================================
   QUEUE RENDERING
   ========================================================= */

function renderQueue() {
    const filteredQueue = getFilteredQueue();

    if (filteredQueue.length === 0) {
        renderEmptyState();
        return;
    }

    const list = document.createElement("ul");

    list.className = "queue-list";

    filteredQueue.forEach(function (entry) {
        list.appendChild(createQueueItem(entry));
    });

    elements.queueContainer.replaceChildren(list);
}

function createQueueItem(entry) {
    const item = document.createElement("li");

    item.className = "queue-item";

    const main = document.createElement("div");

    main.className = "queue-main";

    const applicant = document.createElement("h3");

    applicant.className = "queue-name";

    applicant.textContent = entry.applicantName;

    const animal = document.createElement("p");

    animal.className = "queue-animal";

    animal.textContent =
        "Interested in: " + entry.animalName;

    const contact = document.createElement("p");

    contact.className = "queue-contact";

    contact.textContent = entry.contact;

    const date = document.createElement("p");

    date.className = "queue-date";

    date.textContent =
        "Interest date: " + formatDate(entry.interestDate);

    main.append(
        applicant,
        animal,
        contact,
        date
    );

    const side = document.createElement("div");

    side.className = "queue-side";

    const status = document.createElement("span");

    status.className = "queue-status";

    status.textContent = entry.status;

    status.setAttribute(
        "aria-label",
        "Status: " + entry.status
    );

    const actionButton = document.createElement("button");

    actionButton.type = "button";

    actionButton.className = "secondary-button";

    actionButton.dataset.action = "change-status";

    actionButton.dataset.id = String(entry.id);

    actionButton.textContent =
        getStatusButtonText(entry.status);

    actionButton.setAttribute(
        "aria-label",
        "Change status for " + entry.applicantName
    );

    side.append(status, actionButton);

    item.append(main, side);

    return item;
}

function getStatusButtonText(status) {
    if (status === "Waiting") {
        return "Start Review";
    }

    if (status === "In Review") {
        return "Approve";
    }

    return "Reset Status";
}


/* =========================================================
   EMPTY STATE
   ========================================================= */

function renderEmptyState() {
    const emptyState = document.createElement("div");

    emptyState.className = "empty-state";

    const heading = document.createElement("h3");

    heading.textContent = "No data found";

    const message = document.createElement("p");

    if (state.queue.length === 0) {
        message.textContent =
            "There are currently no adoption interest records.";
    } else {
        message.textContent =
            "No records match your current search or filter.";
    }

    emptyState.append(heading, message);

    elements.queueContainer.replaceChildren(emptyState);
}


/* =========================================================
   FILTERING
   ========================================================= */

function getFilteredQueue() {
    return state.queue.filter(function (entry) {
        const searchableText = [
            entry.applicantName,
            entry.animalName,
            entry.contact
        ]
            .join(" ")
            .toLowerCase();

        const matchesSearch =
            searchableText.includes(state.searchTerm);

        const matchesStatus =
            state.statusFilter === "all" ||
            entry.status === state.statusFilter;

        return matchesSearch && matchesStatus;
    });
}


/* =========================================================
   XSS SANITIZATION
   ========================================================= */

function sanitizeText(value) {
    if (typeof value !== "string") {
        return "";
    }

    return value
        .replace(/<[^>]*>/g, "")
        .replace(/[<>]/g, "")
        .trim();
}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function loadQueue() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed;
    } catch (error) {
        console.warn(
            "Unable to load saved queue data.",
            error
        );

        return [];
    }
}

function saveQueue() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state.queue)
        );
    } catch (error) {
        console.warn(
            "Unable to save queue data.",
            error
        );
    }
}


/* =========================================================
   LOADING / ASYNC SIMULATION
   ========================================================= */

function simulateAsyncOperation(callback) {
    setLoading(true);

    window.setTimeout(function () {
        try {
            callback();
        } finally {
            setLoading(false);
        }
    }, 700);
}

function setLoading(isLoading) {
    state.isLoading = isLoading;

    elements.loadingIndicator.hidden = !isLoading;

    elements.submitButton.disabled = isLoading;

    elements.submitButton.textContent = isLoading
        ? "Processing..."
        : "Add to Queue";
}


/* =========================================================
   ANALYTICS
   ========================================================= */

function logAnalytics() {
    console.log(
        "[Analytics] User interacted with Adoption Interest Queue"
    );
}


/* =========================================================
   UTILITIES
   ========================================================= */

function createId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function setDefaultDate() {
    if (!elements.interestDate.value) {
        const today = new Date()
            .toISOString()
            .split("T")[0];

        elements.interestDate.value = today;
    }
}

function formatDate(dateString) {
    if (!dateString) {
        return "Not provided";
    }

    const date = new Date(dateString + "T00:00:00");

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(date);
}