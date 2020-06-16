// Initialises the AngularJS module
var app = angular.module('myApp', []);

// Adds a new controller to the app that controls the adding up app
app.controller('myCtrl', function($scope) {
    $scope.nameExistsMessage = "That name already exists.";
    $scope.edit = {};

    // The items that are in the 'shopping cart'
    $scope.items = [
        {
            "name": "Potatoes",
            "quantity": 2,
            "originalcost": 2,
            "rollbackcost": 1.2,
            "notes": "2 for 1"
        },
        {
            "name": "Tomatoes",
            "quantity": 5,
            "originalcost": 5,
            "rollbackcost": 1,
            "notes": ""
        }
    ];

    /**
     * Returns a JSON entity of the selected item
     * @return {*} - the selected item
     */
    function getSelectedItem()
    {
        for (i = 0; i < $scope.items.length; i++)
        {
            if ($scope.items[i].name === $scope.selectedItemName)
                return $scope.items[i];
        }
    }

    /**
     * Reads the 'items' array and adds up the rollback cost into a total
     * @return {number} - the total cost of all the items
     */
    $scope.getTotalCost = function() {
        var total = 0;
        $scope.items.forEach(function (value, index) {
            total += (value.rollbackcost * value.quantity);
        });
        return total;
    };

    /**
     * Reads the 'items' array and adds up the amount saved
     * @return {number} - the total amount saved from all the rollback
     */
    $scope.getTotalAmountSaved = function() {
        var total = 0;
        $scope.items.forEach(function (value, index) {
            total += ( (value.originalcost - value.rollbackcost) * value.quantity);
        });
        return total;
    };

    /**
     * Executed when the user wants to add a new item to the list
     */
    $scope.itemClick = function(item) {
        $scope.selectedItemName = item.name;
        $("#selectModal").modal();
    };

    /**
     * Executed when the user wants to add a new item to the list
     */
    $scope.addItemClick = function() {
        // If we do NOT have a repeated name
        if (!$scope.repeatedName)
        {
            // Create a json object of the new item
            var newitem = {
                "name": $("#addModal input[name='itemName']").val(),
                "quantity": parseInt($("#addModal input[name='quantity']").val()),
                "originalcost": parseFloat($("#addModal input[name='originalCost']").val()),
                "rollbackcost": parseFloat($("#addModal input[name='rollbackCost']").val()),
                "notes": $("#addModal input[name='notes']").val()
            };

            // Check if they are all filled in
            if (newitem.name === "" || newitem.quantity === "" || newitem.originalcost === "" || newitem.rollbackcost === "")
                alert("Please input all fields! (notes is optional)");
            else
            {
                // Push this onto the array
                $scope.items.push(newitem);

                // Turn off modal
                $("#addModal").modal("hide");

                // Reset all values in modal
                $("#addModal input[name='itemName']").val("");
                $("#addModal input[name='quantity']").val("");
                $("#addModal input[name='originalCost']").val("");
                $("#addModal input[name='rollbackCost']").val("");
                $("#addModal input[name='notes']").val("");
            }
        }
    };

    /**
     * Executed when the user wants to edit an existing item
     */
    $scope.editItemClick = function() {
        // Checks if all fields are filled in
        if ($("#editModal input[name='itemName']").val() === "" ||
            $("#editModal input[name='quantity']").val() === "" ||
            $("#editModal input[name='originalcost']").val() === "" ||
            $("#editModal input[name='rollbackcost']").val() === "")
        {
            alert("Please input all fields! (notes is optional)");
        }
        else {
            // If we do NOT have a repeated name
            if (!$scope.repeatedName) {
                for (i = 0; i < $scope.items.length; i++) {
                    if ($scope.items[i].name === $scope.selectedItemName) {
                        // We've found the corresponding item; change it
                        $scope.items[i].name = $("#editModal input[name='itemName']").val();
                        $scope.items[i].quantity = parseInt($("#editModal input[name='quantity']").val());
                        $scope.items[i].originalcost = parseFloat($("#editModal input[name='originalCost']").val());
                        $scope.items[i].rollbackcost = parseFloat($("#editModal input[name='rollbackCost']").val());
                        $scope.items[i].notes = $("#editModal input[name='notes']").val();

                        // Hide modal
                        $("#editModal").modal("hide");

                        // Break the loop
                        break;
                    }
                }
            }
        }
    };

    /**
     * Shows the edit modal based on the 'selectedItemName' variable
     */
    $scope.showEditModal = function() {
        // Sets up all the data entities to edit
        var selectedItem = getSelectedItem();
        console.log(selectedItem);
        $scope.edit.name = $scope.selectedItemName;
        $scope.edit.quantity = selectedItem.quantity;
        $scope.edit.originalcost = selectedItem.originalcost;
        $scope.edit.rollbackcost = selectedItem.rollbackcost;
        $scope.edit.notes = selectedItem.notes;

        // Opens up modal
        $("#editModal").modal();
    };

    /**
     * Deletes the item of 'selectedItemName' value
     */
    $scope.deleteSelectedItem = function() {
        // Finds the index of this value
        var index = -1;
        for (i = 0; i < $scope.items.length; i++)
        {
            if ($scope.items[i].name === $scope.selectedItemName) {
                index = i;
                break;
            }
        }

        // If it exists
        if (index !== -1) {
            // Delete it
            $scope.items.splice(index, 1);
        } else {
            alert("Something went wrong.");
        }
    };

    /**
     * Executed when an input box with an item name has its name changed
     * @param selector - the selector of the input box
     * @param addItemName - the name that has been changed to
     */
    $scope.itemNameChanged = function(selector, addItemName) {
        for (i = 0; i < $scope.items.length; i++)
        {
            value = $scope.items[i];
            if (addItemName === value.name) {
                $scope.repeatedName = true;
                $(selector).addClass("error");
                $(".nameExistsMessage").css("display", "block");
                break;
            }
            else {
                $scope.repeatedName = false;
                $(selector).removeClass("error");
                $(".nameExistsMessage").css("display", "none");
            }
        }
    };

    /**
     * Same as 'itemNameChanged', but it has an exception.
     * @param selector - the selector of the input box
     * @param addItemName - the name that has been changed to
     * @param exception - the name to ignore
     */
    $scope.itemNameChanged = function(selector, addItemName, exception) {
        for (i = 0; i < $scope.items.length; i++)
        {
            value = $scope.items[i];
            if (addItemName === value.name && value.name !== exception) {
                $scope.repeatedName = true;
                $(selector).addClass("error");
                $(".nameExistsMessage").css("display", "block");
                break;
            }
            else {
                $scope.repeatedName = false;
                $(selector).removeClass("error");
                $(".nameExistsMessage").css("display", "none");
            }
        }
    };

    $scope.clearAllClick = function() {
        if (window.confirm("Are you sure you want to clear everything?")) {
            $scope.items.length = 0;
        }
    };

});