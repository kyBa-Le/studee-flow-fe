export function Logout() {
    localStorage.removeItem("token");
    console.log("clicked");
    window.location.href = "/login";
}