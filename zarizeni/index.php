<?php
$id = basename($_SERVER['REQUEST_URI']);  // GR-0000177
$base = "https://script.google.com/macros/s/AKfycbx_6FbDzAxDj7Wp1f_oydlN4-V3tEM-5tV2d7VIs4mIukBBYhMCa0BH5q7q1gLGarpF6A/exec";
header("Location: {$base}?id={$id}");
exit;
?>
