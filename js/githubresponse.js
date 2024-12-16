// responsegithub.js

export async function saveSurveyAnswersToGitHub(token, repo) {
    const question1 = document.getElementById('question1').value;
    const question2 = document.getElementById('question2').value;
  
    const surveyData = {
      question1: question1,
      question2: question2,
      timestamp: new Date().toISOString(),
    };
  
    const fileContent = JSON.stringify(surveyData, null, 2); // Convert data to JSON
    const encodedContent = btoa(fileContent); // Encode content in Base64 (required by GitHub API)
  
    const path = `responses/response_${Date.now()}.json`; // File path in the repo
  
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
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
  
      if (response.ok) {
        alert('Response saved successfully!');
      } else {
        console.error(await response.json());
        alert('Failed to save response.');
      }
    } catch (error) {
      console.error('Error saving response:', error);
      alert('An error occurred while saving the response.');
    }
  }
  