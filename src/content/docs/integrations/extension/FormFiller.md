---
title: Form Filler
description: "Automatically fill out web forms with your data to save time on repetitive tasks like job applications and contact forms."
---

# Form Filler

**What it does:** Automatically fills out web forms with your data, saving you time on repetitive tasks like job applications, contact forms, and registrations.

## What Goes In

| Name | Type | Description | Required | Default |
|------|------|-------------|----------|---------|
| Form Data | Object | Your information to fill into the form | Yes | `{}` |
| Submit After Fill | Boolean | Automatically submit the form when done | No | `false` |
| Simulate Human Input | Boolean | Type like a human (slower but more reliable) | No | `false` |

## What Comes Out

| Name | Type | Description |
|------|------|-------------|
| success | Boolean | Whether the form was filled successfully |
| fieldsCompleted | Array | List of fields that were filled |
| fieldsFailed | Array | List of fields that couldn't be filled |
| formSubmitted | Boolean | Whether the form was submitted |

## Real-World Examples

**Job Application Automation**
Fill out multiple job applications with your resume data, work history, and contact information automatically.

**Event Registration**
Quickly register for conferences, webinars, or events by auto-filling your personal and professional details.

**Contact Form Responses**
Automatically fill contact forms on websites when reaching out to potential clients or partners.

## How to Use It

1. **Prepare your data** in a structured format (name, email, phone, etc.)
2. **Navigate to the form** you want to fill
3. **Run the workflow** - the node finds form fields and fills them automatically
4. **Review and submit** the completed form (or enable auto-submit)

**Example Data Format:**
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "phone": "555-123-4567",
  "company": "Tech Solutions Inc"
}
```

## Try It Yourself

**Simple Contact Form:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com", 
  "subject": "Partnership Inquiry",
  "message": "I'd like to discuss a potential partnership."
}
```

**Job Application:**
```json
{
  "firstName": "Alex",
  "lastName": "Johnson",
  "email": "alex.johnson@email.com",
  "phone": "555-0123",
  "experience": "5 years",
  "coverLetter": "I am excited to apply for this position..."
}
```

<details>
<summary>🔍 Technical Details</summary>

**Smart Field Detection:** The node automatically identifies form fields by their labels, names, and types. It can handle text inputs, dropdowns, checkboxes, and text areas.

**Human-Like Typing:** Enable "Simulate Human Input" to type at realistic speeds with small variations, which helps with forms that detect automated filling.

**Multi-Step Forms:** The node can handle forms that span multiple pages by detecting "Next" buttons and continuing the filling process.

**Limitations:**
- Cannot handle CAPTCHAs (security puzzles)
- Some forms may block automated filling
- File uploads require the files to be accessible on your computer

</details>

**Common Issues:**
- **Fields not filling?** Check that your data keys match the form field names (firstName, email, etc.)
- **Form validation errors?** Make sure your data format matches what the form expects (phone numbers, email format)
- **Form won't submit?** Some forms require manual review - disable auto-submit and check the form before submitting

## What's Next?

- **[Navigate to Link](./NavigateToLink.md)** - Go to different pages to fill multiple forms
- **[Get All Text](./GetAllText.md)** - Extract confirmation messages after form submission
- **[Content Replacer](./ContentReplacer.md)** - Modify form content before filling

