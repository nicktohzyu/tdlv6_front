var apiUrl;
if(process.env.NODE_ENV === 'development') {
    apiUrl = "http://localhost:3001";
}else if(process.env.NODE_ENV === 'production') {
    apiUrl = 'https://nicktohzyu-tdlv5-api.herokuapp.com'; //removed https, does this fix session issue?
}
export default apiUrl;