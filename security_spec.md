# Security Specification - Survey App

## Data Invariants
- A survey response must contain all required fields: `surveyId`, `createdAt`, `serviceType`, `submissionMethod`, `ratings`, `improvementArea`, and `dataVersion`.
- `ratings` must be an object with 6 specific keys, each having an integer value between 1 and 5.
- `createdAt` must be set using `request.time` (server timestamp).
- `surveyId` must be a string of reasonable length (<= 128) and follow a specific pattern.
- Only authorized admins (listed in `/admins/{uid}`) can read survey responses.
- Public users can only create survey responses and cannot read, update, or delete them.
- Admins cannot modify or delete original survey responses.

## The "Dirty Dozen" Payloads (Target: /surveyResponses/{id})

1. **Identity Spoofing**: Attempt to create a survey with a stolen ID (if auth was required, but it's public).
2. **State Shortcutting**: Attempt to create a survey with a missing required field (e.g., `ratings`).
3. **Resource Poisoning (ID)**: Attempt to use a 2MB string as `surveyId`.
4. **Resource Poisoning (Field)**: Attempt to inject a 1MB string into the `comment` field (exceeding 1000 chars).
5. **Type Poisoning**: Sending `ratings` as a string instead of an object.
6. **Range Violation**: Sending a rating value of 6 or 0.
7. **Character Pattern Violation**: Sending a `surveyId` with invalid characters.
8. **Shadow Field Injection**: Adding an `isVerified: true` field to the survey response.
9. **Timestamp Spoofing**: Sending a client-side `createdAt` date instead of `serverTimestamp()`.
10. **Unauthorized Read**: Attempting to list all surveys as a public user.
11. **Unauthorized Update**: Attempting to change the rating of an existing survey.
12. **Unauthorized Delete**: Attempting to delete a survey as a public user.

## Conflict Report

- **Identity Spoofing**: Handled by whitelisting fields and ensuring `surveyId` in path matches `surveyId` in data (if desired) or just validating `surveyId` format.
- **State Shortcutting**: Handled by `hasAll` and `hasOnly` keys check.
- **Resource Poisoning**: Handled by `.size()` checks on strings and `.maxLength` in blueprint.
- **Value Poisoning**: Handled by `is int` and range checks `1-5`.
- **Timestamp Integrity**: Handled by `incoming().createdAt == request.time`.
- **Admin Bypass**: Handled by explicit `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` check.
