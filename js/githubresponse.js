export async function saveSurveyAnswersToGitHub(finalData) {
    const token = decrypt("klt_d9OfiJfPnPAhv6uPy06h3AEEsMlzNo2rn4z0");
    const repo = 'bikepathsurvey/BikePathSurvey'; // Replace with your GitHub repo
    const email = finalData.email;

    // Sanitize email to create a valid filename
    const sanitizedEmail = email.replace('@', '').replace('.', '') + '.json';

    // Structure the data to be saved
    const fileContent = JSON.stringify(finalData, null, 2); // Convert data to JSON
    const encodedContent = btoa(fileContent); // Encode content in Base64 (required by GitHub API)

    const path = `responses/${sanitizedEmail}`;

    try {
        // Check if the file exists on GitHub
        const fileResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        const fileData = await fileResponse.json();

        if (fileResponse.status === 200) {
            // If file exists, fetch current content and update it
            const currentContent = JSON.parse(atob(fileData.content)); // Decode existing content
            const updatedContent = {
                ...currentContent,
                responses: finalData.responses, // Update the responses
                timestamp: new Date().toISOString() // Update timestamp
            };

            const updatedEncodedContent = btoa(JSON.stringify(updatedContent, null, 2)); // Encode the updated content

            // Update the file on GitHub with the SHA (to avoid the 409 conflict)
            const updateResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Update survey response',
                    content: updatedEncodedContent,
                    sha: fileData.sha // Required for updating the file
                }),
            });

            if (updateResponse.ok) {
                alert('Response updated successfully!');
            } else {
                console.error(await updateResponse.json());
                alert('Failed to update response.');
            }
        } else if (fileResponse.status === 404) {
            // If file does not exist, create a new one
            const createResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Add new survey response',
                    content: encodedContent,
                }),
            });

            if (createResponse.ok) {
                alert('Response saved successfully!');
            } else {
                console.error(await createResponse.json());
                alert('Failed to save response.');
            }
        }
    } catch (error) {
        console.error('Error saving response:', error);
        alert('An error occurred while saving the response.');
    }
}

// Simple email validation
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

// Decrypt function used to retrieve the token
function decrypt(input) {
    const shift = 4;
    let decrypted = "";

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        if (char.match(/[a-zA-Z]/)) { // Check if the character is a letter
            const base = char === char.toUpperCase() ? 65 : 97; // 'A' = 65, 'a' = 97
            decrypted += String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
        } else {
            decrypted += char; // Non-alphabetic characters are added as-is
        }
    }

    return decrypted;
}
