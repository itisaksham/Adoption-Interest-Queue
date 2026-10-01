````markdown
# Adoption Interest Queue

A lightweight digital Adoption Interest Queue built using Vanilla JavaScript (ES6+).

This project was created for:

**Ticket:** ENG-22666  
**Epic:** Core Infrastructure Overhaul  
**Priority:** P1  
**Story Points:** 5  
**Technology:** HTML5, CSS3, Vanilla JavaScript

---

## Project Overview

Animal Shelter staff currently manage adoption interest using paper systems and Excel sheets.

The Adoption Interest Queue provides a simple browser-based interface for:

- Adding adoption interest records
- Searching applicants and animals
- Filtering records by status
- Viewing queue statistics
- Updating adoption status
- Handling empty states
- Handling simulated slow connections
- Validating user input
- Sanitizing text input
- Persisting data locally

---

## Technology Stack

- HTML5
- CSS3

## Project Structure

```text
adoption-interest-queue/
│
├── index.html
├── style.cssadoption-interest-queue
├── app.js
└── README.md
````

---

## How to Run

### Option 1 — Open Directly

Open:

```text
index.html
```

in a modern browser.

The application works without a backend.

---

### Option 2 — VS Code Live Server

1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select:

```text
Open with Live Server
```

The application will open in the browser.

---

## Features

### 1. Add Adoption Interest

Users can enter:

- Applicant name
- Animal name
- Contact email
- Interest date

The form validates the information before adding it to the queue.

---

### 2. Input Validation

The following conditions are checked:

- Applicant name cannot be empty.
- Applicant name must contain at least two characters.
- Animal name cannot be empty.
- Animal name must contain at least two characters.
- Contact email must be valid.
- Interest date is required.

Invalid fields receive:

```text
aria-invalid="true"
```

and are visually highlighted.

---

## 3. Empty State

When there are no records, the application displays:

```text
No data found
```

Instead of displaying a blank screen.

The same message is displayed when a search or filter produces no matching records.

---

## 4. Search

The search box searches:

- Applicant name
- Animal name
- Contact email

Example:

```text
Search: Buddy
```

will display adoption records related to Buddy.

---

## 5. Status Filtering

Available statuses:

```text
All statuses
Waiting
In Review
Approved
```

---

## 6. Status Updates

Each record contains a status action.

The workflow is:

```text
Waiting
   ↓
In Review
   ↓
Approved
   ↓
Waiting
```

The button automatically changes based on the current status.

---

## 7. Loading Indicator

Asynchronous operations are simulated with a short delay.

During an operation:

```text
Loading queue...
```

is displayed.

The submit button also changes to:

```text
Processing...
```

This demonstrates how the application would behave when operating over a slow connection.

---

## 8. XSS Protection

User input is sanitized before being stored in application state.

The application also avoids inserting user-controlled values through unsafe HTML interpolation.

Queue records are created using:

```javascript
document.createElement()
```

and values are inserted using:

```javascript
textContent
```

rather than unsafe `innerHTML`.

For example, input such as:

```html
<script>alert("XSS")</script>
```

is treated as text and sanitized before being stored.

---

## 9. Local Storage

Queue information is persisted using browser LocalStorage.

Storage key:

```text
adoptionInterestQueue
```

Therefore, refreshing the browser does not immediately remove the locally stored queue.

---

## 10. Accessibility

The interface includes:

- Semantic HTML
- Labels for form controls
- ARIA labels
- ARIA descriptions
- `aria-invalid` for invalid inputs
- `aria-live` for queue updates
- Keyboard-accessible buttons
- Visible keyboard focus
- Status information for screen readers
- Loading status using `role="status"`

The design is intended to satisfy the accessibility requirements in the ticket.

---

## 11. Telemetry Simulation

After a primary action is completed, the application logs:

```text
[Analytics] User interacted with Adoption Interest Queue
```

Open the browser developer console to see the simulated analytics event.

---

## 12. Responsive Design

The interface supports:

- Desktop
- Tablet
- Mobile

The layout automatically changes at smaller screen sizes.

---

## 13. Design System

The application follows a monochromatic corporate design.

The interface uses:

- Black
- White
- Gray
- Neutral borders

Spacing follows an 8/16/24/32/48px scale.

No external UI framework is required.

---

# Testing Checklist

## Happy Path

- [ ] Application opens successfully.
- [ ] User can add an adoption interest.
- [ ] Queue updates immediately after processing.
- [ ] Statistics update correctly.
- [ ] User can search records.
- [ ] User can filter records.
- [ ] User can update status.
- [ ] Data persists after refresh.
- [ ] Analytics message appears in console.

---

## Unhappy Path

### Empty State

- [ ] Empty queue displays "No data found".
- [ ] Search with no matches displays "No data found".
- [ ] Filter with no matches displays "No data found".

### Invalid Input

- [ ] Empty applicant name is rejected.
- [ ] Short applicant name is rejected.
- [ ] Empty animal name is rejected.
- [ ] Short animal name is rejected.
- [ ] Invalid email is rejected.
- [ ] Missing date is rejected.
- [ ] Invalid fields receive red borders.
- [ ] First invalid field receives focus.

### Connectivity Simulation

- [ ] Loading indicator appears during asynchronous operations.
- [ ] Submit button becomes disabled.
- [ ] Submit button displays "Processing...".
- [ ] UI returns to normal after operation completes.

### Security

- [ ] HTML input is sanitized.
- [ ] Script tags cannot execute through queue data.
- [ ] User-controlled values are rendered with `textContent`.

---

# Accessibility Checklist

- [ ] Form inputs have labels.
- [ ] Buttons have accessible names.
- [ ] Search input has an accessible label.
- [ ] Status filter has an accessible label.
- [ ] Keyboard navigation works.
- [ ] Focus indicator is visible.
- [ ] Error messages use `role="alert"`.
- [ ] Dynamic queue updates use `aria-live`.
- [ ] Loading state uses `role="status"`.

---

# Manual XSS Test

Try entering:

```html
<script>alert("XSS")</script>
```

into the Applicant Name field.

The application should not execute JavaScript.

The input is sanitized and rendered using safe DOM APIs.

---

# GitHub Deployment

## Step 1 — Create Repository

Create a new GitHub repository named:

```text
adoption-interest-queue
```

---

## Step 2 — Add Files

Upload:

```text
index.html
style.css
app.js
README.md
```

---

## Step 3 — Commit

Example commit message:

```text
feat: implement adoption interest queue
```

---

## Step 4 — Enable GitHub Pages

Open:

```text
Repository
→ Settings
→ Pages
```

Select:

```text
Deploy from a branch
```

Then select:

```text
main
/
(root)
```

Save the configuration.

GitHub will provide the deployment URL.

---

# Suggested Pull Request Description

## Summary

Implemented the digital Adoption Interest Queue for Animal Shelter operations.

## Included

- Adoption interest creation
- Queue rendering
- Search and filtering
- Status management
- Form validation
- Empty states
- Loading states
- Local persistence
- XSS-safe rendering
- Accessibility attributes
- Simulated telemetry
- Responsive monochromatic UI

## Technical

Built using:

- HTML5
- CSS3
- Vanilla JavaScript ES6+

No React or external framework was used.

## Testing

Manually tested:

- Happy path
- Empty states
- Invalid inputs
- Search
- Filtering
- Status changes
- LocalStorage persistence
- Loading behavior
- XSS input handling
- Keyboard navigation

## Security

No API keys, credentials, or sensitive PII are included.

---

# Definition of Done

- [x] Code runs without fatal errors.
- [x] Vanilla JavaScript ES6+ used.
- [x] No React.
- [x] Empty state implemented.
- [x] Loading indicator implemented.
- [x] Invalid inputs handled.
- [x] XSS-safe rendering implemented.
- [x] Accessibility attributes implemented.
- [x] Keyboard navigation supported.
- [x] Simulated analytics implemented.
- [x] No API keys or sensitive PII hardcoded.
- [x] Responsive corporate design implemented.

---

## Deliverables

Submit the following for QA:

### GitHub Repository

```text
<YOUR_GITHUB_REPOSITORY_URL>
```

### Live Deployment

```text
<YOUR_LIVE_DEPLOYMENT_URL>
```

Replace both placeholders with the actual URLs after deployment.

```
```
