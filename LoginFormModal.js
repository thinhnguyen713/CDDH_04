document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("authModal");
    const openBtn = document.getElementById("openLoginBtn");
    const closeBtn = document.querySelector(".close");

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    const registerLink = document.getElementById("registerLink");
    const loginLink = document.getElementById("loginLink");

    // Khi nhấn vào "Đăng nhập"
    openBtn.addEventListener("click", () => {
        modal.style.display = "block";
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    });

    // Khi nhấn vào dấu "X" để đóng modal
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Khi nhấn vào "Đăng ký ngay"
    registerLink.addEventListener("click", (event) => {
        event.preventDefault();
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    });

    // Khi nhấn vào "Đăng nhập ngay"
    loginLink.addEventListener("click", (event) => {
        event.preventDefault();
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    });

    // Đóng modal khi nhấn ra ngoài
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
