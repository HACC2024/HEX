// pages/api.tsx

// Fetch response from the chatbot API
export const fetchChatbotResponse = async (question: string) => {
    const response = await fetch('http://18.224.7.0:5000/api/chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.response;
};

// Fetch response from the uncle-hex API
export const fetchUncleHexResponse = async (question: string, file?: File | null) => {
    const formData = new FormData();
    formData.append('question', question);

    // If a file is provided, append it to the form data
    if (file) {
        formData.append('file', file);
    }

    const response = await fetch('http://18.224.7.0:5000/api/uncle-hex', {
        method: 'POST',
        body: formData, // Use FormData for multipart/form-data
    });

    if (!response.ok) {
        const errorText = await response.text(); // Capture the error response
        throw new Error(`Network response was not ok: ${errorText}`);
    }

    const data = await response.json();
    return data.response;
};
