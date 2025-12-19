# ProjectAthlete v2 — Final Verification & Testing Guide

This guide outlines the steps to perform a complete end-to-end verification of the system across all user roles.

---

## 🏃 Role 1: Athlete (General User)

### 1. Authentication & Profile
- [ ] Login via Email/Password or Apple OAuth.
- [ ] Verify you are redirected to the Dashboard.
- [ ] Go to **Profile**.
- [ ] **Upload a Profile Photo** and verify it displays correctly.
- [ ] **Change Display Name** and verify it updates in the navbar and activity feed.
- [ ] Log out and verify you cannot access `/` or `/workouts` without logging in.

### 2. Workout Logging & Templates
- [ ] Go to **Workouts** > **Log Workout**.
- [ ] Search for an exercise using the **instant live search**.
- [ ] Add sets and values (Weight/Reps or Time/Distance/Cals).
- [ ] Check **"Save as Template"** before saving.
- [ ] Save the workout and verify it appears in your history.
- [ ] Start a **New Workout** again and select your **Template**.
- [ ] Verify the template populates all exercises and sets automatically.
- [ ] Click on the workout to edit it, change a value, and save.
- [ ] Delete the workout and confirm it's gone.

### 3. Analytics & Stats
- [ ] Go to **Stats**.
- [ ] Verify **Volume Chart** shows data for the last 30 days.
- [ ] Verify **Workout Streak** card is accurate.
- [ ] Verify **Category Breakdown** pie chart shows your training distribution.
- [ ] Select an exercise in the **PR Progression** chart and verify the timeline.

### 4. Exercise Library
- [ ] Go to **Exercises**.
- [ ] Use the search bar to find "Squat".
- [ ] Filter by category (e.g., "Push").
- [ ] Create a **Custom Exercise** (e.g., "My Custom Bench Press").
- [ ] Verify the custom exercise appears in your library and the workout picker.

### 5. Community & Feed
- [ ] Go to **Dashboard** (Activity Feed).
- [ ] Verify your recent workout or PR appears in the feed automatically.
- [ ] **Add a Manual Post** and verify it shows up.
- [ ] **React** to a post (Fire/Heart/Respect) and verify the count updates.
- [ ] Go to **Community** > **Submit Workout**.
- [ ] Submit a workout and verify it's NOT visible in the community feed yet (pending approval).

### 6. Challenges
- [ ] Go to **Challenges**.
- [ ] Join an active challenge and log progress.
- [ ] Verify the **Custom Badge** (if any) displays on the challenge page.
- [ ] Edit/Delete your progress log and verify the leaderboard updates.
- [ ] Toggle **Anonymous Mode** in **Profile** and verify your name is hidden on the leaderboard.

---

## 👨‍🏫 Role 2: Coach (Staff User)

### 1. Monitoring Athletes
- [ ] Go to **Workouts**.
- [ ] Click the **All Athletes** button.
- [ ] Verify you can see workouts from other users in your organization.
- [ ] Ensure athlete names are visible on the cards.

### 2. Community Management
- [ ] Go to **Community**.
- [ ] Click the **Review** button (verify the badge shows pending submissions).
- [ ] Approve an athlete's workout.
- [ ] Verify the workout now appears in the main Community feed.
- [ ] **Feature** a workout and verify it has a star icon and higher placement.

### 3. Creating Challenges
- [ ] Go to **Challenges** > **New**.
- [ ] Create a challenge with a future start date.
- [ ] Verify it appears in the **Upcoming Challenges** section.
- [ ] Create a challenge with a current start date and verify it's **Active**.

---

## 🛠️ Role 3: Admin (Full Control)

### 1. Global Oversight
- [ ] Perform all Coach actions.
- [ ] Verify access to any future admin-only panels.

---

## 📱 Mobile Verification (375px)

- [ ] Verify **BottomNav** is visible and usable.
- [ ] Verify **Workout Form** (sets/reps) fits on screen without horizontal scrolling.
- [ ] Verify **Leaderboards** handle long names gracefully.
- [ ] Verify **Pinch-to-zoom** is disabled (viewport lock).

---

## 🐳 Docker Verification

- [ ] Build the container: `docker build -t athlete .`
- [ ] Run the container: `docker run -p 6767:6767 athlete`
- [ ] Access `localhost:6767` and verify the app functions normally.

