// Viet ham nhan vao 1 response, kiem tra respone.status, neu status = true thi thong bao response.data.message, neu status = false thi thong bao response.message

function CheckResponse(response) {
    const responseData = response.data;
    if (responseData.status) {
        alert(responseData.message);
        console.log('Response:', responseData);
    } else {
        alert(responseData.message);
        console.error('Error Response:', responseData);
    }
};

export default CheckResponse;