maps = {
    Unique : ["Acton's_Nightmare", "Caer_Blaidd,_Wolfpack's_Den", "Death_and_Taxes", "Hallowed_Ground",
        "Hall_of_Grandmasters", "Maelström_of_Chaos", "Mao_Kun", "Oba's_Cursed_Trove", "Olmec's_Sanctum",
        "Poorjoy's_Asylum", "The_Coward's_Trial", "The_Perandus_Manor", "The_Putrid_Cloister",
        "The_Vinktar_Square", "Vaults_of_Atziri", "Whakawairua_Tuahu"],
    Tier1  : ["Arcade", "Crystal_Ore", "Desert", "Jungle_Valley"],
    Tier2  : ["Beach", "Factory", "Ghetto", "Oasis"],
    Tier3  : ["Arid_Lake", "Cavern", "Channel", "Grotto", "Marshes", "Sewer", "Vaal_Pyramid"],
    Tier4  : ["Academy", "Acid_Lakes", "Dungeon", "Graveyard", "Phantasmagoria", "Villa", "Waste_Pool"],
    Tier5  : ["Burial_Chambers", "Dunes", "Mesa", "Peninsula", "Pit", "Primordial_Pool", "Spider_Lair", "Tower"],
    Tier6  : ["Canyon", "Quarry", "Racecourse", "Ramparts", "Spider_Forest", "Strand", "Thicket", "Vaal_City", "Wharf"],
    Tier7  : ["Arachnid_Tomb", "Armory", "Ashen_Wood", "Castle_Ruins", "Catacombs", "Cells", "Mud_Geyser"],
    Tier8  : ["Arachnid_Nest", "Arena", "Atoll", "Barrows", "Bog", "Cemetery", "Pier", "Tropical_Island", "Shore"],
    Tier9  : ["Covers", "Crypt", "Museum", "Orchard", "Overgrown_Shrine", "Promenade", "Reef", "Temple"],
    Tier10 : ["Arsenal", "Colonnade", "Courtyard", "Malformation", "Quay", "Terrace", "Underground_River"],
    Tier11 : ["Bazaar", "Chateau", "Excavation", "Precinct", "Torture_Chamber", "Underground_Sea", "Wasteland"],
    Tier12 : ["Crematorium", "Estuary", "Ivory_Temple", "Necropolis", "Plateau", "Residence", "Shipyard", "Vault"],
    Tier13 : ["Beacon", "Gorge", "High_Gardens", "Lair", "Plaza", "Scriptorium", "Sulphur_Wastes", "Waterways"],
    Tier14 : ["Maze", "Mineral_Pools", "Palace", "Shrine", "Springs", "Volcano"],
    Tier15 : ["Abyss", "Colosseum", "Core", "Dark_Forest", "Overgrown_Ruin"],
    Tier16 : ["Forge_of_the_Phoenix", "Lair_of_the_Hydra", "Maze_of_the_Minotaur", "Pit_of_the_Chimera", "Vaal_Temple"]
}

completedMaps = {};

var totalNumberOfMaps = 0;
var numberOfCompletedMaps = 0;

function toggleChevron(e) {
    $(e.target).parent().find(".panel-title .glyphicon")
        .toggleClass("glyphicon-chevron-down glyphicon-chevron-right");
}

$(document).ready(function() {
    $("#mapSelector").on('hidden.bs.collapse', toggleChevron);
    $("#mapSelector").on('shown.bs.collapse', toggleChevron);
    $("#resetButton").on('click', function(e) {
        e.preventDefault();
        $('#confirm').modal({ backdrop: 'static', keyboard: false })
            .one('click', '#delete', function() {
                resetData(); // submit the form
        });
    });

    generateMapSelector();

    $.each(maps, function(i, val) {
        completedMaps[i] = [];
        totalNumberOfMaps += val.length;
    });

    loadFromLocalStorage();
    displayMissingMaps();
});

function saveToLocalStorage() {
    localStorage.setItem("data", JSON.stringify(completedMaps));
}

function loadFromLocalStorage() {
    var loadedData = JSON.parse(localStorage.getItem("data"));
    if (loadedData !== null) {
        $.each(loadedData, function(i, val) {
        $.each(val, function() {
            setMapAsComplete(i, this);
        });
    });
        completedMaps = loadedData;
    }
}

function resetData() {
    $.each(maps, function(i, val) {
        completedMaps[i] = [];
    });
    numberOfCompletedMaps = 0;
    displayMissingMaps();
    updateProgressBar();
    saveToLocalStorage();
}

function toggleMapCompletion(category, name) {
    var index = completedMaps[category].indexOf(name);
    if (index < 0) {
        setMapAsComplete(category, name);
    } else {
        setMapAsNotComplete(category, name);
    }
}

function setMapAsNotComplete(category, name) {
    var index = completedMaps[category].indexOf(name);
    if (index > -1) {
        $("#" + name).find("span").toggleClass("glyphicon-ok glyphicon-remove");
        $("#" + name).find("a").css("color", "#23527C");
        numberOfCompletedMaps--;
        completedMaps[category].splice(index, 1);

        displayMissingMaps();
        updateProgressBar();
        saveToLocalStorage();
    }
}

function setMapAsComplete(category, name) {
    var index = completedMaps[category].indexOf(name);
    if (index < 0) {
        $("#" + name).find("span").toggleClass("glyphicon-ok glyphicon-remove");
        $("#" + name).find("a").css("color", "#0A0");
        numberOfCompletedMaps++;
        completedMaps[category].push(name);

        displayMissingMaps();
        updateProgressBar();
        saveToLocalStorage();
    }
}

function setCategoryComplete(category) {
    $(maps[category]).each(function() {
        setMapAsComplete(category, this.toString().replace(/'|,/g, ""));
    });
}

function setCategoryNotComplete(category) {
    $(maps[category]).each(function() {
        setMapAsNotComplete(category, this.toString().replace(/'|,/g, ""));
    });
}

function updateProgressBar() {
    var percentage = 100 * numberOfCompletedMaps / totalNumberOfMaps;
    $("#progress-bar").css("width", percentage+"%").attr("aria-valuenow", numberOfCompletedMaps);
    $("#progress-bar").html(numberOfCompletedMaps.toString() + " / " + totalNumberOfMaps.toString());
}

function displayMissingMaps() {
    var overview = "";
    $.each(maps, function(i, val) {
        var missing = val.filter(function(el) {
            if (completedMaps[i] === undefined) return true;
            return completedMaps[i].indexOf(el.replace(/'|,/g, "")) < 0;
        });
        if (missing.length !== 0) {
            overview += i.replace(/Tier/g, "Tier ") + ": ";
            for (var i = 0; i < missing.length; i++) {
                overview += "<a href=\"http://pathofexile.gamepedia.com/";
                overview += missing[i];
                overview += "_Map\">" + missing[i].replace(/_/g, " ");
                overview += "</a>";
                if (i != missing.length - 1) {
                    overview += ", ";
                }
            }
            overview += "<br>";
        } else {
            $("#collapse" + i).collapse("hide");
        }
    });
    $("#overviewBody").html(overview);
}

function generateMapSelector() {
    $("#mapSelector").append("<h3>Select completed maps</h3>");
    $("#mapSelector").append("<strong>Click map names to toggle which ones you have completed.</strong>");
    $("#mapSelector").append("<div class=\"panel-group\" id=\"panels\">");

    $.each(maps, function(i, val) {
        var bgColor = "#ECECEC";
        $("#panels").append("<div class=\"panel panel-default\" id=\"" + i + "\">");
        $("#" + i).append(" \
        <div class=\"panel-heading\" style=\"background-color:" + bgColor + "\"> \
            <h4 class=\"panel-title\"> \
                <a data-toggle=\"collapse\" href=\"#collapse" + i + "\"> \
                    <strong>" + i.replace(/Tier/g, "Tier ") + "</strong> \
                    <span class=\"glyphicon glyphicon-chevron-down\"></span> \
                </a> \
            </h4> \
        </div> \
        ");

        $("#" + i).append(" \
        <div id=\"collapse" + i + "\" class=\"panel-collapse collapse in\"> \
            <div class=\"panel-body\"> \
                <div class=\"row\" id=\"" + i + "control\" style=\"margin-bottom:15px\"> \
                    <div style=\"padding:5px\"> \
                        <button type=\"button\" style=\"margin-right:10px;\" class=\"btn btn-default\" \
                            onclick=\"setCategoryComplete('" + i + "')\"> \
                            <span class=\"glyphicon glyphicon-ok\"></span> \
                            Mark all maps of this category as completed \
                        </a> \
                        <button type=\"button\" class=\"btn btn-default\" \
                            onclick=\"setCategoryNotComplete('" + i + "')\"> \
                            <span class=\"glyphicon glyphicon-remove\"></span> \
                            Mark all maps of this category as not completed  \
                        </a> \
                    </div> \
                </div> \
                <div class=\"row\" id=\"" + i + "maps\"> \
        ");

        $.each(val, function() {
            $("#" + i + "maps").append(" \
            <div id=\"" + this.replace(/'|,/g, "")
                + "\" style=\"word-wrap:break-word; padding:10px; \
                margin-bottom:7px; margin-top:7px; float:left;\"> \
                <a href=\"#/\" role=\"button\" onclick=\"toggleMapCompletion('" + i + "', '" +
                    this.replace(/'|,/g, "") + "')\" style=\"display:block;\"> \
                    <span class=\"glyphicon glyphicon-remove\"></span> \
                    " + this.replace(/_/g, " ") + " \
                </a> \
            </div> \
            ");
        });
    });

    $("#mapSelector").append("</div>");
}
