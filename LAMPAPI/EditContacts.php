<?php
$inData = getRequestInfo();

$contactId = $inData["contactId"];
$userId = $inData["userId"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phone = $inData["phone"];
$email = $inData["email"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Check if the contact exists and belongs to the specified user
    $checkQuery = $conn->prepare("SELECT COUNT(*) FROM Contacts WHERE ID=? AND UserID=?");
    $checkQuery->bind_param("ss", $contactId, $userId);
    $checkQuery->execute();
    $checkQuery->bind_result($count);
    $checkQuery->fetch();
    $checkQuery->close();

    if ($count == 1) {
        // Contact exists and belongs to the user, proceed with the update
        $updateQuery = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? AND UserID=?");
        $updateQuery->bind_param("ssssss", $firstName, $lastName, $phone, $email, $contactId, $userId);
        $updateQuery->execute();
        $updateQuery->close();
        $conn->close();
        returnWithError("");
    } else {
        // Contact not found or doesn't belong to the user
        $conn->close();
        returnWithError("Contact not found.");
    }
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
?>
