export async function saveSurveyAnswersToGitHub(finalData) {
    const token = decrypt("klt_d9OfiJfPnPAhv6uPy06h3AEEsMlzNo2rn4z0");
    const repo = 'bikepathsurvey/BikePathSurvey'; // Replace with your GitHub repo

    // Create a unique hashed filename for the survey response
    const email = finalData.email;
    const hashedName = await generateHash(email) + '.json'; // Await the hash generation

    // Remove the email from the finalData object
    delete finalData.email;

    // Iterate over each response in `responses` and remove the `email` key
    Object.values(finalData.responses).forEach((response) => {
        delete response.email;
    });

    // Structure the data to be saved
    const fileContent = JSON.stringify(finalData, null, 2); // Convert data to JSON
    const encodedContent = btoa(fileContent); // Encode content in Base64 (required by GitHub API)

    const path = `testingresponses/${hashedName}`;

    try {
        // Create or overwrite the file directly
        const createResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Add or overwrite survey response',
                content: encodedContent,
            }),
        });

        if (createResponse.ok) {
            alert('Response saved successfully!');
        } else {
            console.error(await createResponse.json());
            alert('Failed to save response.');
        }
    } catch (error) {
        console.error('Error saving response:', error);
        alert('An error occurred while saving the response.');
    }
}

// Generate a one-way hash of a string using SHA-256 (Browser-friendly Web Crypto API)
async function generateHash(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input); // Convert input string to Uint8Array

    // Use SubtleCrypto to hash the data
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert ArrayBuffer to hex string
    return Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
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
