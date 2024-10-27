// app/api.tsx

// Fetch response from the chatbot API
export const fetchChatbotResponse = async (question: string) => {
    const response = await fetch(' https://hex-hacc-2024-2092041301.us-east-2.elb.amazonaws.com/api/chatbot', {
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

    const response = await fetch(' https://hex-hacc-2024-2092041301.us-east-2.elb.amazonaws.com/api/uncle-hex', {
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
