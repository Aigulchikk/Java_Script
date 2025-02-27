document.addEventListener("DOMContentLoaded", function() {

    let title = document.createElement("h1");
    title.textContent = "Интерактивные элементы";
    title.style.color = "black";
    title.style.textAlign = "center";

    let button = document.createElement("button");
    button.textContent = "Изменить цвет текста";
    button.style.fontSize = "18px";
    button.style.padding = "10px 20px";
    button.style.cursor = "pointer";
    button.style.display = "block";
    button.style.margin = "20px auto";

    document.body.appendChild(title);
    document.body.appendChild(button);

    button.addEventListener("click", function() {
        title.style.color = title.style.color === "black" ? "green" : "black";
    });
});