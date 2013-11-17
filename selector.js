(function() {

window.ConstraintSelector = {
    REPEAT_OPTIONS: 5,
    ANIMATION_LENGTH: 2050,
    SELECTION_TOP: 230,
    OPTION_HEIGTH: 50,

    remainingRolls: 0,
    numberOfOptions: 0,
    numberOfRepeatedOptions: 0,
    optionsNode: null,
    rollerInterval: null,

    initialize: function (options) {
        this.optionsNode = $("options");
        this.selectionNode = $("selection");
        this.loadOptions(options);
        document.onkeyup = bind(this.handleKeyUp, this);
        document.onmouseup = bind(this.handleMouseUp, this);
    },

    loadOptions: function (options) {
        var repeatedOptions = [],
            l = options.length,
            i, j;

        for (i = 0; i < this.REPEAT_OPTIONS; ++i) {
            for (j = 0; j < l; ++j) {
                repeatedOptions.push(options[j]);
            }
        }

        this.numberOfOptions = options.length;
        this.numberOfRepeatedOptions = repeatedOptions.length;
        this.optionsNode.appendChild(this.createNodesForOptions(repeatedOptions));
    },

    createNodesForOptions: function (options) {
        var documentFragment = document.createDocumentFragment(),
            listItem,
            i, l;

        for (i = 0, l = options.length; i < l; ++i) {
            listItem = document.createElement("li");
            listItem.innerHTML = this.quoteHtml(options[i]);
            documentFragment.appendChild(listItem);
        }

        return documentFragment;
    },

    quoteHtml: function (text) {
        return (text.replace("&", "&amp;")
                    .replace("\"", "&quot;")
                    .replace("'", "&#039;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;"));
    },

    handleKeyUp: function () {
        if (event.keyCode == 13 || event.keyCode == 32) {
            this.startRolling();
        }
    },

    handleMouseUp: function () {
        this.startRolling();
    },

    startRolling: function () {
        if (this.remainingRolls > 0) {
            return;
        }

        this.remainingRolls = this.random(2, 4);
        this.roll();
        this.rollerInterval = window.setInterval(
            bind(this.roll, this),
            this.ANIMATION_LENGTH
        );
    },

    random: function (min, max) {
        return Math.floor(Math.random() * max) + min;
    },

    roll: function () {
        if (--this.remainingRolls == 1) {
            this.stopRolling();
        }

        this.selectionNode.className = (this.remainingRolls % 2 == 1)
            ? "highlight"
            : "";
        this.selectOption(this.getRandomSelection());
    },

    stopRolling: function () {
        window.clearInterval(this.rollerInterval);
        this.selectionNode.className = "";
        this.remainingRolls = 0;
    },

    getRandomSelection: function () {
        return this.random(
            this.numberOfOptions,
            this.numberOfRepeatedOptions - this.numberOfOptions * 2
        );
    },

    selectOption: function (selectionIndex) {
        var top = this.SELECTION_TOP - selectionIndex * this.OPTION_HEIGTH;

        this.optionsNode.style.top = String(top) + "px";
    }
}

function $(id_or_object) {
    return (typeof(id_or_object) == "object") 
        ? id_or_object
        : document.getElementById(id_or_object);
}

function bind(callable, object) {
    return function () {
        return callable.apply(object, arguments);
    };
}

})();
