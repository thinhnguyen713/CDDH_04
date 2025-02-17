<?php
$keyword = isset($_GET["keyword"]) ? $conn->real_escape_string($_GET["keyword"]) : "";

$sql = "SELECT * FROM products WHERE name LIKE '%$keyword%' OR description LIKE '%$keyword%'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "<p><b>" . $row["name"] . "</b>: " . $row["description"] . "</p>";
    }
} else {
    echo "Không tìm thấy sản phẩm nào.";
}

$conn->close();
?>
