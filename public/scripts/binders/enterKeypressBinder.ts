(function() {
    ko.bindingHandlers.enter = {
        init: function(element, valueAccessor) {
            $(element).on("keyup", function(e) {
                if (e.keyCode == 13)
                    valueAccessor()(e);
            });
        }
    }
})();