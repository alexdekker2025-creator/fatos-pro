# Requirements Document

## Introduction

This document specifies requirements for enhancing the existing admin panel with comprehensive user management capabilities and an improved statistics dashboard. The enhancements will enable administrators to efficiently manage users, monitor system metrics, and make data-driven decisions through interactive visualizations and detailed analytics.

## Glossary

- **Admin_Panel**: The administrative interface accessible at `/ru/admin` and `/en/admin` for system administrators
- **User_Management_Module**: The component responsible for displaying, searching, filtering, and modifying user accounts
- **Statistics_Dashboard**: The component displaying system metrics, charts, and analytics
- **Admin_User**: A user account with `isAdmin` flag set to true, authorized to access the Admin_Panel
- **Target_User**: A user account being viewed or modified by an Admin_User
- **User_Details_Modal**: A modal dialog displaying comprehensive information about a Target_User
- **Audit_Log**: A persistent record of all administrative actions performed in the system
- **Block_Status**: A boolean flag indicating whether a Target_User is prevented from logging in
- **Chart_Component**: A visual representation of data using Chart.js or Recharts library
- **Time_Range_Filter**: A user-selectable period for filtering statistics (7 days, 30 days, 90 days, all time, or custom)
- **Export_Function**: The capability to download statistics data in CSV or Excel format
- **Destructive_Action**: An operation that permanently modifies or deletes data (delete user, block user)
- **Active_User**: A user who has logged in within a specified time period (7 or 30 days)
- **OAuth_Provider**: An external authentication service (Google, GitHub, etc.) linked to a user account

## Requirements

### Requirement 1: User List Display

**User Story:** As an administrator, I want to view all users with their detailed information, so that I can monitor and manage the user base effectively.

#### Acceptance Criteria

1. WHEN an Admin_User accesses the User_Management_Module, THE Admin_Panel SHALL display a paginated list of all users
2. FOR EACH user in the list, THE Admin_Panel SHALL display email, name, registration date, email verification status, 2FA status, and OAuth_Provider information
3. THE Admin_Panel SHALL display 25 users per page
4. THE Admin_Panel SHALL provide pagination controls to navigate through all users
5. WHEN the user list contains more than 100 users, THE Admin_Panel SHALL display the total user count

### Requirement 2: User Search and Filtering

**User Story:** As an administrator, I want to search and filter users by various criteria, so that I can quickly find specific users or user groups.

#### Acceptance Criteria

1. THE User_Management_Module SHALL provide a search input field for filtering users
2. WHEN an Admin_User enters text in the search field, THE User_Management_Module SHALL filter users by email or name containing the search text
3. THE User_Management_Module SHALL provide filter controls for email verification status, 2FA status, and Block_Status
4. THE User_Management_Module SHALL provide a date range filter for registration date
5. WHEN multiple filters are applied, THE User_Management_Module SHALL display only users matching all active filters
6. THE User_Management_Module SHALL update the displayed results within 500ms of filter changes

### Requirement 3: User Information Editing

**User Story:** As an administrator, I want to edit user information, so that I can correct errors or update user details as needed.

#### Acceptance Criteria

1. WHEN an Admin_User selects a Target_User, THE Admin_Panel SHALL display an edit interface for name, email, and admin status
2. WHEN an Admin_User modifies user information, THE Admin_Panel SHALL validate the new email format before saving
3. WHEN an Admin_User saves valid changes, THE Admin_Panel SHALL update the Target_User record in the database
4. WHEN an Admin_User saves changes, THE Admin_Panel SHALL record the action in the Audit_Log
5. IF the email already exists for another user, THEN THE Admin_Panel SHALL display an error message and prevent the update

### Requirement 4: User Blocking and Unblocking

**User Story:** As an administrator, I want to block and unblock users, so that I can prevent unauthorized or problematic users from accessing the system.

#### Acceptance Criteria

1. THE User_Management_Module SHALL provide a block/unblock toggle for each Target_User
2. WHEN an Admin_User blocks a Target_User, THE Admin_Panel SHALL set the Block_Status to true
3. WHEN a blocked Target_User attempts to log in, THE authentication system SHALL reject the login attempt with a descriptive error message
4. WHEN an Admin_User unblocks a Target_User, THE Admin_Panel SHALL set the Block_Status to false
5. WHEN an Admin_User changes Block_Status, THE Admin_Panel SHALL record the action in the Audit_Log
6. IF the Target_User is the same as the Admin_User, THEN THE Admin_Panel SHALL prevent the block action and display an error message

### Requirement 5: User Account Deletion

**User Story:** As an administrator, I want to delete user accounts, so that I can remove inactive or problematic accounts from the system.

#### Acceptance Criteria

1. THE User_Management_Module SHALL provide a delete button for each Target_User
2. WHEN an Admin_User clicks delete, THE Admin_Panel SHALL display a confirmation dialog requiring explicit confirmation
3. WHEN an Admin_User confirms deletion, THE Admin_Panel SHALL permanently remove the Target_User and all associated data
4. WHEN an Admin_User deletes a Target_User, THE Admin_Panel SHALL record the action in the Audit_Log
5. IF the Target_User is the same as the Admin_User, THEN THE Admin_Panel SHALL prevent the deletion and display an error message

### Requirement 6: User Activity Monitoring

**User Story:** As an administrator, I want to view user activity metrics, so that I can understand user engagement and identify inactive accounts.

#### Acceptance Criteria

1. FOR EACH Target_User, THE User_Management_Module SHALL display calculations count, purchases count, and last login timestamp
2. THE User_Management_Module SHALL calculate and display Active_User status for 7-day and 30-day periods
3. WHEN displaying last login, THE Admin_Panel SHALL show the timestamp in the Admin_User's locale format
4. THE User_Management_Module SHALL sort users by last login date when the Admin_User selects that sort option

### Requirement 7: User Details Modal

**User Story:** As an administrator, I want to view comprehensive user details in a modal, so that I can access all user information in one place.

#### Acceptance Criteria

1. WHEN an Admin_User clicks on a Target_User, THE Admin_Panel SHALL open the User_Details_Modal
2. THE User_Details_Modal SHALL display full profile information, activity timeline, calculation history, and purchase history
3. THE User_Details_Modal SHALL display security events including login attempts, password changes, and 2FA changes
4. THE User_Details_Modal SHALL provide quick action buttons for block, delete, and password reset operations
5. WHEN an Admin_User performs a quick action, THE Admin_Panel SHALL execute the action and update the modal display

### Requirement 8: Statistics Dashboard Overview

**User Story:** As an administrator, I want to view system statistics with interactive charts, so that I can monitor system health and growth trends.

#### Acceptance Criteria

1. THE Statistics_Dashboard SHALL display user growth over time using a line Chart_Component
2. THE Statistics_Dashboard SHALL display calculation trends over time using a line Chart_Component
3. THE Statistics_Dashboard SHALL display revenue trends over time using a line Chart_Component
4. THE Statistics_Dashboard SHALL display OAuth usage breakdown using a pie Chart_Component
5. THE Statistics_Dashboard SHALL display email verification rate and 2FA adoption rate as percentage metrics
6. THE Statistics_Dashboard SHALL display Active_User counts for 7-day and 30-day periods

### Requirement 9: Time Range Filtering

**User Story:** As an administrator, I want to filter statistics by time range, so that I can analyze trends over different periods.

#### Acceptance Criteria

1. THE Statistics_Dashboard SHALL provide Time_Range_Filter options for last 7 days, 30 days, 90 days, and all time
2. THE Statistics_Dashboard SHALL provide a custom date range selector for Time_Range_Filter
3. WHEN an Admin_User selects a Time_Range_Filter, THE Statistics_Dashboard SHALL update all Chart_Components within 1 second
4. WHEN an Admin_User selects a custom date range, THE Statistics_Dashboard SHALL validate that the start date is before the end date
5. THE Statistics_Dashboard SHALL persist the selected Time_Range_Filter in the Admin_User's session

### Requirement 10: Statistics Export

**User Story:** As an administrator, I want to export statistics to CSV or Excel, so that I can perform offline analysis or share data with stakeholders.

#### Acceptance Criteria

1. THE Statistics_Dashboard SHALL provide an Export_Function button for CSV format
2. THE Statistics_Dashboard SHALL provide an Export_Function button for Excel format
3. WHEN an Admin_User clicks export, THE Statistics_Dashboard SHALL generate a file containing all visible statistics data
4. THE Export_Function SHALL include the selected Time_Range_Filter in the filename
5. THE Export_Function SHALL complete within 5 seconds for datasets up to 10,000 records

### Requirement 11: Real-time Statistics Updates

**User Story:** As an administrator, I want statistics to update in real-time, so that I always see current data without manual refresh.

#### Acceptance Criteria

1. THE Statistics_Dashboard SHALL poll for new data every 30 seconds
2. WHEN new data is available, THE Statistics_Dashboard SHALL update Chart_Components with smooth transitions
3. THE Statistics_Dashboard SHALL display a timestamp showing when data was last updated
4. IF the polling request fails, THEN THE Statistics_Dashboard SHALL retry after 60 seconds and display a warning indicator

### Requirement 12: Access Control and Security

**User Story:** As a system administrator, I want strict access control on the admin panel, so that only authorized users can manage the system.

#### Acceptance Criteria

1. WHEN a non-admin user attempts to access the Admin_Panel, THE system SHALL redirect to the home page
2. THE Admin_Panel SHALL verify admin status on every API request
3. WHEN an Admin_User performs a Destructive_Action, THE Admin_Panel SHALL require confirmation before execution
4. THE Admin_Panel SHALL record all administrative actions in the Audit_Log with timestamp, Admin_User ID, action type, and Target_User ID
5. THE Audit_Log SHALL retain records for at least 90 days

### Requirement 13: Responsive Design and UI/UX

**User Story:** As an administrator, I want the admin panel to work on mobile and tablet devices, so that I can manage the system from any device.

#### Acceptance Criteria

1. THE Admin_Panel SHALL display correctly on screen widths from 320px to 2560px
2. WHEN the screen width is less than 768px, THE Admin_Panel SHALL switch to a mobile-optimized layout
3. THE Admin_Panel SHALL display loading indicators during data fetch operations
4. WHEN an operation fails, THE Admin_Panel SHALL display an error notification with a descriptive message
5. WHEN an operation succeeds, THE Admin_Panel SHALL display a success notification for 3 seconds
6. THE Admin_Panel SHALL use smooth animations for modal transitions and chart updates with duration not exceeding 300ms

### Requirement 14: Bilingual Support

**User Story:** As an administrator, I want the admin panel in both Russian and English, so that I can use the interface in my preferred language.

#### Acceptance Criteria

1. THE Admin_Panel SHALL display all text in Russian when accessed via `/ru/admin`
2. THE Admin_Panel SHALL display all text in English when accessed via `/en/admin`
3. THE Admin_Panel SHALL format dates and numbers according to the selected locale
4. THE Admin_Panel SHALL translate all error messages, notifications, and confirmation dialogs
5. THE Admin_Panel SHALL maintain consistent terminology across both language versions

### Requirement 15: Database Schema Extension

**User Story:** As a developer, I want to extend the User model with blocking capability, so that administrators can prevent user logins.

#### Acceptance Criteria

1. THE User model SHALL include an `isBlocked` boolean field with default value false
2. THE User model SHALL maintain existing fields: id, email, name, isAdmin, emailVerified, twoFactorEnabled, createdAt
3. WHEN the database schema is updated, THE migration SHALL preserve all existing user data
4. THE User model SHALL index the `isBlocked` field for query performance
